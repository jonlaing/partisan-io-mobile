/*global fetch */
'use strict';

import React, {
  StyleSheet,
  Component,
  TouchableHighlight,
  View,
  TextInput,
  Text
} from 'react-native';

import Colors from './Colors';

const _SUCCESS = 200;
const _UNAUTHORIZED = 401;

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { email: "", pw: "", error: ""};
  }

  _handleLogin() {
    let email = this.state.email;
    let pw = this.state.pw;

    let onSuccess = this.props.onSuccess;

    fetch('http://localhost:4000/api/v1/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: pw
      })
    })
    .then((resp) => {
      if(resp.status === _SUCCESS) {
        let data = JSON.parse(resp._bodyInit);

        if(onSuccess !== undefined) {
          onSuccess(data.token, data.user);
        } else {
          console.log("No onSuccess defined for LoginScreen");
        }
      } else {
        this._handleFail(resp);
      }
    })
    .catch(err => console.log("login error: " + err));
  }

  _handleFail(resp) {
    let onFail = this.props.onFail;

    if(resp.status === _UNAUTHORIZED) {
      this.setState({error: "Incorrect username or password"});
    } else {
      this.setState({error: "An unknown error has occurred"});
    }

    if(onFail !== undefined) {
      onFail(resp);
    } else {
      console.log("No onFail defined for LoginScreen");
    }
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
          <TouchableHighlight style={styles.submit} onPress={this._handleLogin.bind(this)}>
            <Text style={styles.submitText}>Login</Text>
          </TouchableHighlight>
          <Text style={styles.signUpButton}>Sign up</Text>
        </View>
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
    paddingTop: 64,
    paddingLeft: 48,
    paddingRight: 48,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center'
  },
  header: {
    textAlign: 'center',
    fontSize: 24,
    color: Colors.darkGrey,
    flex: 1
  },
  inputContainer: {
    flex: 1
  },
  input: {
    height: 48,
    borderColor: Colors.grey,
    borderWidth: 1,
    paddingTop: 6,
    paddingRight: 18,
    paddingBottom: 6,
    paddingLeft: 18,
    marginBottom: 24
  },
  submitText: {
    textAlign: 'center',
    color: Colors.action,
    fontSize: 36,
    fontWeight: "200",
    marginBottom: 36
  },
  actionContainer: {
    flex: 1
  },
  signUpButton: {
    fontSize: 18,
    textAlign: 'center',
    color: Colors.darkGrey
  },
  errorContainer: {
    backgroundColor: Colors.accent,
    borderRadius: 8,
    paddingTop: 9,
    paddingRight: 9,
    paddingBottom: 9,
    paddingLeft: 9,
    marginBottom: 24
  },
  errorText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 14
  }
});

module.exports = LoginScreen;
