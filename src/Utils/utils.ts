import { FirebaseMLTypes } from '@react-native-firebase/ml';
import { Dimensions } from 'react-native';
import { emojiMap } from '../Screens/Scan/Scan.constants';

export const EMOJI_HEIGHT = 50;
export const EMOJI_WIDTH = 50;
export const EMOJI_GAP = 10;

const interpolateHeight = (height: number, imgHeight: number, layoutHeight: number): number => {
    return (height / imgHeight) * layoutHeight;
};

const interpolateWidth = (width: number, imgWidth: number, layoutWidth: number): number => {
    return (width / imgWidth) * layoutWidth;
};

/**
 *
 * @param originalWidth the original width of the image
 * @param originalHeight the original height of the image
 * @returns the new layout of an image stretched over the screen)
 */
export const getLayoutDimensions = (
    originalWidth: number,
    originalHeight: number,
): { layoutWidth: number; layoutHeight: number } => {
    const aspectRatio = originalWidth / originalHeight;
    if (originalWidth > originalHeight) {
        const width = Dimensions.get('screen').width;
        const height = width / aspectRatio;
        return { layoutWidth: width, layoutHeight: height };
    } else {
        const height = Dimensions.get('screen').height;
        const width = height * aspectRatio;
        return { layoutWidth: width, layoutHeight: height };
    }
};

export interface ParsedResponse {
    emojis: string[];
    boundingBox: {
        top: number;
        left: number;
        bottom: number;
        right: number;
        mid: number;
    };
    emojiBox: {
        id: number;
        overlap: boolean;
        top: number;
        bottom: number;
        right: number;
        left: number;
        mid: number;
    };
    text: string;
}

/**
 * Processes an array from the middle entry outward
 * @param array
 * @param callback
 */
export const processMidOut = <T>(array: T[], callback: (element: T) => void): void => {
    const length = array.length;
    const odd = length % 2; // odd is 0 for an even number, 1 for odd
    const mid = (length - odd) / 2; // succinct, isn't it?

    callback(array[mid]); // process the middle element first

    for (let i = 1; i <= mid; i++) {
        // process mid number of elements
        if (odd || i < mid)
            // process one less element if even
            callback(array[mid + i]); // process the right side element first
        callback(array[mid - i]); // process the left side element next
    }
};

/**
 * Mutates the parsed response by moving emojis boxes outwards
 * @param parsedResponse
 */
const processParsedResponse = (parsedResponse: ParsedResponse[]): void => {
    processMidOut(parsedResponse, midElement => {
        parsedResponse.forEach(orderElem => {
            const targRec = midElement.emojiBox;
            const compRec = orderElem.emojiBox;

            if (targRec.id !== compRec.id) {
                if (
                    targRec.left < compRec.right &&
                    compRec.left < targRec.right &&
                    targRec.top < compRec.bottom &&
                    compRec.top < targRec.bottom
                ) {
                    targRec.overlap = true;
                    // Target rectangle comes before the comparison rectangle
                    // Move target rectangle up
                    if (targRec.id < compRec.id) {
                        targRec.bottom = compRec.top - EMOJI_GAP;
                        targRec.top = targRec.bottom - EMOJI_HEIGHT;
                    }
                    // Target rectangle comes after the comparison rectangle
                    // Move target rectangle down
                    else {
                        targRec.top = compRec.bottom + EMOJI_GAP;
                        targRec.bottom = targRec.top + EMOJI_HEIGHT;
                    }
                }
            }
        });
    });
};

/**
 *
 * @param mlResponse
 * @param imgHeight
 * @param imgWidth
 * @param layoutHeight
 * @param layoutWidth
 * @returns
 */
export const getParsedResponse = (
    mlResponse: FirebaseMLTypes.MLDocumentText,
    imgHeight: number,
    imgWidth: number,
    layoutHeight: number,
    layoutWidth: number,
): ParsedResponse[] => {
    const paragraphs: FirebaseMLTypes.MLDocumentTextParagraph[] = [];

    // Push all of the paragraphs into a single flat array
    mlResponse.blocks.forEach(block => {
        block.paragraphs.forEach(paragraph => {
            paragraphs.push(paragraph);
        });
    });

    // Create parsed response
    const parsedResponse = paragraphs
        // Add emojis if found in the paragraph text
        .map(paragraph => {
            const emojis: string[] = [];
            Object.keys(emojiMap).forEach(name => {
                if (paragraph.text.toLowerCase().includes(name)) {
                    emojis.push(emojiMap[name]);
                }
            });
            emojis.push('ℹ️');
            return { emojis: emojis, boundingBox: paragraph.boundingBox, text: paragraph.text };
        })
        // Filter out all paragraphs containing no emojis
        .filter(paragraph => paragraph.emojis.length > 1)
        // Map this value to a response
        .map((values, index) => {
            const [left, top, right, bottom] = values.boundingBox;
            const topInterpolated = interpolateHeight(top, imgHeight, layoutHeight);
            const bottomInterpolated = interpolateHeight(bottom, imgHeight, layoutHeight);
            const leftInterpolated = interpolateWidth(left, imgWidth, layoutWidth);
            const rightInterpolated = interpolateWidth(right, imgWidth, layoutWidth);

            // Set the bounding box to the interpolated values
            const boundingBox = {
                top: topInterpolated,
                left: leftInterpolated,
                bottom: bottomInterpolated,
                right: rightInterpolated,
                mid: topInterpolated + EMOJI_HEIGHT / 2,
            };

            // Create the emoji box
            const emojiBox = {
                id: index,
                overlap: false,
                top: topInterpolated,
                bottom: topInterpolated + EMOJI_HEIGHT,
                right: rightInterpolated,
                left: leftInterpolated + (rightInterpolated - leftInterpolated) / 2,
                mid: topInterpolated + (bottomInterpolated - topInterpolated) / 2,
            };

            // Return the response
            return {
                emojis: values.emojis,
                boundingBox,
                emojiBox,
                text: values.text,
            };
        });

    // Process the response twice (two passes is usually good)
    processParsedResponse(parsedResponse);
    processParsedResponse(parsedResponse);

    return parsedResponse;
};
