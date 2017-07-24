// @flow
import React from 'react';
import styled from 'styled-components';
import CloseButton, { CloseIcon } from './CloseButton.js';
import { withHandlers } from 'recompose';

type Props = {
    title: string,
    tabId: string,
    isActive: boolean,
    onTabClick: (tabId: string) => void,
    onTabCloseClick: (tabId: string) => void,
    // recompose
    handleClick: () => void,
    handleCloseClick: () => void
};

const TabWrapper = styled.div`
    height: 30px;
    flex: 1;
    box-sizing: border-box;
    max-width: 175px;
    min-width: 50px;
    cursor: default;
    padding: 5px;
    display: flex;
    border-right: 1px solid #bbb;
    border-top: 1px solid #bbb;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
    background-color: ${props =>
        props.isActive ? 'rgb(240,240,242)' : 'rgba(0,0,0,0)'};
    &:hover {
        background-image: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.8),
            rgba(250, 250, 250, 0.4)
        );
    }
    &:hover ${CloseIcon} {
        opacity: 1;
    }
`;

const Label = styled.div`margin-right: 10px;`;
const Tab = (props: Props) =>
    <TabWrapper onClick={props.handleClick} isActive={props.isActive}>
        <Label>
            {props.title}
        </Label>
        <CloseButton handleCloseClick={props.handleCloseClick} />
    </TabWrapper>;

Tab.defaultProps = {
    label: 'Unknown title',
    isActive: false
};
export default withHandlers({
    handleClick: props => () => props.onTabClick(props.tabId),
    handleCloseClick: props => event => {
        // since it's a nested component we have to stop the close from propagating up
        event.stopPropagation();
        props.onTabCloseClick(props.tabId);
    }
})(Tab);
