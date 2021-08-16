import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';

interface ExploreParams {
    text: string;
}

interface UploadParams {
    uri: string;
    height: number;
    width: number;
}

export type AppScreens = {
    Home: undefined;
    Help: undefined;
    Scan: undefined;
    Upload: UploadParams;
    Explore: ExploreParams;
};

export type HomeNavProps = StackNavigationProp<AppScreens, 'Home'>;
export type ScanNavProps = StackNavigationProp<AppScreens, 'Scan'>;
export type ExploreNavParams = RouteProp<AppScreens, 'Explore'>;
export type UploadNavProps = StackNavigationProp<AppScreens, 'Upload'>;
export type UploadNavParams = RouteProp<AppScreens, 'Upload'>;
