// @flow
import type { Tab } from '../reducers/tabs.js';
import actions from './action-types.js';

type CreateNewTabPayload = {
    requestingTabId?: string,
    createTabProperties?: Tab
};

export default {
    createNewTab: (payload: CreateNewTabPayload = {}) => {
        console.log('CREATING NEW TAB', payload);
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
    }
};
