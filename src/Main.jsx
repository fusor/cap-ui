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
import actions, { actionTypes } from './content/actions';
import config from '../config/cap/config';

import io from 'socket.io-client';


////////////////////////////////////////////////////////////
// job socket middleware
////////////////////////////////////////////////////////////
const socket = io(`${config.capServer}/socket.io`);

socket.on('connect', () => dd('connected'))
socket.on('disconnect', () => dd('disconnected'))

const jobsMiddleware = store => next => action => {
  if(action.type != actionTypes.SUBSCRIBE_JOB) {
    next(action);
    return;
  }

  const { token } = action.payload;
  const { nuleculeId } = action.meta;

  // TODO: use true multichannels instead of mux/demuxing the same channel
  socket.on('firehose', msg => {
    const m = JSON.parse(msg);
    store.dispatch(actions.updateJob(m.job_token, m.msg))
  });
};
////////////////////////////////////////////////////////////

const store = createStore(
  rootReducer,
  applyMiddleware(
    thunkMiddleware,
    promiseMiddleware(),
    jobsMiddleware,
    loggerMiddleware()
  )
);

const mountPoint = document.getElementById('main');

ReactDOM.render(
  <Provider store={store}>
    <Routes />
  </Provider>,
  mountPoint
);

function dd(msg) {
  console.debug(msg);
}
