import 'react-native-gesture-handler';
import React, { FC } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Navigation from './src/Navigation/Navigation';
import { Theme } from './src/Theme/Theme';

const App: FC = () => (
    <NavigationContainer theme={Theme}>
        <Navigation />
    </NavigationContainer>
);

export default App;
