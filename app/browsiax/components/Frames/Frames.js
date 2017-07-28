// @flow
import type { Tab } from '../../reducers/tabs.js';
import React from 'react';
import styled from 'styled-components';
import Frame from './Frame.js';

type CreateNewTabPayload =
    | {
          requestingTabId: number,
          createTabProperties: Tab
      }
    | {};
export type Props = {
    tabs: Tab[],
    startWebviewLoad: (tabId: number) => void,
    finishWebviewLoad: (tabId: number) => void,
    updateTab: (tabId: number) => void,
    reportTabNavigationComplete: (tabId: number, newTabData: Object) => void,
    createNewTab: (payload: CreateNewTabPayload) => void
};

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
`;
class Frames extends React.Component {
    props: Props;
    maybeCreateTab = () => {
        if (!this.props.tabs || this.props.tabs.length === 0)
            this.props.createNewTab({});
    };
    componentDidUpdate() {
        this.maybeCreateTab();
    }
    componentDidMount() {
        this.maybeCreateTab();
    }
    render() {
        return (
            <Wrapper>
                {this.props.tabs.map(t =>
                    <Frame
                        key={t.tabId}
                        {...t}
                        currentUrl={t.url}
                        reportTabNavigationComplete={
                            this.props.reportTabNavigationComplete
                        }
                        createNewTab={this.props.createNewTab}
                        startWebviewLoad={this.props.startWebviewLoad}
                        finishWebviewLoad={this.props.finishWebviewLoad}
                        updateTab={this.props.updateTab}
                    />
                )}
            </Wrapper>
        );
    }
}

export default Frames;
