import React, { FC, useEffect } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';
import Carousel from 'react-native-snap-carousel';
import API from '../../API';
import mockImage from '../../Mock/Image.mock';
import { ExploreNavParams } from '../../Navigation/Navigation.constants';
import { Font } from '../../Theme/Variables';

interface ExploreProps {
    route: ExploreNavParams;
}

const Explore: FC<ExploreProps> = ({ route }) => {
    useEffect(() => {
        (async () => {
            // Actual
            // const images = await API.imageSearch(route.params.text + ' recipe');

            // Debug
            const images = mockImage;
            // console.log(images);
        })();
    }, [route.params.text]);

    return (
        <View style={{ flex: 1 }}>
            <View style={{ marginTop: heightPercentageToDP(4), marginBottom: heightPercentageToDP(4) }}>
                <Carousel
                    loop
                    data={mockImage.images_results.slice(0, 10)}
                    renderItem={({ item }) => (
                        <Image
                            style={{ width: widthPercentageToDP(60), height: 400, borderRadius: 10 }}
                            source={{ uri: item.original }}
                        />
                    )}
                    sliderWidth={Dimensions.get('screen').width}
                    itemWidth={widthPercentageToDP(60)}
                />
            </View>

            <Text
                style={{
                    alignSelf: 'center',
                    fontSize: widthPercentageToDP(3),
                    padding: 30,
                    fontFamily: Font.family,
                    fontWeight: Font.weight,
                    textAlign: 'center',
                }}
            >
                {route.params.text}
            </Text>
        </View>
    );
};

export default Explore;
