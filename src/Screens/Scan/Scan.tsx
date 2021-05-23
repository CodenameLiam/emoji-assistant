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

interface ScanProps {
    navigation: ScanNavProps;
}

interface DimensionProps {
    width: number;
    height: number;
}

interface ParsedResponse {
    emojis: string[];
    boundingBox: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
    emojiBox: {
        top: number;
        bottom: number;
        left: number;
        right: number;
    };
}

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
            return { emojis: emojis, boundingBox: block.boundingBox };
        })
        .filter(block => block.emojis.length > 1)
        .map(values => {
            const boundingBox = {
                top: (values.boundingBox[1] / imgHeight) * Dimensions.get('screen').height,
                bottom: (values.boundingBox[3] / imgHeight) * Dimensions.get('screen').height,
                left: (values.boundingBox[0] / imgWidth) * Dimensions.get('screen').width,
                right: (values.boundingBox[2] / imgWidth) * Dimensions.get('screen').width,
            };
            return { emojis: values.emojis, boundingBox: boundingBox, emojiBox: { ...boundingBox } };
        });

    for (let i = 0; i <= Math.ceil(parsedResponse.length / 2); i++) {
        const upper = Math.ceil(parsedResponse.length / 2) + i;
        const lower = Math.ceil(parsedResponse.length / 2) - i;
        if (i !== 0) {
            if (
                upper < parsedResponse.length &&
                parsedResponse[upper].emojiBox.top - 45 < parsedResponse[upper - 1].emojiBox.bottom
            ) {
                parsedResponse[upper].emojiBox.top = parsedResponse[upper - 1].emojiBox.bottom + 30;
                parsedResponse[upper].emojiBox.bottom = parsedResponse[upper - 1].emojiBox.bottom + 45;
            }
            if (lower >= 0 && parsedResponse[lower].emojiBox.bottom + 45 > parsedResponse[lower + 1].emojiBox.top) {
                parsedResponse[lower].emojiBox.bottom = parsedResponse[lower + 1].emojiBox.top - 30;
                parsedResponse[lower].emojiBox.top = parsedResponse[lower + 1].emojiBox.top - 45;
            }
        }
    }

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
            const mlResponse = await ml().cloudDocumentTextRecognizerProcessImage(data.uri);
            setParsedResponse(getParsedResponse(mlResponse, data.height, data.width));

            setLoading(false);
        }
    };

    return (
        <ScanContainer>
            <CameraPreview captureAudio={false} ref={cameraRef} />
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
                parsedResponse.map((response, index) => (
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
                                points={`${response.boundingBox.left + 50},${response.boundingBox.top + 10} ${
                                    response.boundingBox.left + 110
                                },${response.emojiBox.top + 10} ${response.boundingBox.left + 110},${
                                    response.emojiBox.bottom + 15
                                }`}
                            />
                        </Svg>
                        <EmojiContainer
                            onPress={() => navigation.navigate('Info')}
                            activeOpacity={0.4}
                            style={{
                                top: response.emojiBox.top,
                                left: response.emojiBox.left + 100,
                                width: response.emojis.length * 38,
                                display: showEmojis ? 'flex' : 'none',
                            }}
                        >
                            <Text style={{ fontSize: 40 }}>{response.emojis}</Text>
                        </EmojiContainer>
                    </Fragment>
                ))}
        </ScanContainer>
    );
};

export default Scan;
