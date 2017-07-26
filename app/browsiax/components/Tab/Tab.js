// @flow
import React from 'react';
import styled from 'styled-components';
import { withHandlers } from 'recompose';
import { GridLoader } from 'react-spinners';
import ReactImageFallback from 'react-image-fallback';
import CloseButton, { CloseIcon } from './CloseButton.js';
import FallbackFaviconImage from './fallback-favicon.png';

type Props = {
    title: string,
    tabId: string,
    isLoading: boolean,
    faviconUrl: string,
    isActive: boolean,
    onTabClick: (tabId: string) => void,
    onTabCloseClick: (tabId: string) => void,
    // recompose
    handleClick: () => void,
    handleCloseClick: () => void
};

const TabWrapper = styled.div`
    height: 30px;
    user-select: none;
    border-radius: 2px 2px 0px 0px;
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
const FaviconWrapper = styled.div`min-width: 15px;`;
const Label = styled.div`
    margin-right: 10px;
    margin-left: 5px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const FaviconImage = styled.img`vertical-align: sub;`;
const Tab = (props: Props) =>
    <TabWrapper
        isLoading={props.isLoading}
        onClick={props.handleClick}
        isActive={props.isActive}
    >
        <FaviconWrapper>
            {props.isLoading
                ? <GridLoader size={3} margin={1} loading={props.isLoading} />
                : typeof props.faviconUrl === 'string' &&
                  <ReactImageFallback
                      src={props.faviconUrl}
                      fallbackImage={FallbackFaviconImage}
                      height={'15px'}
                      style={{ verticalAlign: 'sub' }}
                      alt="This site's favicon."
                  />}
        </FaviconWrapper>
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
    handleClick: props => () =>
        !props.isActive && props.onTabClick(props.tabId),
    handleCloseClick: props => event => {
        // since it's a nested component we have to stop the close from propagating up
        event.stopPropagation();
        props.onTabCloseClick(props.tabId);
    }
})(Tab);
