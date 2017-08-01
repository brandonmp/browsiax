// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Routes from '../routes';
import { FullBrowser } from '../browsiax/dist/bundle.js';

type RootType = {
    store: {},
    history: {}
};

export default function Root({ store, history }: RootType) {
    console.log('BROWSIAX', FullBrowser);
    return (
        <Provider store={store}>
            <div style={{ height: '100%', width: '100%' }}>
                <FullBrowser />
            </div>
        </Provider>
    );
}
