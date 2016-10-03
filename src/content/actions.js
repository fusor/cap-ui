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
};

const actions = {
  loadNulecules: () => {
    const url = getBaseUrl() + '/nulecules';

    return {
      type: actionTypes.LOAD_NULECULES,
      payload: axios(url)
    };
  },
  loadNulecule: (nuleculeId) => {
    const url = getBaseUrl() + '/nulecules/' + nuleculeId;

    return {
      type: actionTypes.LOAD_NULECULE,
      payload: axios(url),
      meta: {
        nuleculeId: nuleculeId
      }
    };
  },
  postAnswers: (nuleculeId, history) => {
    const url = `${getBaseUrl()}/nulecules/${nuleculeId}`;
    // Chaining actions with redux-promise-middleware
    return (dispatch, getState) => { // Thunk
      const postAnswers = getState().nulecules[nuleculeId]
      return dispatch({ // Promise
        type: 'POST_ANSWERS',
        payload: axios.post(url, {nulecule: postAnswers})
      }).then(({value, action}) => {
        const extractIdRegex = /^cap-(.*?)$/;
        const match = extractIdRegex.exec(action.payload.data.nulecule.general.namespace);
        const projectId = match[1];

        dispatch(actions.initDeploy(projectId));

        const reviewPath = `/nulecules/${nuleculeId}/review/${projectId}`;
        history.push(reviewPath);
      });
    }
  },
  answerChanged: (nuleculeId, nodeName, answerKey, newValue) => {
    return {
      type: actionTypes.ANSWER_CHANGED,
      payload: {nuleculeId, nodeName, answerKey, newValue}
    };
  },
  deploy: (nuleculeId, projectId) => {
    const url = `${getBaseUrl()}/nulecules/${nuleculeId}/deploy`;
    return {
      type: actionTypes.DEPLOY,
      payload: axios.post(url),
      meta: { deploymentId: projectId }
    }
  },
  initDeploy: (projectId) => {
    return {
      type: actionTypes.DEPLOY_INIT,
      payload: { projectId }
    }
  }
};

export { actionTypes };
export default actions;
