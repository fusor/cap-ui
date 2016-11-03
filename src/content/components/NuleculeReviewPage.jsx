import * as React from 'react';
import { connect } from 'react-redux';
import { Jumbotron } from 'react-bootstrap';
import actions from '../actions';

import Layout from '../../base/components/Layout';

class NuleculeReviewPage extends React.Component {
  render() {
    const { registry, nuleculeId, deploymentId } = this.props.params;

    let nulecule;
    if(this.props.nulecules && this.props.nulecules[nuleculeId]) {
      nulecule = this.props.nulecules[nuleculeId];
    }

    let deployment;
    let deploymentStatus = "Pending...";
    if(this.props.deployments && this.props.deployments[deploymentId]) {
      deployment = this.props.deployments[deploymentId];
      deploymentStatus = deployment.status;
    }

    const onDeployClick = this.props.deploy.bind(this, registry, nuleculeId, deploymentId);

    return (
      <Layout>
        <Jumbotron className="nulecule-review">
          <h2>Review {nuleculeId}</h2>
        </Jumbotron>
        <Jumbotron>
          <h3>ID: {deploymentId}</h3>
          <h3>Status: {deploymentStatus}</h3>
        </Jumbotron>
        {(() => {
          return deploymentStatus === "Pending..." ?
            <button className="btn btn-primary" onClick={onDeployClick}>Deploy</button> :
            null
        })()}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    nulecules: state.nulecules,
    deployments: state.deployments
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deploy: function() {
      dispatch(actions.deploy(...arguments))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NuleculeReviewPage);
