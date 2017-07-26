// @flow
import React from 'react';
import Webview from 'react-electron-web-view';
import _ from 'lodash';
import styled from 'styled-components';
import {
    updateWebContents,
    cleanupWebContents
} from '../../utils/web-contents-cache.js';
import addEventListeners from './add-event-listeners.js';

type WebviewOptions = {
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
};

type Props = {
    currentUrl: string,
    isActive: boolean,
    tabId: number,
    history: ?(string[]),
    historyActiveIndex?: number,
    webviewOptions?: ?WebviewOptions
};

type DefaultProps = any;
type State = {
    // we can't just straight set the url by props b/c that forces it to reload the
    // webview every time an action updates the tab URL in state. in the case of
    // navigations that originate in the webview, this means a double-load
    startingUrl: string
};

const Wrapper = styled.div`
    height: 100%;
    width: 100%;
    position: absolute;
    // setting visibility hidden is a little diff't than i'd normally do, but this is how brave does it
    visibility: ${props => (props.isActive ? 'visible' : 'hidden')};
`;
class Frame extends React.Component<DefaultProps, Props, State> {
    state: State;
    webview: HTMLElement;
    static defaultProps = {
        webviewOptions: {
            useragent:
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
        }
    };
    constructor(props: Props) {
        super(props);
        this.state = {
            startingUrl: this.props.currentUrl
        };
        this.webview = null;
    }

    componentWillUnmount() {
        cleanupWebContents(this.props.tabId);
    }

    handleDidAttach = ({ target }: Event) => {
        this.restoreTabHistory(target);
        this.cacheWebContents(target);
        addEventListeners(target, this.props);
    };

    restoreTabHistory = (webview: EventTarget | HTMLElement) => {
        const { history, historyActiveIndex } = this.props;
        if (
            Array.isArray(history) &&
            history.length > 0 &&
            _.isFinite(historyActiveIndex)
        ) {
            const wc = webview.getWebContents();
            wc.history = history;
            wc.goToIndex(historyActiveIndex);
        }
    };
    cacheWebContents = (webview: EventTarget | HTMLElement) => {
        // keep webcontents in cache so we don't have to continually re-fetch
        if (this.props.tabId)
            updateWebContents(this.props.tabId, webview.getWebContents());
    };

    webview: ?HTMLElement = null;
    render() {
        return (
            <Wrapper isActive={this.props.isActive}>
                {/*  webview doesn't seem to fill container w/o flex prop, so assign to actual webview element */}
                <style>{`
                    .react-webview {
                        flex: 1;
                      }
                  `}</style>
                {/* // $FlowFixMe */}
                <Webview
                    // hooks to undocumented event
                    // https://github.com/electron/electron/issues/10042
                    onDidAttach={this.handleDidAttach}
                    autosize
                    ref={e => {
                        this.webview = e;
                    }}
                    partition={'persist:default'}
                    className={`react-webview ${this.props.isActive
                        ? 'active'
                        : ''}`}
                    webpreferences={'scrollBounce=true'} // don't want mac users thinking we're not hip!
                    style={{ width: '100%', height: '100%', display: 'flex' }}
                    src={this.state.startingUrl}
                    {...this.props.webviewOptions}
                />
            </Wrapper>
        );
    }
}

export default Frame;
