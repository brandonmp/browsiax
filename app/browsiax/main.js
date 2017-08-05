// @flow
import React from 'react';
import styled from 'styled-components';
import TabsBar from './containers/TabsBar.js';
import Frame from './containers/Frames';
import NavigationControls from './containers/NavigationControls.js';

const BrowsiaxWrapper = styled.div`
    display: flex;
    flex-flow: column nowrap;
    height: 100%;
    position: relative;
`;

class Browsiax extends React.Component {
    render() {
        return (
            <BrowsiaxWrapper>
                <NavigationControls />
                <TabsBar />
                <Frame />
            </BrowsiaxWrapper>
        );
    }
}

export default Browsiax;
