/* eslint-disable camelcase */
import axios from 'axios';
// import BuildConfig from 'react-native-config';
import Config from 'react-native-config';

interface ImageResults {
    position: number;
    thumbnail: string;
    original: string;
    source: string;
    title: string;
    link: string;
}

interface ImageResponse {
    images_results: ImageResults[];
}

const imageEndpoint = `https://serpapi.com/search.json?tbm=isch&api_key=${Config.SEARCH_API_KEY}`;

export const imageSearch = async (query: string): Promise<ImageResponse> => {
    const response = await axios.get<ImageResponse>(`${imageEndpoint}&q=${query}`);
    return response.data;
};
