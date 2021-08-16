import React, { FC } from 'react';
import * as Styles from './HomeTitle.styles';

const HomeTitle: FC = () => (
    <Styles.Container>
        <Styles.Accent>emoji </Styles.Accent>
        <Styles.Text>assistant</Styles.Text>
    </Styles.Container>
);

export default HomeTitle;
