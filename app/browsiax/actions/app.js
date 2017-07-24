// @flow
import type { Tab } from '../reducers/tabs.js';
import actions from './action-types.js';
import { getWebContents } from '../utils/web-contents-cache.js';
import { isURL, getUrlFromInput } from '../utils/url-util.js';

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
        console.log('LOAD REQUESTED', tabId, newUrl, wc);
        if (wc) wc.loadURL(normalizeUrl(newUrl));
        return {
            type: actions.LOAD_URL_REQUESTED,
            payload: { tabId, newUrl }
        };
    }
};
