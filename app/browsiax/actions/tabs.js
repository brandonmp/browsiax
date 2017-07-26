// @flow
import actionTypes from './action-types.js';
import { getWebContents } from '../utils/web-contents-cache.js';

type WebContentsMethod = 'goForward' | 'goBack' | 'reload' | 'stop';

const callWebContentsMethod = (
    tabId: number,
    methodName: WebContentsMethod
) => {
    const wc = getWebContents(tabId);
    console.log('CALLING BACK', wc, tabId, methodName);
    if (wc && typeof wc[methodName] === 'function') {
        return wc[methodName]();
    }
};
export default {
    setActiveTab: (tabId: number) => ({
        type: actionTypes.SET_ACTIVE_TAB,
        payload: { tabId }
    }),
    closeTab: (tabId: number) => ({
        type: actionTypes.CLOSE_TAB,
        payload: { tabId }
    }),
    startWebviewLoad: (tabId: number) => ({
        type: actionTypes.WEBVIEW_LOAD_STARTED,
        payload: { tabId }
    }),
    finishWebviewLoad: (tabId: number) => ({
        type: actionTypes.WEBVIEW_LOAD_FINISHED,
        payload: { tabId }
    }),
    updateTab: (tabId: number, newTabData: Object) => ({
        type: actionTypes.TAB_UPDATE_REQUESTED,
        payload: { tabId, newTabData }
    }),

    goForward: (tabId: number) => {
        callWebContentsMethod(tabId, 'goForward');
        return {
            type: actionTypes.GO_FORWARD_REQUESTED,
            payload: { tabId }
        };
    },
    goBack: (tabId: number) => {
        callWebContentsMethod(tabId, 'goBack');
        return {
            type: actionTypes.GO_BACK_REQUESTED,
            payload: { tabId }
        };
    },
    stopLoadingTab: (tabId: number) => {
        callWebContentsMethod(tabId, 'stop');
        return {
            type: actionTypes.STOP_TAB_LOADING_REQUESTED,
            payload: { tabId, newTabData: { isLoading: false } }
        };
    },
    reloadTab: (tabId: number) => {
        callWebContentsMethod(tabId, 'reload');
        return {
            type: actionTypes.RELOAD_TAB_REQUESTED,
            payload: { tabId }
        };
    }
};
