import { combineReducers } from 'redux';
import {
  nuleculesReducer,
  deploymentsReducer,
  bindingsReducer
} from './content/reducer';

export default combineReducers({
  nulecules: nuleculesReducer,
  deployments: deploymentsReducer,
  bindings: bindingsReducer
});
