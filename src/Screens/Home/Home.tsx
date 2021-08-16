import React, { FC } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeTitle from '../../Components/HomeTitle/HomeTitle';
import PrimaryButton from '../../Components/PrimaryButton/PrimaryButton';
import SecondaryButton from '../../Components/SecondaryButton/SecondaryButton';
import { HomeNavProps } from '../../Navigation/Navigation.constants';

interface HomeProps {
    navigation: HomeNavProps;
}

const Home: FC<HomeProps> = ({ navigation }) => {
    const handleHelp = (): void => navigation.navigate('Help');
    const handleScan = (): void => navigation.navigate('Scan');
    const handleUpload = (): void =>
        launchImageLibrary({ mediaType: 'photo' }, r => {
            if (r.assets) {
                const { uri, width, height } = r.assets[0];
                navigation.navigate('Upload', { uri: uri!, width: width!, height: height! });
            }
        });

    return (
        <SafeAreaView>
            <HomeTitle />
            <PrimaryButton emoji="📷" text="scan" colour="red" onPress={handleScan} />
            <PrimaryButton emoji="📁" text="upload" colour="blue" onPress={handleUpload} />
            <SecondaryButton text="help" onPress={handleHelp} />
        </SafeAreaView>
    );
};

export default Home;
