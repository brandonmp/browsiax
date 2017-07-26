// @flow
import actionTypes from '../actions/action-types.js';

export type Tab = {
    tabId?: number,
    isActive?: boolean, // whether the tab is selected
    favIconUrl?: string,
    title?: string,
    history?: string[],
    historyActiveIndex?: number,
    isLoading?: boolean,
    url?: string,
    canGoBack?: boolean,
    canGoForward?: boolean
};

type TabsState = Tab[];

const makeDefaultTab = (newTabProps = {}) => ({
    isActive: true,
    faviconUrl: '',
    isLoading: false,
    history: [],
    historyActiveIndex: 0,
    title: 'New tab',
    url: 'https://www.google.com',
    canGoForward: false,
    canGoBack: false,
    ...newTabProps
});

const mutateTabInArray = (
    tabsArray: Tab[],
    tabId: number,
    newProps: Tab = {}
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

const spliceInNewTab = (state: Tab[], targetTabId, newTab) => {
    const targetIndex = state.findIndex(t => t.tabId === targetTabId);
    const firstHalf = state.slice(0, targetIndex + 1);
    const secondHalf = state.slice(targetIndex + 1);
    return [...firstHalf, newTab, ...secondHalf];
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
            return payload.createTabProperties && payload.requestingTabId
                ? spliceInNewTab(
                      state,
                      payload.requestingTabId,
                      makeDefaultTab(payload.createTabProperties)
                  )
                : [
                      ...setActiveTab(state, null), // new tab will be active by default
                      makeDefaultTab(payload.createTabProperties)
                  ];
        case actionTypes.SET_ACTIVE_TAB:
            return setActiveTab(state, payload.tabId);
        case actionTypes.CLOSE_TAB:
            return closeTab(state, payload.tabId);
        case actionTypes.WEBVIEW_LOAD_STARTED:
            return mutateTabInArray(state, payload.tabId, { isLoading: true });
        case actionTypes.WEBVIEW_LOAD_FINISHED:
            return mutateTabInArray(state, payload.tabId, {
                ...payload.newTabData,
                isLoading: false
            });
        case actionTypes.TAB_UPDATE_REQUESTED:
            return mutateTabInArray(state, payload.tabId, payload.newTabData);
        case actionTypes.GO_BACK_REQUESTED:
        case actionTypes.GO_FORWARD_REQUESTED:
        default:
            return state;
    }
}
