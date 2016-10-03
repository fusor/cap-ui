import React from 'react';
import {
  Router, Route, IndexRoute, hashHistory
} from 'react-router';

import NuleculePage from './content/components/NuleculePage';
import NuleculeReviewPage from './content/components/NuleculeReviewPage';
import HomePage from './content/components/HomePage';

const Routes = () => {
  return (
    <Router history={hashHistory}>
      <Route path="/" component={HomePage} />
      <Route path="/nulecules/:nuleculeId" component={NuleculePage} />
      <Route path="/nulecules/:nuleculeId/review/:deploymentId" component={NuleculeReviewPage} />
    </Router>
  );
};

export default Routes;
