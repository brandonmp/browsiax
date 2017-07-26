// @flow
import type { Props } from './Frame.js';
import { getWebContents } from '../../utils/web-contents-cache.js';
import { getDefaultFaviconUrl } from '../../utils/url-util.js';

const getFullTabState = (tabId: number) => {
    const wc = getWebContents(tabId);
    if (!wc) return {};
    const url = wc.getURL();
    return {
        title: wc.getTitle(),
        url,
        history: wc.history,
        historyActiveIndex: wc.getActiveIndex(),
        faviconUrl: getDefaultFaviconUrl(url),
        canGoBack: wc.canGoBack(),
        canGoForward: wc.canGoForward()
    };
};

const addEventListeners = (webview: HTMLElement, props: Props) => {
    const { startWebviewLoad, finishWebviewLoad, updateTab, tabId } = props;

    // these are mostly just to toggle loading spinner
    webview.addEventListener('did-start-loading', () => {
        console.log('START LOAD', event);
        return startWebviewLoad(tabId);
    });
    webview.addEventListener('did-stop-loading', () => {
        finishWebviewLoad(tabId);
    });

    // this is the earliest event after navigation completes, so we'll want to
    // update a bunch of stuff (url, favicon, title, etc.)
    /* webview.addEventListener('did-get-response-details', event => {
        if (event.resourceType === 'mainFrame') {
            console.log('RESPONSE RECEIVED', event);
            updateTab(tabId, getFullTabState(tabId));
        }
    }); */

    // favicons are so awkward to retrieve that electron has an event just for it
    webview.addEventListener('page-favicon-updated', e => {
        if (
            Array.isArray(e.favicons) &&
            e.favicons.length > 0 &&
            typeof e.favicons[0] === 'string'
        ) {
            return updateTab(tabId, { favIconUrl: e.favicons[0] });
        }
    });

    /*     webview.addEventListener('load-commit', event => {
        const { url, isMainFrame } = event;
        if (isMainFrame) {
            return updateTab(tabId, getFullTabState(tabId));
        }
    }); */
    webview.addEventListener('page-title-updated', event => {
        console.log('TITLE UPDATE', event, event.title);
        return updateTab(tabId, { title: event.title });
    });

    webview.addEventListener('did-navigate', () => {
        const newHistoryState = getFullTabState(tabId);
        updateTab(tabId, newHistoryState);
    });
    webview.addEventListener('did-navigate-in-page', () => {
        updateTab(tabId, getFullTabState(tabId));
    });
};

export default addEventListeners;
