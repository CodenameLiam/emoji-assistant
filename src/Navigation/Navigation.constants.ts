import { StackNavigationProp } from '@react-navigation/stack';

export type AppScreens = {
    Home: undefined;
    Help: undefined;
    Scan: undefined;
    Upload: undefined;
    Info: undefined;
};

export type HomeNavProps = StackNavigationProp<AppScreens, 'Home'>;
export type ScanNavProps = StackNavigationProp<AppScreens, 'Scan'>;
