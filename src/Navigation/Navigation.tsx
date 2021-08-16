import { createStackNavigator } from '@react-navigation/stack';
import React, { FC } from 'react';
import Home from '../Screens/Home/Home';
import Explore from '../Screens/Explore/Explore';
import Scan from '../Screens/Scan/Scan';
import Upload from '../Screens/Upload/Upload';
import { AppScreens } from './Navigation.constants';
import { HomeHeader, ScanHeader } from './Navigation.headers';

const Stack = createStackNavigator<AppScreens>();

const Navigation: FC = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={HomeHeader} />
            <Stack.Screen name="Scan" component={Scan} options={ScanHeader} />
            <Stack.Screen name="Upload" component={Upload} />
            <Stack.Screen name="Explore" component={Explore} />
        </Stack.Navigator>
    );
};

export default Navigation;
