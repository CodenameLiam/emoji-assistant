import { StackNavigationProp } from '@react-navigation/stack';

export type AppScreens = {
    Home: undefined;
    Help: undefined;
    Upload: undefined;
    Camera: undefined;
    Info: undefined;
};

export type HomeNavProps = StackNavigationProp<AppScreens, 'Home'>;
