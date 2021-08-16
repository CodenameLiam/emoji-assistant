declare module 'react-native-config' {
    interface Env {
        SEARCH_API_KEY: string;
    }

    const BuildConfig: Env;

    export default BuildConfig;
}
