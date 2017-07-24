// @flow
import { getWebContents } from '../../utils/web-contents-cache.js';

const addEventListeners = (webview, props) => {
    const { startWebviewLoad, finishWebviewLoad, updateTab, tabId } = props;

    webview.addEventListener('did-start-loading', () =>
        startWebviewLoad(tabId)
    );

    webview.addEventListener('did-stop-loading', () => {
        finishWebviewLoad(tabId);
    });

    webview.addEventListener('load-commit', event => {
        const { url, isMainFrame } = event;
        return isMainFrame && updateTab(tabId, { url });
    });
    /* // it's not clear to me what these do that did-start/stop-loading & load-commit won't do
    // they are used in Brave but the code base is way too big to ferret out exactly why that is.
    webview.addEventListener('did-navigate', () => updateTab(tabId));
    webview.addEventListener('did-navigate-in-page', () => updateTab(tabId));
     */
};

export default addEventListeners;
