// @flow
import type { Tab as TabType } from '../../reducers/tabs.js';
import React from 'react';
import styled from 'styled-components';
import { withHandlers, compose, defaultProps } from 'recompose';
import Tab from '../Tab';
import AddNewFrameIcon from './add-new-frame-icon.png';

type Props = {
    tabs: TabType[],
    createNewTab: () => void,
    closeTab: (tabId: number) => void,
    setActiveTab: (tabId: number) => void
};

const TabsBarWrapper = styled.div`
    display: flex;
    user-select: none;
    flex-flow: row-nowrap;
    justify-content: flex-start;
    align-items: center;
    min-height: 25px;
    background-color: #ddd;
    border-top: 1px solid #bbb;
    padding-top: 2px;
    padding-bottom: 2px;
`;

const NewFrameButton = styled.button`
    cursor: default;
    user-select: none;
    display: inline-block;
    line-height: 25px;
    width: 25px;
    height: 25px;
    font-size: 13px;
    color: #5a5a5a;
    border-radius: 2px;
    margin: 0 3px;
    text-align: center;
    transition: 0.1s opacity;
    user-select: none;
    background: none;
    outline: none;
    border: none;
    margin: 0;
    white-space: nowrap;
    opacity: 0.6;
    &:hover {
        opacity: 1;
    }
`;

const TabsBar = (props: Props) =>
    <TabsBarWrapper>
        {props.tabs.map(t =>
            <Tab
                isAllAlone={props.tabs.length === 1}
                key={t.tabId}
                onTabCloseClick={props.closeTab}
                onTabClick={props.setActiveTab}
                {...t}
            />
        )}
        <NewFrameButton onClick={props.handleNewFrameClick}>
            <img
                alt={'Plus icon on the button to add a new tab'}
                height={'15px'}
                src={AddNewFrameIcon}
            />
        </NewFrameButton>
    </TabsBarWrapper>;

export default compose(
    defaultProps({ onNewFrameClick: () => console.log('NEW FRAME') }),
    withHandlers({
        handleNewFrameClick: props => () => props.createNewTab({})
    })
)(TabsBar);
