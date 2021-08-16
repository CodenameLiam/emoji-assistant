import styled from '@emotion/native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { Colours, Font } from '../../Theme/Variables';

export const Container = styled.View`
    height: 20%;
    justify-content: center;
    align-items: center;
    flex-direction: row;
`;

export const Text = styled.Text`
    font-family: ${Font.family};
    font-weight: ${Font.weight};
    color: ${Colours.text};
    font-size: ${heightPercentageToDP(4) + 'px'};
`;

export const Accent = styled(Text)`
    color: ${Colours.pink};
`;
