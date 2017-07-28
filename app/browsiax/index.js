// @flow
import reducers from './reducers';
import actions from './actions';
import Components from './containers';
import FullBrowser from './main.js';
import actionTypes from './actions/action-types.js';
import runCodeInTab from './utils/run-code-in-tab.js';

export default {
    ...Components,
    FullBrowser,
    actions,
    actionTypes,
    reducers,
    runCodeInTab
};
