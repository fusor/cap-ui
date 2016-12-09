import actions, { actionTypes } from './actions';

const defaultUi= {
  home: {
    details: {
      org: "fusordevel",
      username: "",
      password: "",
    },
    isLoading: false,
  }
};

const uiReducer = (prevState=defaultUi, action) => {
  let nextState = prevState;
  const {type, payload} = action;

  let newHome;

  switch(action.type) {
    case actionTypes.LOAD_NULECULES_PENDING:
      newHome = Object.assign({}, prevState.home, {isLoading: true});
      nextState = Object.assign({}, prevState, {home: newHome});
      break;
    case actionTypes.LOAD_NULECULES_FULFILLED:
    case actionTypes.LOAD_NULECULES_REJECTED:
      newHome = Object.assign({}, prevState.home, {isLoading: false});
      nextState = Object.assign({}, prevState, {home: newHome});
      break;
    case actionTypes.HOME_DETAIL_CHANGED:
      newHome = Object.assign({}, prevState.home, {details: payload});
      nextState = Object.assign({}, prevState, {home: newHome});
      break;
  }

  return nextState;
};

const nuleculesReducer = (prevState={}, action) => {
  let nextState = prevState;
  const {type, payload, meta} = action;

  switch(action.type) {
    case actionTypes.LOAD_NULECULES_FULFILLED:
      nextState = payload.data.nulecules.reduce((nulecules, id) => {
        nulecules[id] = {};
        return nulecules;
      }, {});
      break;
    case actionTypes.LOAD_NULECULE_FULFILLED:
      nextState = Object.assign({}, prevState, {
        [action.meta.nuleculeId]: payload.data.nulecule
      });
      break;
    case actionTypes.ANSWER_CHANGED:
      const nulecule = prevState[payload.nuleculeId];
      const node = nulecule[payload.nodeName]
      const newNode = Object.assign({}, node, {
        [payload.answerKey]: payload.newValue
      });
      nulecule[payload.nodeName] = newNode;
      nextState = Object.assign({}, prevState, {
        [payload.nuleculeId]: nulecule
      });
      break;
  }

  return nextState;
}

const deploymentsReducer = (prevState={}, action) => {
  let nextState = prevState;
  const {type, payload, meta} = action;
  let deploymentId;

  switch(action.type) {
    case actionTypes.DEPLOY_INIT:
      nextState = Object.assign({}, prevState, {
        [action.payload.projectId]: {status: "Pending..."}
      });
      break;
    case actionTypes.DEPLOY_PENDING:
      nextState = Object.assign({}, prevState, {
        [meta.deploymentId]: {status: "Running..."}
      });
      break;
    case actionTypes.DEPLOY_FULFILLED:
      nextState = Object.assign({}, prevState, {
        [meta.deploymentId]: {status: "Waiting for pods..."}
      });
      break;
    case actionTypes.DEPLOY_STATUS_UPDATE:
      nextState = Object.assign({}, prevState, {
        [payload.deploymentId]: {status: payload.newStatus}
      });
      break;
    case actionTypes.INIT_JOB:
      const deployment = prevState[payload.deploymentId];
      const newDeployment = Object.assign({}, deployment, {job: payload.token});
      nextState = Object.assign({}, prevState, {
        [payload.deploymentId]: newDeployment
      });
      break;
  }

  return nextState;
}

const bindingsReducer = (prevState={}, action) => {
  let nextState = prevState;
  const {type, payload, meta} = action;

  switch(action.type) {
    case actionTypes.LOAD_NULECULE_FULFILLED:
      nextState = Object.assign({}, prevState, {
        [action.meta.nuleculeId]: payload.data.bindings
      });
      break;
  }

  return nextState;
}

const jobsReducer = (prevState={}, action) => {
  let nextState = prevState;
  const {type, payload, meta} = action;

  switch(action.type) {
    case actionTypes.UPDATE_JOB:
      const {token, msg} = payload;
      nextState = Object.assign({}, prevState, {
        [token]: {
          msg,
          updated: Date.now()
        }
      });
      break;
  }

  return nextState;
}

export {
  nuleculesReducer,
  deploymentsReducer,
  bindingsReducer,
  uiReducer,
  jobsReducer,
}
