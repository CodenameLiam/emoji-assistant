import { useNavigation, useRoute } from '@react-navigation/native';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import { UploadNavParams, UploadNavProps } from '../../Navigation/Navigation.constants';
import { CaptureContainer, EmojiContainer, ScanInfoButton } from '../Scan/Scan.styles';
import ml from '@react-native-firebase/ml';
import { EMOJI_HEIGHT, getLayoutDimensions, getParsedResponse, ParsedResponse } from '../../Utils/utils';
import SecondaryButton from '../../Components/SecondaryButton/SecondaryButton';

const Upload: FC = () => {
    const navigation = useNavigation<UploadNavProps>();
    const route = useRoute<UploadNavParams>();

    const { uri, height, width } = route.params;
    const { layoutWidth, layoutHeight } = getLayoutDimensions(width, height);

    const [parsedResponse, setParsedResponse] = useState<ParsedResponse[]>();
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            const mlResponse = await ml().cloudDocumentTextRecognizerProcessImage(uri);
            const parsedResponse = getParsedResponse(mlResponse, height, width, layoutHeight, layoutWidth);
            setParsedResponse(parsedResponse);
            setLoading(false);
        })();
    }, [height, layoutHeight, layoutWidth, uri, width]);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <View>
                <Image style={{ width: layoutWidth, height: layoutHeight }} source={{ uri }} />
                {parsedResponse &&
                    parsedResponse.map((response, index) => {
                        const { top, left, bottom, mid } = response.emojiBox;

                        return (
                            <Fragment key={index}>
                                <Svg
                                    height={Dimensions.get('screen').height}
                                    width={Dimensions.get('screen').width}
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                    }}
                                >
                                    <Polygon
                                        fill="white"
                                        points={`${left + 1},${top + 10} ${left + 1},${bottom - 10} ${
                                            left - 50
                                        },${mid}`}
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
                                    }}
                                >
                                    <Text style={{ fontSize: 40 }}>{response.emojis}</Text>
                                </EmojiContainer>
                            </Fragment>
                        );
                    })}
            </View>
            <CaptureContainer>
                {loading && <SecondaryButton style={ScanInfoButton} text="processing..." disabled />}
            </CaptureContainer>
        </View>
    );
};

export default Upload;
