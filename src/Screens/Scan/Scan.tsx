import React, { FC, Fragment, useRef, useState } from 'react';
import { Dimensions, Text, View } from 'react-native';
import { RNCamera, TakePictureOptions } from 'react-native-camera';
import {
    CameraPreview,
    CaptureButton,
    CaptureContainer,
    EmojiContainer,
    ScanBackButton,
    ScanContainer,
    ScanInfoButton,
} from './Scan.styles';
import ml from '@react-native-firebase/ml';
import { ScanNavProps } from '../../Navigation/Navigation.constants';
import SecondaryButton from '../../Components/SecondaryButton/SecondaryButton';
import Svg, { Polygon } from 'react-native-svg';
import { EMOJI_HEIGHT, getParsedResponse, ParsedResponse } from '../../Utils/utils';

interface ScanProps {
    navigation: ScanNavProps;
}

const Scan: FC<ScanProps> = ({ navigation }) => {
    const cameraRef = useRef<RNCamera>(null);
    const [capture, setCapture] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [showEmojis, setShowEmojis] = useState<boolean>(true);
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

            const mlResponse = await ml().cloudDocumentTextRecognizerProcessImage(data.uri);
            const parsedResponse = getParsedResponse(
                mlResponse,
                data.height,
                data.width,
                Dimensions.get('screen').height,
                Dimensions.get('screen').width,
            );
            setParsedResponse(parsedResponse);

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

                            <EmojiContainer
                                onPress={() => navigation.navigate('Explore', { text: response.text })}
                                activeOpacity={0.4}
                                style={{
                                    top: response.emojiBox.top,
                                    left: response.emojiBox.left,
                                    height: EMOJI_HEIGHT,
                                    width: response.emojis.length * (EMOJI_HEIGHT - 4),
                                    display: showEmojis ? 'flex' : 'none',
                                }}
                            >
                                <Text style={{ fontSize: 40 }}>{response.emojis}</Text>
                            </EmojiContainer>
                        </Fragment>
                    );
                })}
        </ScanContainer>
    );
};

export default Scan;
