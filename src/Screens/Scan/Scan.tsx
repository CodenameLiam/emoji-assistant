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
import { mock1 } from './Scan.mock1';

interface ScanProps {
    navigation: ScanNavProps;
}

interface DimensionProps {
    width: number;
    height: number;
}

interface ParsedResponse {
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

const interpolateHeight = (height: number, imgHeight: number): number => {
    return (height / imgHeight) * Dimensions.get('screen').height;
};

const interpolateWidth = (width: number, imgWidth: number): number => {
    return (width / imgWidth) * Dimensions.get('screen').width;
};

const EMOJI_HEIGHT = 50;
const EMOJI_WIDTH = 50;
const EMOJI_GAP = 10;

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

const getParsedResponse = (
    mlResponse: FirebaseMLTypes.MLDocumentText,
    imgHeight: number,
    imgWidth: number,
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
            const topInterpolated = interpolateHeight(top, imgHeight);
            const bottomInterpolated = interpolateHeight(bottom, imgHeight);
            const leftInterpolated = interpolateWidth(left, imgWidth);
            const rightInterpolated = interpolateWidth(right, imgWidth);

            const boundingBox = {
                top: topInterpolated,
                left: leftInterpolated,
                bottom: topInterpolated + EMOJI_HEIGHT,
                right: rightInterpolated,
                mid: topInterpolated + EMOJI_HEIGHT / 2,
                // height: bottomInterpolated - topInterpolated,
                // width: rightInterpolated - leftInterpolated,
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

            // const emojiBound = {
            //     id: index
            //     top: topInterpolated + (bottomInterpolated - topInterpolated) / 2,
            //     left: boundingBox.left + (rightInterpolated - leftInterpolated) / 2,
            // }

            // const emojiBox = {
            //     top: boundingBox.top,
            //     left: boundingBox.left,
            //     height: boundingBox.height + EMOJI_HEIGHT,
            // };

            return {
                emojis: values.emojis,
                boundingBox: boundingBox,
                emojiBox,
                // emojiBox: {
                //     ...boundingBox,
                //     id: index,
                //     overlap: false,
                //     left: boundingBox.left + (boundingBox.right - boundingBox.left) / 2,
                //     // height: boundingBox.bottom - boundingBox.top,
                //     // width: values.emojis.length * EMOJI_WIDTH,
                // },
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
            // console.log(orderElem.emojiBox.id);
        });
        // if (response.emojiBox.id < parsedResponse.length / 2) {
        //     console.log('Below is less');
        // }
        // console.log(response.emojiBox.id);

        // response.emojiBox.overlap = true;
    });

    // let i = Math.ceil(parsedResponse.length / 2);
    // let j = i - 1;

    // while (j >= 0) {
    //     j--;
    //     if (i < parsedResponse.length) i++;
    // }

    // for (let i = 0; i < Math.ceil(parsedResponse.length / 2); i++) {
    //     const upper = Math.ceil(parsedResponse.length / 2) + i;
    //     const lower = Math.ceil(parsedResponse.length / 2) - i;

    //     console.log(lower - 1);

    //     const rec1 = parsedResponse[upper].emojiBox;
    //     const rec2 = parsedResponse[upper - 1].emojiBox;

    //     if (rec1.left < rec2.right && rec2.left < rec1.right && rec1.top < rec2.bottom && rec2.top < rec1.bottom) {
    //         // rec1.top = rec2.bottom + EMOJI_GAP;
    //         // rec1.bottom = rec1.top + EMOJI_HEIGHT;
    //         // rec1.height = rec1.bottom - rec1.top;
    //         // rec1.overlap = true;

    //         rec1.top = rec2.bottom + EMOJI_GAP;
    //         rec1.bottom = rec1.top + EMOJI_HEIGHT;
    //         rec1.height = rec1.bottom - rec1.top;
    //         rec1.overlap = true;
    //     }

    //     const rec3 = parsedResponse[lower + 1].emojiBox;
    //     const rec4 = parsedResponse[lower].emojiBox;

    //     if (rec3.left < rec4.right && rec4.left < rec3.right && rec3.top < rec4.bottom && rec4.top < rec3.bottom) {
    //         rec4.bottom = rec3.top - EMOJI_GAP;
    //         rec4.top = rec4.bottom - EMOJI_HEIGHT;
    //         rec4.height = rec4.bottom - rec4.top;
    //         rec4.overlap = true;
    //     }

    // if(parsedResponse[upper].emojiBox.top < parsedResponse[upper - 1].emojiBox.)

    // console.log(upper);

    // console.log(upper);
    // console.log(lower);

    // if (i !== 0) {
    //     if (
    //         upper < parsedResponse.length &&
    //         parsedResponse[upper].emojiBox.top - 45 < parsedResponse[upper - 1].emojiBox.bottom
    //     ) {
    //         parsedResponse[upper].emojiBox.top = parsedResponse[upper - 1].emojiBox.bottom + 30;
    //         parsedResponse[upper].emojiBox.bottom = parsedResponse[upper - 1].emojiBox.bottom + 45;
    //     }
    //     if (lower >= 0 && parsedResponse[lower].emojiBox.bottom + 45 > parsedResponse[lower + 1].emojiBox.top) {
    //         parsedResponse[lower].emojiBox.bottom = parsedResponse[lower + 1].emojiBox.top - 30;
    //         parsedResponse[lower].emojiBox.top = parsedResponse[lower + 1].emojiBox.top - 45;
    //     }
    // }
    // }

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

            // Debug
            // setParsedResponse(getParsedResponse(menu2, data.height, data.width));

            // Actual
            // const mlResponse = await ml().cloudDocumentTextRecognizerProcessImage(data.uri);
            // console.log(JSON.stringify(mlResponse));

            // console.log((406 / data.height) * Dimensions.get('screen').height);
            // console.log(Dimensions.get('screen').height);
            // console.log(data.width);
            const mlResponse: any = mock1;
            setParsedResponse(getParsedResponse(mlResponse, data.height, data.width));

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

                            <View
                                style={{
                                    position: 'absolute',
                                    top: response.boundingBox.top,
                                    height: response.boundingBox.bottom - response.boundingBox.top,
                                    left: response.boundingBox.left,
                                    width: 400,
                                    borderStyle: 'solid',
                                    borderWidth: 2,
                                }}
                            />

                            <EmojiContainer
                                onPress={() => navigation.navigate('Explore', { text: response.text })}
                                activeOpacity={0.4}
                                style={{
                                    top: response.emojiBox.top,
                                    left: response.emojiBox.left,
                                    height: EMOJI_HEIGHT,
                                    width: response.emojis.length * (EMOJI_HEIGHT - 4),
                                    display: showEmojis ? 'flex' : 'none',
                                    backgroundColor: response.emojiBox.overlap ? 'red' : 'white',
                                }}
                            >
                                <Text style={{ position: 'absolute' }}>{response.emojiBox.id}</Text>
                                <Text style={{ fontSize: 40 }}>{response.emojis}</Text>
                            </EmojiContainer>
                        </Fragment>
                    );
                })}
        </ScanContainer>
    );
};

export default Scan;
