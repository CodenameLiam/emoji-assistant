import React, { FC } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeTitle from '../../Components/HomeTitle/HomeTitle';
import PrimaryButton from '../../Components/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton/SecondaryButton';
import { HomeNavProps } from '../../Navigation/Navigation.constants';

interface HomeProps {
    navigation: HomeNavProps;
}

const Home: FC<HomeProps> = ({ navigation }) => {
    const handleHelp = (): void => navigation.navigate('Upload');

    const handleScan = (): void => navigation.navigate('Scan');

    return (
        <SafeAreaView>
            <HomeTitle />
            <PrimaryButton emoji="📷" text="scan" colour="red" onPress={handleScan} />
            <PrimaryButton emoji="📁" text="upload" colour="blue" />
            <SecondaryButton text="help" onPress={handleHelp} />
        </SafeAreaView>
    );
};

export default Home;
