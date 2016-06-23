'use strict';

import React, {
  AsyncStorage,
  StyleSheet,
  Component,
  Modal,
  Alert,
  TouchableHighlight,
  View,
  TextInput,
  Text
} from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';

import Api from './Api';
import Router from './Router';
import Layout from './Layout';
import Colors from './Colors';

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { email: "", pw: "", error: "", forgot: false};
  }

  handleLogin() {
    Api.auth().login(this.state.email, this.state.pw, this.props.navigator.props.deviceToken)
    .then(data => {console.log(data); this.handleSuccess(data.token, data.user); })
    .catch(err => this.handleFail(err));
  }

  handleForgot() {
    Api.auth().forgotPW(this.state.email)
    .then(data => Alert.alert(
      'Email sent',
      `An email has been sent to ${data.email} with instructions on resetting your password.`,
      [{text: 'OK', onPress: () => this.props.navigator.pop()}]))
    .then(() => this.setState({forgot: false}))
    .catch(err => console.log("err:", err));
  }

  handleSuccess(token, user) {
    let set = [ ['AUTH_TOKEN', token], ['user', JSON.stringify(user)] ];

    AsyncStorage.multiSet(set)
      .then(() => this.props.navigator.props.eventEmitter.emit('user-login'))
      .then(() => this.props.navigator.replace(Router.mainScreen(token)))
      .catch((err) => console.log('Error setting AUTH_TOKEN: ' + err));
  }

  handleFail(resp) {
    // doing it this way because it's easier to test
    let error = "";
    if(resp.status === 401) {
      error = "Incorrect username or password";
    } else {
      error = "An unknown error has occurred";
    }

    this.setState({error: error});
    console.log(resp);

    return error;
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
          <TouchableHighlight style={styles.submitButton} underlayColor={Colors.actionHighlight2} onPress={this.handleLogin.bind(this)}>
            <Text style={styles.submitText}>Login</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.signUpButton} underlayColor="white" onPress={() => this.props.navigator.push(Router.signUpScreen())}>
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.hr} />
        <View style={{flex: 1}}>
          <TouchableHighlight onPress={() => this.setState({forgot: true})}>
            <Text style={{textAlign: 'center'}}>Forgot your password?</Text>
          </TouchableHighlight>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.forgot}
          >
          <View style={styles.modalOverlay}>
            <View style={styles.modal}>
              <Text style={styles.header}>Forgot password</Text>
              <Text style={{marginVertical: Layout.lines(1)}}>
                To reset your password, enter your email address below. We'll then send you an email with a one-time token to reset your password.
              </Text>
              <TextInput
                style={[styles.input, {marginVertical: Layout.lines(1)}]}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={(val) => this.setState({email: val})}
                placeholder="you@email.com"
                value={this.state.email}
              />
              <View style={styles.actionContainer}>
                <TouchableHighlight style={styles.submitButton} underlayColor={Colors.actionHighlight2} onPress={this.handleForgot.bind(this)}>
                  <Text style={styles.submitText}>Reset Password</Text>
                </TouchableHighlight>
                <TouchableHighlight style={styles.signUpButton} underlayColor="white" onPress={() => this.setState({forgot: false})}>
                  <Text style={styles.signUpText}>Cancel</Text>
                </TouchableHighlight>
              </View>
            </View>
            <KeyboardSpacer />
          </View>
        </Modal>
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
    justifyContent: 'flex-start'
  },
  input: {
    height: Layout.lines(3),
    borderColor: Colors.grey,
    borderWidth: 1,
    paddingVertical: Layout.lines(0.5),
    paddingHorizontal: Layout.lines(1),
    marginBottom: Layout.lines(1)
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
    height: Layout.lines(3)
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
    height: Layout.lines(3),
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
  },
  hr: {
    marginBottom: Layout.lines(1),
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: Layout.lines(1),
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modal: {
    padding: Layout.lines(1),
    backgroundColor: 'white',
    borderRadius: Layout.lines(0.25)
  }
});

module.exports = LoginScreen;
