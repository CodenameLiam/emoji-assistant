import styled from '@emotion/native';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { Colours, Font } from '../../Theme/Variables';

export const PrimaryButtonContainer = styled(TouchableOpacity)`
    height: ${heightPercentageToDP(24) + 'px'};
    margin: ${heightPercentageToDP(3) + 'px'};
    margin-bottom: 0px;
    border-radius: 10px;
    background-color: ${Colours.card};
    justify-content: center;
    align-items: center;
    overflow: hidden;
`;

export const PrimaryButtonGradient = styled(LinearGradient)`
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: ${heightPercentageToDP(3) + 'px'};
`;

export const PrimaryButtonEmoji = styled.Text`
    font-family: ${Font.family};
    font-size: ${heightPercentageToDP(8) + 'px'}; ;
`;

export const PrimaryButtonText = styled.Text`
    color: ${Colours.text};
    font-family: ${Font.family};
    font-weight: ${Font.weight};
    font-size: ${heightPercentageToDP(2.5) + 'px'};
`;
