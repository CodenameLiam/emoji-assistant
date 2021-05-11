import styled from '@emotion/native';
import { Colours, Font } from '../../Theme/Variables';

export const HomeTitleContainer = styled.View`
    height: 20%;
    justify-content: center;
    align-items: center;
    flex-direction: row;
`;

export const HomeTitleText = styled.Text`
    font-family: ${Font.family};
    font-weight: ${Font.weight};
    color: ${Colours.text};
    font-size: 32px;
`;

export const HomeTitleAccent = styled(HomeTitleText)`
    color: ${Colours.pink};
`;
