import actions, { actionTypes } from './actions';

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

const deploymentsReducer= (prevState={}, action) => {
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
        [meta.deploymentId]: {status: "Success!"}
      });
      break;
  }

  return nextState;
}

export { nuleculesReducer, deploymentsReducer }
