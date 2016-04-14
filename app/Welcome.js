'use strict';

import React, {
  StyleSheet,
  Component,
  Image,
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
      <Image style={styles.container} source={require('./images/login_bg.png')} resizeMode="stretch">
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('./images/logo_grey_lg.png')}/>
        </View>
        <Text style={styles.headerText}>Welcome to Partisan.IO</Text>
        <View style={styles.buttonContainer}>
          <TouchableHighlight style={styles.signUpButton} underlayColor='transparent' onPress={() => this.props.navigator.push(Router.signUpScreen())}>
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.loginButton} underlayColor='transparent' onPress={() => this.props.navigator.push(Router.loginScreen())}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableHighlight>
        </View>
      </Image>
    );
  }
}

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    padding: Layout.lines(2),
    backgroundColor: Colors.lightGrey,
    width: null,
    height: null
  },
  backgroundContainer: {
    position: "absolute",
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    top: 0,
    left: 0
  },
  background: {
    flex: 1,
    resizeMode: 'contain'
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  logo: {
  },
  headerText: {
    fontSize: Layout.lines(1.5),
    fontWeight: '200',
    textAlign: 'center',
    color: 'white',
    backgroundColor: 'transparent'
  },
  buttonContainers: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  signUpButton: {
    padding: Layout.lines(1),
    marginBottom: Layout.lines(2),
    borderRadius: 4,
    backgroundColor: Colors.base
  },
  signUpButtonText: {
    fontSize: 24,
    fontWeight: '200',
    textAlign: 'center',
    color: 'white'
  },
  loginButton: {
    padding: Layout.lines(1),
    borderRadius: 4,
    borderColor: Colors.base,
    borderWidth: 1
  },
  loginButtonText: {
    fontSize: 24,
    fontWeight: '200',
    textAlign: 'center',
    color: Colors.base
  }
});

module.exports = Welcome;
