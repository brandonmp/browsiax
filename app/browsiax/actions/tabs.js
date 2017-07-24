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
    })
};
