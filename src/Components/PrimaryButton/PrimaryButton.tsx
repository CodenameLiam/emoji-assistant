import React, { FC } from 'react';
import { Gradients } from '../../Theme/Variables';
import {
    PrimaryButtonEmoji,
    PrimaryButtonContainer,
    PrimaryButtonGradient,
    PrimaryButtonText,
} from './PrimaryButton.styles';

interface PrimaryButtonProps {
    emoji: string;
    text: string;
    colour: 'red' | 'blue';
}

const PrimaryButton: FC<PrimaryButtonProps> = ({ emoji, text, colour }) => (
    <PrimaryButtonContainer>
        <PrimaryButtonGradient colors={Gradients[colour]} />
        <PrimaryButtonEmoji>{emoji}</PrimaryButtonEmoji>
        <PrimaryButtonText>{text}</PrimaryButtonText>
    </PrimaryButtonContainer>
);
export default PrimaryButton;
