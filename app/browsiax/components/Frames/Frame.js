// @flow
import React from 'react';
import Webview from 'react-electron-web-view';
import styled from 'styled-components';

type Props = {
    currentUrl: string,
    isActive: boolean,
    frame: {
        tabId: number
    },
    webviewOptions?: {
        autosize?: boolean,
        nodeintegration?: boolean,
        plugins?: boolean,
        /*
        * note on preload from electron docs:
        * Specifies a script that will be loaded before other scripts run in the guest page. The protocol of
        * script’s URL must be either file: or asar:, because it will be loaded by require in guest page under the hood.
        */
        preload?: string,
        httpreferrer?: string,
        useragent?: string,
        disablewebsecurity?: boolean,
        partition?: string,
        allowpopups?: boolean,
        webpreferences?: string, // this is more a string-like Object, see https://electron.atom.io/docs/api/webview-tag/#webpreferences
        blinkfeatures?: string,
        disableblinkfeatures?: string, // re: the [disable]blinkFeatures props:  https://cs.chromium.org/chromium/src/third_party/WebKit/Source/platform/RuntimeEnabledFeatures.json5?l=62
        guestinstance?: string,
        disableguestresize?: boolean
    }
};

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    // setting visibility hidden is a little diff't than i'd normally do, but this is how brave does it
    visibility: ${props => (props.isActive ? 'visible' : 'hidden')};
`;
const Frame = (props: Props) =>
    <Wrapper isActive={props.isActive}>
        {/*  webview doesn't seem to fill container w/o flex prop */}
        <style>{`
      .react-webview {
          flex: 1;
        }
    `}</style>
        <Webview
            partition={`persist:${props.frame.tabId}`}
            className={'react-webview'}
            style={{ width: '100%', height: '100%', display: 'flex' }}
            src={props.currentUrl}
            {...props.webviewOptions}
        />
    </Wrapper>;

Frame.defaultProps = {
    currentUrl: 'https://www.google.com',
    webviewOptions: {},
    frame: {
        tabId: 0
    }
};

export default Frame;
