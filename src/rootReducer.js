import { combineReducers } from 'redux';
import {
  nuleculesReducer,
  deploymentsReducer,
  bindingsReducer,
  uiReducer,
  jobsReducer,
} from './content/reducer';

export default combineReducers({
  nulecules: nuleculesReducer,
  deployments: deploymentsReducer,
  bindings: bindingsReducer,
  ui: uiReducer,
  jobs: jobsReducer,
});
