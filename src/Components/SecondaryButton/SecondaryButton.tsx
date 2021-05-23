import React, { FC } from 'react';
import { TouchableOpacityProps } from 'react-native';
import { PrimaryButtonText } from '../PrimaryButton/PrimaryButton.styles';
import { SecondaryButtonContainer } from './SecondaryButton.styles';

interface SecondaryButtonProps extends TouchableOpacityProps {
    text: string;
}

const SecondaryButton: FC<SecondaryButtonProps> = ({ text, onPress, ...rest }) => (
    <SecondaryButtonContainer onPress={onPress} {...rest}>
        <PrimaryButtonText>{text}</PrimaryButtonText>
    </SecondaryButtonContainer>
);

export default SecondaryButton;
