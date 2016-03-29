'use strict';

import React, {
  Component,
  TouchableHighlight,
  StyleSheet,
  View,
  Text
} from 'react-native';

import Router from './Router';
import Layout from './Layout';

class SignUp extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Sign Up</Text>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    paddingTop: Layout.lines(1)
  }
});

module.exports = SignUp;
