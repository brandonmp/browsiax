// @flow
import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';
import browsiax from '../browsiax/reducers';

const rootReducer = combineReducers({
    router,
    ...browsiax
});

export default rootReducer;
