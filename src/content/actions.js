import axios from 'axios';
import { getBaseUrl } from '../shared/api';

const actionTypes = {
  LOAD_NULECULES: 'content.LOAD_NULECULES',
  LOAD_NULECULES_PENDING: 'content.LOAD_NULECULES_PENDING',
  LOAD_NULECULES_FULFILLED: 'content.LOAD_NULECULES_FULFILLED',
  LOAD_NULECULES_REJECTED: 'content.LOAD_NULECULES_REJECTED',
  LOAD_NULECULE: 'content.LOAD_NULECULE',
  LOAD_NULECULE_PENDING: 'content.LOAD_NULECULE_PENDING',
  LOAD_NULECULE_FULFILLED: 'content.LOAD_NULECULE_FULFILLED',
  LOAD_NULECULE_REJECTED: 'content.LOAD_NULECULE_REJECTED',
  ANSWER_CHANGED: 'content.ANSWER_CHANGED',
  DEPLOY: 'content.DEPLOY',
  DEPLOY_PENDING: 'content.DEPLOY_PENDING',
  DEPLOY_FULFILLED: 'content.DEPLOY_FULFILLED',
  DEPLOY_INIT: 'content.DEPLOY_INIT',
  DEPLOY_STATUS_UPDATE: 'content.DEPLOY_STATUS_UPDATE',
  SUBSCRIBE_JOB: 'content.SUBSCRIBE_JOB',
  INIT_JOB: 'content.INIT_JOB',
  UPDATE_JOB: 'content.UPDATE_JOB',
  HOME_DETAIL_CHANGED: 'content.HOME_DETAIL_CHANGED',
};

const actions = {
  homeDetailChanged: (org, username, password) => {
    return {
      type: actionTypes.HOME_DETAIL_CHANGED,
      payload: {org, username, password}
    };
  },
  loadNulecules: (org, username, password) => {
    const url = getBaseUrl() + '/nulecules';

    return {
      type: actionTypes.LOAD_NULECULES,
      payload: axios.post(url, {org, username, password})
    };
  },
  loadNulecule: (registry, nuleculeId) => {
    const url = nuleculeUrl(registry, nuleculeId);
    return {
      type: actionTypes.LOAD_NULECULE,
      payload: axios(url),
      meta: {
        nuleculeId: fullNuleculeId(registry, nuleculeId)
      }
    };
  },
  postAnswers: (registry, nuleculeId, history) => {
    const url = nuleculeUrl(registry, nuleculeId);

    // Chaining actions with redux-promise-middleware
    return (dispatch, getState) => { // Thunk
      const postAnswers = getState().nulecules[fullNuleculeId(registry, nuleculeId)]
      return dispatch({ // Promise
        type: 'POST_ANSWERS',
        payload: axios.post(url, {nulecule: postAnswers})
      }).then(({value, action}) => {
        const extractIdRegex = /^cap-(.*?)$/;
        const match = extractIdRegex.exec(action.payload.data.nulecule.general.namespace);
        const projectId = match[1];

        dispatch(actions.initDeploy(projectId));

        const reviewPath = `/nulecules/${registry}/${nuleculeId}/review/${projectId}`;
        history.push(reviewPath);
      });
    }
  },
  answerChanged: (registry, nuleculeId, nodeName, answerKey, newValue) => {
    return {
      type: actionTypes.ANSWER_CHANGED,
      payload: {
        nuleculeId: fullNuleculeId(registry, nuleculeId),
        nodeName,
        answerKey,
        newValue
      }
    };
  },
  deploy: (registry, nuleculeId, deploymentId) => {
    const url = `${nuleculeUrl(registry, nuleculeId)}/deploy`;

    return (dispatch, getState) => {
      return dispatch({
        type: actionTypes.DEPLOY,
        payload: axios.post(url),
        meta: { deploymentId }
      }).then(({value}) => {
        const token = value.data.job_token;
        console.debug('subscribing to job in deploy...');
        dispatch({
          type: actionTypes.SUBSCRIBE_JOB,
          payload: {token},
          meta: {
            nuleculeId: fullNuleculeId(registry, nuleculeId)
          }
        });

        dispatch(actions.initJob(deploymentId, token))
      });
    }
  },
  initDeploy: (projectId) => {
    return {
      type: actionTypes.DEPLOY_INIT,
      payload: { projectId }
    }
  },
  deployStatusUpdate: (deploymentId, newStatus) => {
    return {
      type: actionTypes.DEPLOY_STATUS_UPDATE,
      payload: {deploymentId, newStatus}
    }
  },
  initJob: (deploymentId, token) => {
    return {
      type: actionTypes.INIT_JOB,
      payload: {deploymentId, token}
    }
  },
  updateJob: (token, msg) => {
    return {
      type: actionTypes.UPDATE_JOB,
      payload: {token, msg}
    }
  }
};

function nuleculeUrl(registry, nuleculeId) {
  return `${getBaseUrl()}/nulecules/${registry}/${nuleculeId}`;
}

function fullNuleculeId(registry, nuleculeId) {
  return `${registry}/${nuleculeId}`;
}

export { actionTypes };
export default actions;
