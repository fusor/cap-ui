import * as React from 'react';
import { connect } from 'react-redux';
import { Jumbotron } from 'react-bootstrap';
import actions from '../actions';
import axios from 'axios';
import { getHealthCheckUrl } from  '../../shared/api';

import Layout from '../../base/components/Layout';

class NuleculeReviewPage extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { registry, nuleculeId, deploymentId } = this.props.params;
    const prevStatus = this.props.deployments[deploymentId].status;
    const nextStatus = nextProps.deployments[deploymentId].status;

    if(prevStatus === nextStatus) {
      return;
    }

    if(nextStatus === "Waiting for pods...") {
      const nulecule = this.props.nulecules[fullNuleculeId(registry, nuleculeId)];
      const endpoint = this.getEndpoint(nulecule);

      // TODO: Check if they provided the protocol...
      const healthCheck = new HealthCheck(
        endpoint,
        this.handleSuccessfulHealthCheck.bind(this),
        this.handleFailedHealthCheck.bind(this));

      healthCheck.run();

      this.setState({
        endpoint,
        healthCheck,
        status: HealthCheck.StatusEnum.RUNNING
      });
    }
  }
  handleSuccessfulHealthCheck() {
    const { deploymentId } = this.props.params;
    this.props.deployStatusUpdate(deploymentId, "Success!");

    this.setState({
      ...this.state,
      healthCheck: null,
      status: HealthCheck.StatusEnum.SUCCESS
    });
  }
  handleFailedHealthCheck() {
    const { deploymentId } = this.props.params;
    this.props.deployStatusUpdate(deploymentId, "Timed out");

    this.setState({
      ...this.state,
      healthCheck: null,
      status: HealthCheck.StatusEnum.FAILURE
    });
  }
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
          {this.endpointInfo()}
        </Jumbotron>
        {(() => {
          return deploymentStatus === "Pending..." ?
            <button className="btn btn-primary" onClick={onDeployClick}>Deploy</button> :
            null
        })()}
      </Layout>
    );
  }
  endpointInfo(deploymentInfo) {
    if(this.state && this.state.status === HealthCheck.StatusEnum.SUCCESS) {
      const endpoint = `http://${this.state.endpoint}`;
      return (<h3><a href={endpoint}>{endpoint}</a></h3>)
    }
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

class HealthCheck {
  constructor(endpoint, successCb, failureCb) {
    this.endpoint = endpoint;
    this.status = HealthCheck.StatusEnum.RUNNING;

    this._checkUrl = getHealthCheckUrl();
    this._successCb = successCb;
    this._failureCb = failureCb;
    this._TICK_PERIOD = 10000;
    this._TIMEOUT = 180000; // 3 min timeout
    this._debugCount = 0;
  }
  run() {
    this._startTime = Date.now();
    this._interval = setInterval(this._tick.bind(this), this._TICK_PERIOD);
  }
  _tick() {
    this._lastTick = Date.now();

    // Check if we've timed out, if not, ping the service to see if the service
    // is up yet. If it is, report things as healthy and stop.
    if(this._isTimeUp()) {
      this._stopWithStatus(HealthCheck.StatusEnum.FAILURE);
    } else {
      this._pingService().then((status) => {
        if(status === HealthCheck.StatusEnum.SUCCESS &&
           this.status !== HealthCheck.StatusEnum.FAILURE)
        {
          this._stopWithStatus(HealthCheck.StatusEnum.SUCCESS);
        }
      });
    }
  }
  _isTimeUp() {
    const elapsed = Date.now() - this._startTime;
    return elapsed >= this._TIMEOUT;
  }
  _stopWithStatus(status) {
    clearInterval(this._interval);
    this.status = status;

    if(status === HealthCheck.StatusEnum.SUCCESS) {
      this._successCb();
    } else {
      this._failureCb();
    }
  }
  _pingService() {
    const endpoint = this.endpoint;
    return new Promise((resolve, _) => {
      axios.post(this._checkUrl, {host: endpoint}).then(response => {
        if(response.data.is_alive) {
          resolve(HealthCheck.StatusEnum.SUCCESS);
        } else {
          resolve(HealthCheck.StatusEnum.RUNNING);
        }
      });
    });
  }
  get runtime() {
    return this._lastTick - this._startTime;
  }
  static get StatusEnum() {
    return {
      RUNNING: 1,
      SUCCESS: 2,
      FAILURE: 3
    };
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
