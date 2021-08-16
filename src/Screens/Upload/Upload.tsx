import { useNavigation, useRoute } from '@react-navigation/native';
import React, { FC, Fragment, useEffect, useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import Svg, { Polygon } from 'react-native-svg';
import mockImage from '../../Mock/Image.mock';
import { mockScan } from '../../Mock/Scan.mock';
import { UploadNavParams, UploadNavProps } from '../../Navigation/Navigation.constants';
import { EMOJI_HEIGHT, getParsedResponse, ParsedResponse } from '../Scan/Scan';
import { EmojiContainer } from '../Scan/Scan.styles';
import ml, { FirebaseMLTypes } from '@react-native-firebase/ml';
import mockParsed from '../../Mock/Parse.mock';
import mockUpload from '../../Mock/Upload.mock';

interface ImageDimensions {
    height: number;
    width: number;
}

const getLayoutDimensions = (
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

const Upload: FC = () => {
    const navigation = useNavigation<UploadNavProps>();
    const route = useRoute<UploadNavParams>();
    const [parsedResponse, setParsedResponse] = useState<ParsedResponse[]>();
    const { uri, height, width } = route.params;
    const { layoutWidth, layoutHeight } = getLayoutDimensions(width, height);

    // const [imageDimensions, setImageDimensions] = useState<ImageDimensions>(getImageDimensions());

    useEffect(() => {
        // console.log(getImageDimensions(width, height));

        (async () => {
            // console.log(width);
            // console.log(height);
            // if (width > height) {
            //     // console.log('Yes');
            //     const ratio = width / height;
            //     const _width = Dimensions.get('screen').width;
            //     const _height = ratio * _width;
            //     setImageDimensions();
            // }
            // if (imageDimensions) {
            //     // Actual
            //     // const mlResponse = await ml().cloudDocumentTextRecognizerProcessImage(uri);
            //     // Debug
            const mlResponse: any = mockUpload;

            console.log(parsedResponse);
            //     console.log(imageDimensions);
            //     // console.log(JSON.stringify(mlResponse));
            setParsedResponse(getParsedResponse(mlResponse, height, width, layoutHeight, layoutWidth));
            //     // setParsedResponse(mockParsed);
            //     // console.log(getParsedResponse(mlResponse, imageDimensions.height, imageDimensions.width));
            // }
        })();
    }, [height, uri, width]);

    // useEffect(() => {
    //     // console.log(parsedResponse);
    // }, [parsedResponse]);

    // console.log(Dimensions.get('screen').height);
    // console.log(Dimensions.get('screen').width);

    return (
        <View style={{ flex: 1 }}>
            <Image
                style={{ width: layoutWidth, height: layoutHeight }}
                // style={{ flex: 1 }}
                // resizeMode="contain"
                source={{ uri }}
                // onLoad={e => {
                //     const { width, height } = e.nativeEvent.source;
                //     // console.log('Load height ' + e.nativeEvent.source.height);
                //     // console.log('Load width ' + e.nativeEvent.source.width);
                //     // setImageDimensions({ height, width });
                // }}
                // onLayout={e => {
                //     const { width, height, x, y } = e.nativeEvent.layout;
                //     console.log('Layout height ' + height);
                //     console.log('Layout width ' + width);

                //     // setImageDimensions({ height: height - 200, width: width });
                // }}
            />
            {/* <View style={{ position: 'absolute', width: 834, height: 926, backgroundColor: 'red' }} /> */}
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
                                    // display: showEmojis ? 'flex' : 'none',
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
                                    // display: showEmojis ? 'flex' : 'none',
                                    // backgroundColor: response.emojiBox.overlap ? 'red' : 'white',
                                }}
                            >
                                {/* <Text style={{ position: 'absolute' }}>{response.emojiBox.id}</Text> */}
                                <Text style={{ fontSize: 40 }}>{response.emojis}</Text>
                            </EmojiContainer>
                        </Fragment>
                    );
                })}
        </View>
    );
};

export default Upload;
