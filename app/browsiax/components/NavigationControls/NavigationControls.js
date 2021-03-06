// @flow
import type { Tab } from '../../reducers/tabs.js';
import React from 'react';
import styled from 'styled-components';
import AddressBar from './AddressBar.js';
import { withProps, withHandlers, compose } from 'recompose';
import Icons from './icons';

type TabEventHandler = (tabId: number) => void;

type Props = {
    loadURLRequested: (tabId: number, newUrl: string) => void,
    goForward: TabEventHandler,
    goBack: TabEventHandler,
    reloadTab: TabEventHandler,
    activeTab: Tab,
    stopLoadingTab: TabEventHandler,
    // recompose
    handleClickStop: TabEventHandler,
    handleClickBack: TabEventHandler,
    handleClickStop: TabEventHandler,
    handleClickForward: TabEventHandler,
    handleClickReload: TabEventHandler
};

const NavigationControlsWrapper = styled.div`
    display: flex;
    background-color: #ededee;
    width: 100%;
    user-select: none;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
`;

const UrlBar = styled.div`
    min-width: 400px;
    margin-right: 50px;
    border-radius: 7px;
    padding: 10px;
    flex: 3 0 auto;
    display: flex;
    justify-content: flex-start;
    > input {
        max-width: 80%;
    }
`;
const NavButton = styled.button`
    opacity: ${props => (props.disabled ? '0.2' : '0.6')};
    -webkit-app-region: no-drag;
    user-select: none;
    background-color: rgba(0, 0, 0, 0);
    color: #5a5a5a;
    cursor: default;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 4px;
    font-weight: 300;
    outline: none;
    font-size: .6em;
    padding: 3px;
    border: none;
    white-space: nowrap;
    &:hover {
        background: ${props => (props.disabled ? '' : 'white')};
        box-shadow: ${props =>
            props.disabled ? '' : '0px 1px 5px 0px rgba(0, 0, 0, 0.15)'};
    }
`;

const NavIcon = styled.img`
    vertical-align: middle;
    height: 20px;
`;

const NavigationControls = (props: Props) =>
    <NavigationControlsWrapper>
        <NavButton
            onClick={props.handleClickBack}
            disabled={!props.activeTab.canGoBack}
        >
            <NavIcon alt="The back button icon" src={Icons.LeftArrow} />
        </NavButton>
        <NavButton
            onClick={props.handleClickForward}
            disabled={!props.activeTab.canGoForward}
        >
            <NavIcon alt="The forward button icon" src={Icons.RightArrow} />
        </NavButton>
        {props.activeTab.isLoading
            ? <NavButton onClick={props.handleClickStop}>
                  <NavIcon alt="The stop button icon" src={Icons.Stop} />
              </NavButton>
            : <NavButton onClick={props.handleClickReload}>
                  <NavIcon alt="The reload button icon" src={Icons.Refresh} />
              </NavButton>}
        <UrlBar>
            <AddressBar
                loadURLRequested={props.loadURLRequested}
                activeTab={props.activeTab}
            />
        </UrlBar>
    </NavigationControlsWrapper>;

const _buildProps = props => {
    const activeTab = props.tabs.find(({ isActive }) => isActive) || {};
    return {
        activeTab,
        tabId: activeTab.tabId
    };
};

export default compose(
    withProps(_buildProps),
    withHandlers({
        handleClickBack: props => event => {
            console.log('GO BACK NOW YALL', props, props.tabId);
            event.preventDefault();
            props.goBack(props.tabId);
        },
        handleClickForward: props => event => {
            event.preventDefault();
            props.goForward(props.tabId);
        },
        handleClickReload: props => event => {
            event.preventDefault();
            props.reloadTab(props.tabId);
        },
        handleClickStop: props => event => {
            event.preventDefault();
            props.stopLoadingTab(props.tabId);
        }
    })
)(NavigationControls);
