// @flow
import type { Props } from './Frame.js';
import { getWebContents } from '../../utils/web-contents-cache.js';
import { getDefaultFaviconUrl } from '../../utils/url-util.js';
import renderErrorPage from './render-error-page.js';
import networkErrorCodes from './chrome-network-error-codes.js';

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

const fireWhenDOMReady = (tabId, readyFunction: (event: Event) => any) => {
    const wc = getWebContents(tabId);
    wc.once('dom-ready', readyFunction);
};

const addEventListeners = (webview: HTMLElement, props: Props) => {
    const {
        startWebviewLoad,
        finishWebviewLoad,
        createNewTab,
        reportTabNavigationComplete,
        updateTab,
        reportTabDOMReady,
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

    webview.addEventListener(
        'did-fail-load',
        // $FlowFixMe
        ({ errorCode, errorDescription }) => {
            // the errs don't always include descriptions so we'll add our own
            const errorType = networkErrorCodes[String(errorCode)]
            console.warn("PAGPAGE LOAD ERR", errorCode, errorType, tabId);
            // -3 (aborted) isn't really an error the user needs to know about,
            // and it appears to happen quite often during ordinary (and ostensibly successful)
            //  page load events, so we'll suppress it
            if (errorCode === -3) return
            const wc = getWebContents(tabId);
            const errorPageRenderer = renderErrorPage(
                errorCode,
                errorType
            ).toString();
            wc.executeJavaScript(errorPageRenderer);
        }
    );

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

    webview.addEventListener('did-navigate', e => {
        console.log('NAV', e);
        const newHistoryState = getFullTabState(tabId);
        reportTabNavigationComplete(tabId, newHistoryState);
        fireWhenDOMReady(tabId, () =>
            reportTabDOMReady(tabId, { url: getWebContents(tabId).getURL() })
        );
    });
    webview.addEventListener('did-navigate-in-page', e => {
        if (e.isMainFrame === true) {
            console.log('NAV IN PAGE', e);
            reportTabNavigationComplete(tabId, getFullTabState(tabId));
        }
    });
};

export default addEventListeners;
