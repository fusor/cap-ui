import * as React from 'react';
import { connect } from 'react-redux';
import { Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router';

import Layout from '../../base/components/Layout';
import actions from '../actions'

import '../styles/homePage.scss';

class HomePage extends React.Component {
  render() {
    const { nulecules } = this.props;

    const keys = [];
    for(let key in nulecules) {
      if(nulecules.hasOwnProperty(key)) {
        keys.push(key)
      }
    }

    const nList = keys.map((key, idx) => {
      return (
        <li key={idx}><Link to={`/nulecules/${key}`}>{key}</Link></li>
      );
    })

    return (
      <Layout>
        <Jumbotron className="nulecule-list">
          <h3>Credentials</h3>
          <form className="details-form">
            <div className="labeled-group">
              <h5>Organization: </h5>
              <input className="form-control"
                className="org-input"
                type="text"
                value={this.props.ui.details.org}
                placeholder="Organization"
                onChange={this.onDetailChange.bind(this)}/>
            </div>
            <div className="labeled-group">
              <h5>Docker Username: </h5>
              <input className="form-control"
                className="username-input"
                type="text"
                value={this.props.ui.details.username}
                placeholder="Username"
                onChange={this.onDetailChange.bind(this)}/>
            </div>
            <div className="labeled-group">
              <h5>Docker Password: </h5>
              <input className="form-control"
                className="password-input"
                type="password"
                value={this.props.ui.details.password}
                placeholder="Password"
                onChange={this.onDetailChange.bind(this)}/>
            </div>
            <br/>
            <button className="load-nulecules-btn" onClick={this.onLoadNuleculesClick.bind(this)}>
              Load Nulecules
            </button>
            {(() => {
              if(this.props.ui.isLoading) {
                return <img className="loading-gif" src="/static/loading.gif" alt="loading"/>
              }
            })()}
          </form>
        </Jumbotron>
        <Jumbotron className="nulecule-list">
          <h3>Select a Nulecule</h3>
          <ul>
            {nList}
          </ul>
        </Jumbotron>
      </Layout>
    );
  }

  onDetailChange() {
    const details = getDetails();

    this.props.homeDetailChanged(
      details.org,
      details.username,
      details.password
    );
  }

  onLoadNuleculesClick(e) {
    e.preventDefault();

    const details = getDetails();

    this.props.loadNulecules(
      details.org,
      details.username,
      details.password
    )
  }
}

function getDetails() {
  return {
    org: document.getElementsByClassName("org-input")[0].value,
    username: document.getElementsByClassName("username-input")[0].value,
    password: document.getElementsByClassName("password-input")[0].value
  };
}

const mapStateToProps = (state) => {
  return {
    nulecules: state.nulecules,
    ui: state.ui.home,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadNulecules: function() {
      dispatch(actions.loadNulecules.apply(null, arguments))
    },
    homeDetailChanged: function() {
      dispatch(actions.homeDetailChanged.apply(null, arguments))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
