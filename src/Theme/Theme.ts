import { DefaultTheme, Theme as NavTheme } from '@react-navigation/native';
import { Colours } from './Colours';

export const Theme: NavTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: Colours.background,
        card: Colours.card,
        text: Colours.text,
    },
};
