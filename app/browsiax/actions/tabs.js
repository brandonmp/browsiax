// @flow
import actionTypes from './action-types.js';

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
    })
};
