// @flow
import React from 'react';
import styled from 'styled-components';
import AddressBar from './AddressBar.js';

type Props = {
    loadURLRequested: (tabId: number, newUrl: string) => void
};
const NavigationControlsWrapper = styled.div`
    display: flex;
    background-color: #ededee;
    width: 100%;
    flex-flow: row nowrap;
    justify-content: space-around;
    align-items: center;
`;

const UrlBar = styled.div`
    max-width: 60%;
    min-width: 400px;
    max-width: 750px;
    padding: 10px;
`;
const NavigationControls = (props: Props) =>
    <NavigationControlsWrapper>
        <UrlBar>
            <AddressBar
                loadURLRequested={props.loadURLRequested}
                tabs={props.tabs}
            />
        </UrlBar>
    </NavigationControlsWrapper>;

export default NavigationControls;
