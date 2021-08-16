import React, { FC, Fragment, useRef, useState } from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { RNCamera, TakePictureOptions, TrackedTextFeature } from 'react-native-camera';
import {
    CameraPreview,
    CaptureButton,
    CaptureContainer,
    EmojiContainer,
    ScanBackButton,
    ScanContainer,
    ScanInfoButton,
} from './Scan.styles';
import ml, { FirebaseMLTypes } from '@react-native-firebase/ml';
import { data, emojiMap, menu2 } from './Scan.constants';
import { ScanNavProps } from '../../Navigation/Navigation.constants';
import { SafeAreaView } from 'react-native-safe-area-context';
import SecondaryButton from '../../Components/SecondaryButton/SecondaryButton';
import Svg, { Polygon } from 'react-native-svg';
import { mockScan } from '../../Mock/Scan.mock';

interface ScanProps {
    navigation: ScanNavProps;
}

interface DimensionProps {
    width: number;
    height: number;
}

export interface ParsedResponse {
    text: string;
    emojis: string[];
    boundingBox: {
        top: number;
        bottom: number;
        left: number;
        right: number;
        mid: number;
    };
    emojiBox: {
        top: number;
        bottom: number;
        left: number;
        right: number;
        mid: number;
        // height: number;
        // width: number;
        overlap?: boolean;
        id?: number;
    };
}

const interpolateHeight = (height: number, imgHeight: number, layoutHeight: number): number => {
    return (height / imgHeight) * layoutHeight;
};

const interpolateWidth = (width: number, imgWidth: number, layoutWidth: number): number => {
    return (width / imgWidth) * layoutWidth;
};

export const EMOJI_HEIGHT = 50;
const EMOJI_WIDTH = 50;
export const EMOJI_GAP = 10;

const processMidOut = <T,>(array: T[], callback: (element: T) => void): void => {
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

export const getParsedResponse = (
    mlResponse: FirebaseMLTypes.MLDocumentText,
    imgHeight: number,
    imgWidth: number,
    layoutHeight: number,
    layoutWidth: number,
): ParsedResponse[] => {
    const parsedResponse = mlResponse.blocks
        .map(block => {
            const emojis: string[] = [];
            Object.keys(emojiMap).forEach(name => {
                if (block.text.toLowerCase().includes(name)) {
                    emojis.push(emojiMap[name]);
                }
            });
            emojis.push('ℹ️');
            return { emojis: emojis, boundingBox: block.boundingBox, text: block.text };
        })
        .filter(block => block.emojis.length > 1)
        .map((values, index) => {
            const [left, top, right, bottom] = values.boundingBox;
            const topInterpolated = interpolateHeight(top, imgHeight, layoutHeight);
            const bottomInterpolated = interpolateHeight(bottom, imgHeight, layoutHeight);
            const leftInterpolated = interpolateWidth(left, imgWidth, layoutWidth);
            const rightInterpolated = interpolateWidth(right, imgWidth, layoutWidth);

            const boundingBox = {
                top: topInterpolated,
                left: leftInterpolated,
                bottom: bottomInterpolated,
                right: rightInterpolated,
                mid: topInterpolated + EMOJI_HEIGHT / 2,
            };

            const emojiBox = {
                id: index,
                overlap: false,
                top: topInterpolated,
                bottom: topInterpolated + EMOJI_HEIGHT,
                right: rightInterpolated,
                left: leftInterpolated + (rightInterpolated - leftInterpolated) / 2,
                mid: topInterpolated + (bottomInterpolated - topInterpolated) / 2,
            };

            return {
                emojis: values.emojis,
                boundingBox,
                emojiBox,
                text: values.text,
            };
        });

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

    return parsedResponse;
};

const Scan: FC<ScanProps> = ({ navigation }) => {
    const cameraRef = useRef<RNCamera>(null);
    const [capture, setCapture] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showEmojis, setShowEmojis] = useState<boolean>(true);
    // const [dimensions, setDimensions] = useState<DimensionProps>({ height: 4224, width: 1952 });
    // const [mlResponse, setMlResponse] = useState<FirebaseMLTypes.MLDocumentText>(menu2);
    const [parsedResponse, setParsedResponse] = useState<ParsedResponse[]>();

    const handleRetake = (): void => {
        setCapture(false);
        setParsedResponse(undefined);
        cameraRef.current?.resumePreview();
    };

    const handlePicture = async (): Promise<void> => {
        if (cameraRef.current) {
            const options: TakePictureOptions = { base64: true, pauseAfterCapture: true };
            const data = await cameraRef.current.takePictureAsync(options);
            setCapture(true);
            setLoading(true);

            // Actual
            // const mlResponse = await ml().cloudDocumentTextRecognizerProcessImage(data.uri);
            // console.log(JSON.stringify(mlResponse));

            // Debug
            const mlResponse: any = mockScan;
            setParsedResponse(
                getParsedResponse(
                    mlResponse,
                    data.height,
                    data.width,
                    Dimensions.get('screen').height,
                    Dimensions.get('screen').width,
                ),
            );

            setLoading(false);
        }
    };

    return (
        <ScanContainer>
            <CameraPreview ref={cameraRef} captureAudio={false} useNativeZoom />
            <View style={{ flexDirection: 'row' }}>
                <ScanBackButton onPress={() => navigation.navigate('Home')}>
                    <Text>❌</Text>
                </ScanBackButton>
                {capture && (
                    <ScanBackButton onPress={() => setShowEmojis(!showEmojis)}>
                        <Text>👁️</Text>
                    </ScanBackButton>
                )}
            </View>

            <CaptureContainer>
                {!capture && <CaptureButton onPress={handlePicture} />}
                {loading && <SecondaryButton style={ScanInfoButton} text="processing..." disabled />}
                {!loading && capture && (
                    <SecondaryButton style={ScanInfoButton} text="re-take image" onPress={handleRetake} />
                )}
            </CaptureContainer>

            {parsedResponse &&
                parsedResponse.map((response, index) => {
                    const { top, left, bottom, overlap, id, mid } = response.emojiBox;

                    return (
                        <Fragment key={index}>
                            <Svg
                                height={Dimensions.get('screen').height}
                                width={Dimensions.get('screen').width}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    display: showEmojis ? 'flex' : 'none',
                                }}
                            >
                                <Polygon
                                    fill="white"
                                    points={`${left + 1},${top + 10} ${left + 1},${bottom - 10} ${left - 50},${mid}`}
                                />
                            </Svg>

                            {/* <View
                                style={{
                                    position: 'absolute',
                                    top: response.boundingBox.top,
                                    height: response.boundingBox.bottom - response.boundingBox.top,
                                    left: response.boundingBox.left,
                                    width: 400,
                                    borderStyle: 'solid',
                                    borderWidth: 2,
                                }}
                            /> */}

                            <EmojiContainer
                                onPress={() => navigation.navigate('Explore', { text: response.text })}
                                activeOpacity={0.4}
                                style={{
                                    top: response.emojiBox.top,
                                    left: response.emojiBox.left,
                                    height: EMOJI_HEIGHT,
                                    width: response.emojis.length * (EMOJI_HEIGHT - 4),
                                    display: showEmojis ? 'flex' : 'none',
                                    // backgroundColor: response.emojiBox.overlap ? 'red' : 'white',
                                }}
                            >
                                {/* <Text style={{ position: 'absolute' }}>{response.emojiBox.id}</Text> */}
                                <Text style={{ fontSize: 40 }}>{response.emojis}</Text>
                            </EmojiContainer>
                        </Fragment>
                    );
                })}
        </ScanContainer>
    );
};

export default Scan;
