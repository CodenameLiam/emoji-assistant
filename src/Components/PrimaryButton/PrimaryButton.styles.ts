import styled from '@emotion/native';
import { TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colours, Font } from '../../Theme/Variables';

export const PrimaryButtonContainer = styled(TouchableOpacity)`
    height: 200px;
    margin: 20px;
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
    width: 20px;
`;

export const PrimaryButtonEmoji = styled.Text`
    font-family: ${Font.family};
    font-size: 60px;
`;

export const PrimaryButtonText = styled.Text`
    color: ${Colours.text};
    font-family: ${Font.family};
    font-weight: ${Font.weight};
    font-size: 26px;
`;
