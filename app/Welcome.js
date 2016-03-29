'use strict';

import React, {
  StyleSheet,
  Component,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Router from './Router';
import Layout from './Layout';
import Colors from './Colors';

class Welcome extends Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}></View>
        </View>
        <Text style={styles.headerText}>Welcome to Partisan.IO</Text>
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.signUpButton} onPress={() => this.props.navigator.push(Router.signUpScreen())}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.loginButton} onPress={() => this.props.navigator.push(Router.loginScreen())}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: Layout.lines(2),
    backgroundColor: Colors.lightGrey
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
    height: 200,
    width: 200,
    backgroundColor: Colors.grey
  },
  headerText: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.darkGrey
  },
  buttonContainers: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  signUpButton: {
    padding: Layout.lines(1),
    marginBottom: Layout.lines(2),
    borderRadius: 4,
    backgroundColor: Colors.action
  },
  signUpButtonText: {
    fontSize: 24,
    textAlign: 'center',
    color: 'white'
  },
  loginButton: {
    padding: Layout.lines(1),
    borderRadius: 4,
    borderColor: Colors.action,
    borderWidth: 1
  },
  loginButtonText: {
    fontSize: 24,
    textAlign: 'center',
    color: Colors.action
  },
});

module.exports = Welcome;
