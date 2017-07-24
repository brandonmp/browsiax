// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';
import Browsiax from '../browsiax';

type RootType = {
    store: {},
    history: {}
};

export default function Root({ store, history }: RootType) {
    return (
        <Provider store={store}>
            <div style={{ height: '100%', width: '100%' }}>
                <Browsiax />
            </div>
        </Provider>
    );
}
