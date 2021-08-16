import React, { FC } from 'react';
import { View, Text } from 'react-native';
import { ExploreNavParams } from '../../Navigation/Navigation.constants';
import { Font } from '../../Theme/Variables';

interface ExploreProps {
    route: ExploreNavParams;
}

const Explore: FC<ExploreProps> = ({ route }) => {
    return (
        <View style={{ flex: 1 }}>
            <View
                style={{
                    margin: 15,
                    borderRadius: 10,
                    height: 300,
                    backgroundColor: 'silver',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Text
                    style={{
                        fontFamily: Font.family,
                        fontWeight: Font.weight,
                    }}
                >
                    Image Placeholder
                </Text>
            </View>
            <Text
                style={{
                    alignSelf: 'center',
                    fontSize: 20,
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
