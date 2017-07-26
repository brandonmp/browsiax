// @flow
import type { Tab } from '../../reducers/tabs.js';
import React from 'react';
import styled from 'styled-components';
import Frame from './Frame.js';

type CreateNewTabPayload = {
    requestingTabId: number,
    createTabProperties: Tab
};
export type Props = {
    tabs: Tab[],
    startWebviewLoad: (tabId: number) => void,
    finishWebviewLoad: (tabId: number) => void,
    updateTab: (tabId: number) => void,
    createNewTab: (payload: CreateNewTabPayload) => void
};

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
`;
const Frames = (props: Props) =>
    <Wrapper>
        {props.tabs.map(t =>
            <Frame
                key={t.tabId}
                {...t}
                currentUrl={t.url}
                createNewTab={props.createNewTab}
                startWebviewLoad={props.startWebviewLoad}
                finishWebviewLoad={props.finishWebviewLoad}
                updateTab={props.updateTab}
            />
        )}
    </Wrapper>;

export default Frames;
