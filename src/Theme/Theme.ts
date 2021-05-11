import { DefaultTheme, Theme as NavTheme } from '@react-navigation/native';
import { Colours } from './Variables';

export const Theme: NavTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: Colours.background,
        card: Colours.card,
        text: Colours.text,
    },
};
