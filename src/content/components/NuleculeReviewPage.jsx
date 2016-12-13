import * as React from 'react';
import { connect } from 'react-redux';
import { Jumbotron } from 'react-bootstrap';
import actions from '../actions';
import axios from 'axios';

import Layout from '../../base/components/Layout';

class NuleculeReviewPage extends React.Component {
  render() {
    const { registry, nuleculeId, deploymentId } = this.props.params;
    const fullId = fullNuleculeId(registry, nuleculeId);

    let nulecule;
    if(this.props.nulecules && this.props.nulecules[fullId]) {
      nulecule = this.props.nulecules[fullId];
    }

    let deployment;
    let displayStatus = "Pending...";
    if(this.props.deployments && this.props.deployments[deploymentId]) {
      deployment = this.props.deployments[deploymentId];
      if(deployment.job && this.props.jobs && this.props.jobs[deployment.job]) {
        const job = this.props.jobs[deployment.job];
        displayStatus = job.msg; // Disply last received message
      }
    }

    const onDeployClick = this.props.deploy.bind(this, registry, nuleculeId, deploymentId);
    const displayEndpoint = nulecule ? 'http://' + this.getEndpoint(nulecule) : "no nulecule.";

    return (
      <Layout>
        <Jumbotron className="nulecule-review">
          <h2>Review {nuleculeId}</h2>
        </Jumbotron>
        <Jumbotron>
          <h3>ID: {deploymentId}</h3>
          <h3>Status: {displayStatus}</h3>
          {(() => {
            if(displayStatus === 'Full deployment finished.') {
              return <h3>Endpoint <a href={displayEndpoint}>{displayEndpoint}</a></h3>
            }
          })()}
        </Jumbotron>
        {(() => {
          return displayStatus === "Pending..." ?
            <button className="btn btn-primary" onClick={onDeployClick}>Deploy</button> :
            null
        })()}
      </Layout>
    );
  }

  getEndpoint(nulecule) {
    const nodes = Object.keys(nulecule);
    const endpointNodes = nodes.filter(node => !!nulecule[node].endpoint);
    // TODO: Handle case where we have multiple nodes with endpoint!
    return endpointNodes.length > 0 ?
      nulecule[endpointNodes[0]].endpoint : null
  }
}

function fullNuleculeId(registry, nuleculeId) {
  return `${registry}/${nuleculeId}`;
}

const mapStateToProps = (state) => {
  return {
    nulecules: state.nulecules,
    deployments: state.deployments,
    jobs: state.jobs,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    deploy: function() {
      dispatch(actions.deploy(...arguments))
    },
    deployStatusUpdate: function() {
      dispatch(actions.deployStatusUpdate(...arguments))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NuleculeReviewPage);
