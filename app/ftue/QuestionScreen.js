'use strict';

import React, {
  Component,
  StyleSheet,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

import Api from '../Api';
import Router from '../Router';
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
      index: 0
    };
  }

  componentDidMount() {
    Api.questions(this.props.token).get()
    .then((res) => JSON.parse(res._bodyInit))
    .then((data) => this.setState({currQuestions: [this.state.questions[0]], questions: this.state.questions.concat(data.questions) }))
    .catch(err => console.log(err));
  }

  _getQuestions(index = 0) {
    Api.questions(this.props.token).get()
    .then((res) => {
      if(res.status === 200) {
        let data = JSON.parse(res._bodyInit);
        this.setState({currQuestions: [data.questions[0]], questions: this.state.questions.concat(data.questions), index: index });
      } else {
        console.log("problem with questions");
        this.props.navigator.push(Router.profileFTUEWelcome(this.props.token));
      }
    })
    .catch(err => console.log(err));
  }

  _handleFlick(q) {
    return (agree) => {
      let index = this.state.index + 1;

      if((index + 2) % 4 === 0) {
        this._getQuestions(index);
        return;
      }

      if(index >= _MAX_QUESTIONS + 2) {
        this.props.navigator.push(Router.profileFTUEWelcome(this.props.token));
      }

      Api.questions(this.props.token).answer(q, agree)
      .then(() => this.setState({currQuestions: [this.state.questions[index]], index: index}))
      .catch(err => console.log(err));
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
        <View style={{ height: Layout.lines(3) }}>
          <Text style={styles.headerText}>Take the Quiz</Text>
        </View>
        {questions}
        <Text style={styles.helpText}>Swipe right if you agree, swipe left if you disagree</Text>
      </View>
    );
  }
}

QuestionScreen.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.lines(2),
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
