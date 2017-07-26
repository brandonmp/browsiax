// update tab history (get wc.history and active index and store it, if there's a url then append it. if it's 'back' )

/* events we should trakc:
- response received (where resourceType === 'mainFrame'): this is a navigation, either via loadUrl or via clicking a link
-- fetch new history & append new url
- did-navigate-in-page: clicking an anchor tag, etc., wont' trigger response received
- forward/back: will have to trigger these on user actions

*/
// @flow
import type { Tab } from '../reducers/tabs.js';
import actions from './action-types.js';
import { getWebContents } from '../utils/web-contents-cache.js';

const normalizeUrl = function(url) {
    if (isURL(url)) {
        url = getUrlFromInput(url);
    }
    return url;
};
type CreateNewTabPayload = {
    requestingTabId?: string,
    createTabProperties?: Tab
};

export default {
    createNewTab: (payload: CreateNewTabPayload = {}) => {
        return {
            type: actions.NEW_TAB_REQUESTED,
            payload: {
                ...payload,
                createTabProperties: {
                    ...payload.createTabProperties,
                    tabId: new Date().getTime()
                }
            }
        };
    },
    loadURLRequested: (tabId: number, newUrl: string) => {
        const wc = getWebContents(tabId);
        if (wc) wc.loadURL(normalizeUrl(newUrl));
        return {
            type: actions.LOAD_URL_REQUESTED,
            payload: { tabId, newUrl }
        };
    }
};
