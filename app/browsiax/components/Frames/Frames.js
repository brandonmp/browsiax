// @flow
import type { Tab } from '../../reducers/tabs.js';
import React from 'react';
import styled from 'styled-components';
import Frame from './Frame.js';

type Props = {
    tabs: Tab[]
};
const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
`;
const Frames = (props: Props) =>
    <Wrapper>
        {props.tabs.map(t => <Frame key={t.tabId} {...t} currentUrl={t.url} />)}
    </Wrapper>;

export default Frames;
