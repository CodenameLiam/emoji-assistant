import { createStackNavigator } from '@react-navigation/stack';
import React, { FC } from 'react';
import Home from '../Screens/Home/Home';
import Upload from '../Screens/Upload/Upload';
import { AppScreens } from './Navigation.constants';
import { HomeHeader } from './Navigation.headers';

const Stack = createStackNavigator<AppScreens>();

const Navigation: FC = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home" component={Home} options={HomeHeader} />
            <Stack.Screen name="Upload" component={Upload} />
        </Stack.Navigator>
    );
};

export default Navigation;
