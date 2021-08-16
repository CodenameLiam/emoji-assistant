import styled from '@emotion/native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { PrimaryButtonContainer } from '../PrimaryButton/PrimaryButton.styles';

export const SecondaryButtonContainer = styled(PrimaryButtonContainer)`
    height: ${heightPercentageToDP(8) + 'px'}; ;
`;
