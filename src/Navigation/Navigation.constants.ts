import { RouteProp } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';

interface ExploreParams {
    text: string;
}

export type AppScreens = {
    Home: undefined;
    Help: undefined;
    Scan: undefined;
    Upload: undefined;
    Explore: ExploreParams;
};

export type HomeNavProps = StackNavigationProp<AppScreens, 'Home'>;
export type ScanNavProps = StackNavigationProp<AppScreens, 'Scan'>;
export type ExploreNavParams = RouteProp<AppScreens, 'Explore'>;
