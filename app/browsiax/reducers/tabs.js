// @flow
import actionTypes from '../actions/action-types.js';

export type Tab = {
    tabId: number,
    isActive: boolean, // whether the tab is selected
    favIconUrl: string,
    title: string,
    url: string
};

type TabsState = Tab[];

type TabsActionPayload =
    | {
          requestingTabId: ?string,
          createTabProperties: Tab
      }
    | { tabId: number };

const defaultTabsState = [];
const makeDefaultTab = () => ({
    isActive: true,
    favIconUrl: '',
    title: 'New tab',
    url: 'https://www.google.com'
});

const setActiveTab = (state, activeTabId) =>
    state.map(t => ({ ...t, isActive: t.tabId === activeTabId }));

const closeTab = (state, targetTabId) => {
    // if closing tab is active, we have to pick a replacement
    const targetTabIndex = state.findIndex((t, idx) => targetTabId === t.tabId);
    console.log('TARGET TAB', state[targetTabIndex], targetTabIndex);
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
    console.log('RETURNING STATE', state);
    return tabsWithNewActive.filter(t => t.tabId !== targetTabId);
};

export default function tabs(
    state: TabsState = defaultTabsState,
    {
        type,
        payload
    }: {
        type: string,
        payload: TabsActionPayload
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
        default:
            return state;
    }
}
