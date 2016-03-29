/*global fetch */
'use strict';

import React, {
  AsyncStorage,
  Dimensions,
  StyleSheet,
  Component,
  TouchableHighlight,
  View,
  TextInput,
  Text
} from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';

import Net from './Network';
import Router from './Router';
import Layout from './Layout';
import Colors from './Colors';

const _SUCCESS = 200;
const _UNAUTHORIZED = 401;

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { email: "", pw: "", error: ""};
  }

  _handleLogin() {
    Net.auth().login(this.state.email, this.state.pw)
    .then((resp) => {
      if(resp.status === _SUCCESS) {
        let data = JSON.parse(resp._bodyInit);
        this._handleSuccess(data.token);
      } else {
        this._handleFail(resp);
      }
    })
    .catch(err => console.log("login error: " + err));
  }

  _handleSuccess(token) {
    AsyncStorage.setItem('AUTH_TOKEN', token)
      .then(() => this.props.navigator.replace(Router.feed(token)))
      .catch((err) => console.log('Error setting AUTH_TOKEN: ' + err));
  }

  _handleFail(resp) {
    if(resp.status === _UNAUTHORIZED) {
      this.setState({error: "Incorrect username or password"});
    } else {
      this.setState({error: "An unknown error has occurred"});
    }

    console.log(resp);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Sign into Partisan.io</Text>
        <View style={styles.inputContainer}>
          {this._showError()}
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onChangeText={(val) => this.setState({email: val})}
            placeholder="you@email.com"
            value={this.state.email}
            autoFocus={true}
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(val) => this.setState({pw: val})}
            placeholder="password"
            value={this.state.pw}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.actionContainer}>
          <TouchableHighlight style={styles.submitButton} underlayColor={Colors.actionHighlight2} onPress={this._handleLogin.bind(this)}>
            <Text style={styles.submitText}>Login</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.signUpButton} underlayColor="white" onPress={() => this.props.navigator.replace(Router.signUpScreen())}>
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableHighlight>
        </View>
        <KeyboardSpacer />
      </View>
    );
  }

  _showError() {
    if(this.state.error !== "") {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{this.state.error}</Text>
        </View>
      );
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Layout.lines(4),
    paddingLeft: Layout.lines(2),
    paddingRight: Layout.lines(2)
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    color: Colors.base,
    fontWeight: "200",
    flex: 1
  },
  inputContainer: {
    flex: 2,
    justifyContent: 'space-around'
  },
  input: {
    height: Layout.lines(3),
    borderColor: Colors.grey,
    borderWidth: 1,
    paddingVertical: Layout.lines(0.5),
    paddingHorizontal: Layout.lines(1)
  },
  actionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Layout.lines(1)
  },
  submitButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.action,
    borderRadius: Layout.lines(0.5),
    padding: Layout.lines(0.5),
    maxHeight: Layout.lines(3)
  },
  submitText: {
    textAlign: 'center',
    color: Colors.action,
    fontSize: 18
  },
  signUpButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    maxHeight: Layout.lines(3),
    padding: Layout.lines(0.25)
  },
  signUpText: {
    fontSize: 14,
    textAlign: 'right',
    color: Colors.darkGrey
  },
  errorContainer: {
    backgroundColor: Colors.accent,
    borderRadius: Layout.lines(0.5),
    padding: Layout.lines(0.5),
    marginBottom: Layout.lines(1.5)
  },
  errorText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14
  }
});

module.exports = LoginScreen;
