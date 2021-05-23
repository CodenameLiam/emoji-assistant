import React, { FC } from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Gradients } from '../../Theme/Variables';
import {
    PrimaryButtonEmoji,
    PrimaryButtonContainer,
    PrimaryButtonGradient,
    PrimaryButtonText,
} from './PrimaryButton.styles';

interface PrimaryButtonProps extends TouchableOpacityProps {
    emoji: string;
    text: string;
    colour: 'red' | 'blue';
}

const PrimaryButton: FC<PrimaryButtonProps> = ({ emoji, text, colour, ...rest }) => (
    <PrimaryButtonContainer {...rest}>
        <PrimaryButtonGradient colors={Gradients[colour]} />
        <PrimaryButtonEmoji>{emoji}</PrimaryButtonEmoji>
        <PrimaryButtonText>{text}</PrimaryButtonText>
    </PrimaryButtonContainer>
);
export default PrimaryButton;
