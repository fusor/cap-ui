import * as React from 'react';
import { connect } from 'react-redux';
import { Jumbotron } from 'react-bootstrap';
import { Link } from 'react-router';

import Layout from '../../base/components/Layout';
import actions from '../actions'

import '../styles/homePage.scss';

class HomePage extends React.Component {
  componentWillMount() {
    this.props.loadNulecules();
  }

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
          <h3>Select a Nulecule</h3>
          <ul>
            {nList}
          </ul>
        </Jumbotron>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    nulecules: state.nulecules
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadNulecules: () => dispatch(actions.loadNulecules())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage);
