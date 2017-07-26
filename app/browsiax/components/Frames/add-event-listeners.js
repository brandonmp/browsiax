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
    const {
        startWebviewLoad,
        finishWebviewLoad,
        createNewTab,
        updateTab,
        tabId
    } = props;

    // these are mostly just to toggle loading spinner
    webview.addEventListener('did-start-loading', () => {
        console.log('START LOAD', event);
        return startWebviewLoad(tabId);
    });
    webview.addEventListener('did-stop-loading', () => {
        finishWebviewLoad(tabId);
    });

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

    // intercept popups into new tabs
    webview.addEventListener('new-window', event => {
        console.log('NEW WINDOW REQUESTED', event);
        createNewTab({
            requestingTabId: tabId,
            createTabProperties: {
                url: event.url,
                isActive: false
            }
        });
        finishWebviewLoad(tabId);
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
