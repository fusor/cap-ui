import * as React from 'react';
import { connect } from 'react-redux';
import { Jumbotron } from 'react-bootstrap';
import JSONPretty from 'react-json-pretty';
import actions from '../actions';

import Layout from '../../base/components/Layout';
import GraphNodeForm from './GraphNodeForm';

class NuleculePage extends React.Component {
  componentWillMount() {
    const { registry, nuleculeId } = this.props.params;
    console.debug(this.props.params)
    this.props.loadNulecule(registry, nuleculeId);
  }
  handleAnswerChange(nuleculeId, nodeName, key, value) {
    this.props.dispatchAnswerChanged(...arguments);

    // Propogate change to any dests where the src node/key matches
    this.props.bindings[nuleculeId].filter((b) => {
      return b.src === nodeName && b.src_key === key;
    }).forEach((b) => {
      this.props.dispatchAnswerChanged(nuleculeId, b.dest, b.dest_key, value);
    });
  }
  render() {
    const { registry, nuleculeId } = this.props.params;

    let nulecule;
    let bindings;
    if(this.props.nulecules && this.props.nulecules[nuleculeId]) {
      nulecule = this.props.nulecules[nuleculeId];
    }
    if(this.props.bindings && this.props.bindings[nuleculeId]) {
      bindings = this.props.bindings[nuleculeId];
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

            const destKeyMap = bindings
              .filter((b) => b.dest === nodeName)
              .reduce((keyMap, b) => {
                keyMap[b.dest_key] = true;
                return keyMap;
              }, {});

            return <GraphNodeForm key={idx}
                name={nodeName}
                answers={nulecule[nodeName]}
                destKeyMap={destKeyMap}
                onAnswerChange={this.handleAnswerChange.bind(this, nuleculeId, nodeName)} />
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
          <h2>Downloading, please wait...</h2>
        </Jumbotron>
      )
    }

    const onButtonClick = this.props.postAnswers.bind(this, registry, nuleculeId)

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
    nulecules: state.nulecules,
    bindings: state.bindings
  };
};

const mapDispatchToProps = (dispatch, props, state) => {
  return {
    loadNulecules: () => dispatch(actions.loadNulecules()),
    loadNulecule: function() { dispatch(actions.loadNulecule(...arguments)) },
    postAnswers: (registry, nuleculeId) => {
      dispatch(actions.postAnswers(registry, nuleculeId, props.history))
    },
    dispatchAnswerChanged: function() {
      dispatch(actions.answerChanged(...arguments))
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NuleculePage);
