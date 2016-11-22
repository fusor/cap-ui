import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import loggerMiddleware from 'redux-logger';
import promiseMiddleware from 'redux-promise-middleware';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
import Layout from './base/components/Layout';
import rootReducer from './rootReducer';
import Routes from './Routes';

import io from 'socket.io-client';

const store = createStore(
  rootReducer,
  applyMiddleware(thunkMiddleware, promiseMiddleware(), loggerMiddleware())
);

const mountPoint = document.getElementById('main');

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  mountPoint
);

dd('attempting to connect to socket');

const socket = io();

socket.on('connect', () => {
  dd('connected')
});

socket.on('firehose', (msg) => {
  dd('ff -> ' + msg)
});

socket.on('disconnect', () => {
  dd('disconnected')
});

function dd(msg) {
  console.debug(msg);
}
