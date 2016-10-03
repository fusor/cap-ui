import { combineReducers } from 'redux';
import { nuleculesReducer, deploymentsReducer } from './content/reducer';

export default combineReducers({
  nulecules: nuleculesReducer,
  deployments: deploymentsReducer,
});
