// @flow
import actionTypes from '../actions/action-types.js';
import { getWebContents } from '../utils/web-contents-cache.js';
import { getDefaultFaviconUrl } from '../utils/url-util.js';

export type Tab = {
    tabId: number,
    isActive: boolean, // whether the tab is selected
    favIconUrl: string,
    title: string,
    isLoading: boolean,
    url: string
};

type TabsState = Tab[];

type TabsActionPayload =
    | {
          requestingTabId: ?string,
          createTabProperties: Tab
      }
    | { tabId: number };

const makeDefaultTab = () => ({
    isActive: true,
    favIconUrl: '',
    isLoading: false,
    title: 'New tab',
    url: 'https://www.google.com'
});

// **** helpers
const getTabState = (tabId: number, tabsArray: Tab[]) => {
    const wc = getWebContents(tabId);
    if (!wc) return tabsArray.find(t => t.tabId === tabId) || {};
    const url = wc.getURL();
    return {
        title: wc.getTitle(),
        url,
        faviconUrl: getDefaultFaviconUrl(url)
    };
};

const mutateTabInArray = (
    tabsArray: Tab[],
    tabId: number,
    newProps: Tab | {} = {}
) => tabsArray.map(t => (t.tabId === tabId ? { ...t, ...newProps } : t));

// ****  handlers
const setActiveTab = (state, activeTabId) =>
    state.map(t => ({ ...t, isActive: t.tabId === activeTabId }));

const closeTab = (state, targetTabId) => {
    // if closing tab is active, we have to pick a replacement
    const targetTabIndex = state.findIndex(t => targetTabId === t.tabId);
    // set either the one right before the closing tab (or the one after it, if closing tab was the first tab) as active
    const tabsWithNewActive = state[targetTabIndex].isActive
        ? state.map(
              (t, idx) =>
                  (targetTabIndex === 0 && idx === 1) ||
                  idx === targetTabIndex - 1
                      ? { ...t, isActive: true }
                      : t
          )
        : state;
    return tabsWithNewActive.filter(t => t.tabId !== targetTabId);
};

const defaultTabsState = [];
export default function tabs(
    state: TabsState = defaultTabsState,
    {
        type,
        payload
    }: {
        type: string,
        payload: {
            requestingTabId?: ?string,
            createTabProperties?: Tab,
            newTabData: Tab,
            tabId: number // this is technically optional but i don't quite get flow's union types atm
        }
    }
) {
    switch (type) {
        case actionTypes.NEW_TAB_REQUESTED:
            return [
                ...setActiveTab(state, null), // new tab will be active by default
                { ...makeDefaultTab(), ...payload.createTabProperties }
            ];
        case actionTypes.SET_ACTIVE_TAB:
            return setActiveTab(state, payload.tabId);
        case actionTypes.CLOSE_TAB:
            return closeTab(state, payload.tabId);
        case actionTypes.WEBVIEW_LOAD_STARTED:
            return mutateTabInArray(state, payload.tabId, { isLoading: true });
        case actionTypes.WEBVIEW_LOAD_FINISHED:
            return mutateTabInArray(state, payload.tabId, {
                ...getTabState(payload.tabId, state),
                isLoading: false
            });
        case actionTypes.TAB_UPDATE_REQUESTED:
            return payload.newTabData
                ? mutateTabInArray(state, payload.tabId, payload.newTabData)
                : mutateTabInArray(
                      state,
                      payload.tabId,
                      getTabState(payload.tabId, state)
                  );
        default:
            return state;
    }
}
