import styled, { css } from '@emotion/native';
import { RNCamera } from 'react-native-camera';
import { Theme } from '../../Theme/Theme';

const CAPTURE_BUTTON_DIMENSIONS = '80';
const BACK_BUTTON_DIMENSIONS = '50';
const EMOJI_BUTTON_DIMENSIONS = '40';

// Container
export const ScanContainer = styled.SafeAreaView`
    flex: 1;
`;

// Back button
export const ScanBackButton = styled.TouchableOpacity`
    align-items: center;
    justify-content: center;
    margin: 20px;
    margin-left: 10px;
    margin-right: 0px;
    width: ${BACK_BUTTON_DIMENSIONS}px;
    height: ${BACK_BUTTON_DIMENSIONS}px;
    border-radius: ${BACK_BUTTON_DIMENSIONS}px;
    background-color: ${Theme.colors.background};
`;

export const ScanInfoButton = css`
    width: 90%;
`;

// Capture image button container
export const CaptureContainer = styled.View`
    position: absolute;
    width: 100%;
    bottom: 0;
    height: 120px;
    align-items: center;
`;

// Capture image button
export const CaptureButton = styled.TouchableOpacity`
    width: ${CAPTURE_BUTTON_DIMENSIONS}px;
    height: ${CAPTURE_BUTTON_DIMENSIONS}px;
    border-radius: ${CAPTURE_BUTTON_DIMENSIONS}px;
    border: 5px solid #fff;
`;

// Camera component
export const CameraPreview = styled(RNCamera)`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
`;

export const EmojiContainer = styled.TouchableOpacity`
    position: absolute;
    height: ${EMOJI_BUTTON_DIMENSIONS}px;
    /* width: 80px; */
    border-radius: 10px;
    background-color: #fff;
`;
