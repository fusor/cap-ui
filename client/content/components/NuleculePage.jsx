import * as React from 'react';
import { connect } from 'react-redux';
import { Jumbotron } from 'react-bootstrap';
import JSONPretty from 'react-json-pretty';
import actions from '../actions';

import Layout from '../../base/components/Layout';
import GraphNodeForm from './GraphNodeForm';

class NuleculePage extends React.Component {
  componentWillMount() {
    this.props.loadNulecule(this.props.params.nuleculeId);
  }
  render() {
    const { nuleculeId } = this.props.params;

    let nulecule;
    if(this.props.nulecules && this.props.nulecules[nuleculeId]) {
      nulecule = this.props.nulecules[nuleculeId];
    }

    const renderJson = (header, json) => {
      if(json) {
        return (
          <div>
            <h3>{header}</h3>
            <JSONPretty id="nulecule-json" json={json}></JSONPretty>
          </div>
        )
      } else {
        return null;
      }
    }

    const renderGraphNodes = () => {
      return Object.keys(nulecule)
          .filter((key) => key !== 'general')
          .map((nodeName, idx) => {
            return <GraphNodeForm key={idx}
                name={nodeName}
                answers={nulecule[nodeName]}
                onAnswerChange={this.props.answerChanged.bind(null, nuleculeId, nodeName)} />
          });
    };

    let content;
    if(nulecule) {
      content = (
        <div>
          {renderJson("General", nulecule.general)}
          {renderGraphNodes()}
        </div>
      )
    } else {
      // No content yet, loading
      content = (
        <Jumbotron>
          <h2>Loading...</h2>
        </Jumbotron>
      )
    }

    const onButtonClick = this.props.postAnswers.bind(this, nuleculeId)

    return (
      <Layout>
        <Jumbotron className="nulecule-detail">
          <h2>{nuleculeId} detail page.</h2>
        </Jumbotron>
        {content}
        <button className="btn btn-primary" onClick={onButtonClick}>Review</button>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    nulecules: state.nulecules
  };
};

const mapDispatchToProps = (dispatch, props, state) => {
  return {
    loadNulecules: () => dispatch(actions.loadNulecules()),
    loadNulecule: (nuleculeId) => dispatch(actions.loadNulecule(nuleculeId)),
    postAnswers: (nuleculeId) => {
      dispatch(actions.postAnswers(nuleculeId, props.history))
    },
    answerChanged: function() { dispatch(actions.answerChanged(...arguments)) }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NuleculePage);
