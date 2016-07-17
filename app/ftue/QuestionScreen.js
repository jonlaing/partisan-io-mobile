'use strict';

import React, {
  Component,
  StyleSheet,
  View,
  Text
} from 'react-native';

import Api from '../Api';
import Colors from '../Colors';
import Layout from '../Layout';

import Question from './Question';

const _MAX_QUESTIONS = 16;

class QuestionScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currQuestions: [],
      questions: [
        {
          map: [],
          prompt: "Swipe right to agree."
        },
        {
          map: [],
          prompt: "Swiple left to disagree."
        }
      ],
      mask: [],
      index: 0
    };
  }

  componentDidMount() {
    Api.questions(this.props.token).get()
    .then((data) => this.setState({currQuestions: [this.state.questions[0]], questions: this.state.questions.concat(data.questions) }))
    .catch(err => console.log(err));
  }

  _getQuestions(index = 0) {
    console.log("getting questions");
    Api.questions(this.props.token).get()
    .then(data => this.setState({
      currQuestions: [data.questions[0]],
      questions: this.state.questions.concat(data.questions),
      mask: data.mask,
      index: index
    }))
    .catch(err => {
      if(err.response.status === 404 || err.response.status === 406) {
        // need a slicker way of dealing with this
        this.props.onComplete();
      }
      console.log(err.response);
    });
  }

  _handleFlick(q) {
    return (agree) => {
      let index = this.state.index + 1;

      // intro questions, do not call the server
      if(index <= 2) {
        this.setState({currQuestions: [this.state.questions[index]], index: index});
        return;
      }

      // if we've answered all of the questions, break out and finish
      if(index >= _MAX_QUESTIONS + 2) {
        this.props.onComplete();
        return;
      }

      // answer the question
      Api.questions(this.props.token).answer(q, this.state.mask, agree)
      .then(() => this.setState({currQuestions: [this.state.questions[index]], index: index}))
      .catch(err => console.log(err));

      // if we've answered all of the current questions, get new ones
      if((index - 2) % 4 === 0) {
        this._getQuestions(index);
      }
    };
  }

  render() {
    let questions = this.state.currQuestions.map((q) => {
      return (
        <Question
          style={{ flex: 1 }}
          key={q.prompt}
          prompt={q.prompt}
          index={this.state.index}
          onFlick={this._handleFlick(q).bind(this)}
          maxQuestions={_MAX_QUESTIONS + 2}/>
      );
    });

    return (
      <View style={styles.container}>
        <View style={{ height: Layout.lines(4) }}>
          <Text style={styles.headerText}>Take the Quiz</Text>
        </View>
        {questions}
      </View>
    );
  }
}

QuestionScreen.propTypes = {
  token: React.PropTypes.string.isRequired,
  onComplete: React.PropTypes.func.isRequired
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Layout.lines(1),
    paddingVertical: Layout.lines(2),
    backgroundColor: Colors.lightGrey
  },
  headerText: {
    paddingBottom: Layout.lines(1),
    color: Colors.action,
    fontSize: 24
  },
  helpText: {
    marginTop: Layout.lines(1),
    textAlign: 'center'
  }
});

module.exports = QuestionScreen;
