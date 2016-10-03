import * as React from 'react';
import { connect } from 'react-redux';
import { Jumbotron } from 'react-bootstrap';
import JSONPretty from 'react-json-pretty';
import actions from '../actions';

class GraphNodeForm extends React.Component {
  render() {
    const { name, answers, onAnswerChange } = this.props;

    const renderInputs = () => {
      return Object.keys(answers).map((answer, idx) => {
        const value = answers[answer];
        const inputId = `${answer}-input`;

        return (
          <div className="answer-input clearfix" key={idx}>
            <label htmlFor={inputId} className="col-xs-2 col-form-label" >{answer}</label>
            <div className="col-xs-10">
              <input className="form-control"
                id={inputId}
                type="text"
                data-answer-key={answer}
                value={value}
                onChange={this.onInputChange.bind(this)}/>
            </div>
          </div>
        );
      });
    };

    return (
      <div>
        <h3>{name}</h3>
        <Jumbotron>
          <div className="form-group row">
            {renderInputs()}
          </div>
        </Jumbotron>
      </div>
    );
  }
  onInputChange(e) {
    e.preventDefault();
    const answerKey = e.target.getAttribute('data-answer-key');
    const newValue = e.target.value;
    this.props.onAnswerChange(answerKey, newValue);
  }
}

export default GraphNodeForm;
