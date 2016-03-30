'use strict';

import React, {
  Component,
  TouchableHighlight,
  StyleSheet,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

import Router from '../Router';
import Layout from '../Layout';
import Colors from '../Colors';

class QuestionWelcome extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Welcome!</Text>
        <View style={styles.paragraphContainer}>
          <Text style={styles.paragraph}>
            Now that you're signed up for Partisan, we'll have to determine your
            political leanings. To do this, we're going to ask you 16 short questions.
            You can either "agree" by swiping RIGHT, or "disagree" by swiping LEFT.
          </Text>
        </View>
        <TouchableHighlight style={styles.getStarted} onPress={() => { this.props.navigator.push(Router.questionScreen(this.props.token)); }}>
          <Text style={styles.getStartedText}>Get Started!</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

QuestionWelcome.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: Layout.lines(3),
    paddingHorizontal: Layout.lines(2.5),
    backgroundColor: Colors.base
  },
  header: {
    flex: 1,
    textAlign: 'center',
    fontSize: Layout.lines(3),
    fontWeight: "200",
    color: 'white'
  },
  paragraphContainer: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Layout.lines(2),
    overflow: 'visible'
  },
  paragraph: {
    flex: 1,
    fontSize: Layout.lines(1),
    lineHeight: Layout.lines(2),
    textAlign: 'left',
    color: 'white',
    overflow: 'visible'
  },
  getStarted: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.lines(1),
    maxHeight: Layout.lines(4),
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: Layout.lines(0.5)
  },
  getStartedText: {
    textAlign: 'center',
    fontSize: Layout.lines(1.5),
    color: 'white'
  }
});

module.exports = QuestionWelcome;
