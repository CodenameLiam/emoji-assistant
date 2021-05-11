import React, { FC } from 'react';
import { HomeTitleContainer, HomeTitleAccent, HomeTitleText } from './HomeTitle.styles';

const HomeTitle: FC = () => (
    <HomeTitleContainer>
        <HomeTitleAccent>emoji </HomeTitleAccent>
        <HomeTitleText>assistant</HomeTitleText>
    </HomeTitleContainer>
);

export default HomeTitle;
