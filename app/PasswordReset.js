'use strict';

import React, {
  StyleSheet,
  Component,
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

class PasswordReset extends Component {
  constructor(props) {
    super(props);

    this.state = { email: "", pw: "", pwC: "", error: ""};
  }

  handleReset() {
    Api.auth().resetPW(this.props.resetID, this.state.email, this.state.pw, this.state.pwC)
    .then(data => {console.log(data); this.handleSuccess(); })
    .catch(err => this.handleFail(err));
  }

  handleSuccess() {
    this.props.navigator.push(Router.loginScreen());
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
        <Text style={styles.header}>Reset Password</Text>
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
            placeholder="New Password"
            value={this.state.pw}
            secureTextEntry={true}
          />
          <TextInput
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(val) => this.setState({pwC: val})}
            placeholder="Confirm New Password"
            value={this.state.pwC}
            secureTextEntry={true}
          />
        </View>
        <View style={styles.actionContainer}>
          <TouchableHighlight style={styles.submitButton} underlayColor={Colors.actionHighlight2} onPress={this.handleReset.bind(this)}>
            <Text style={styles.submitText}>Reset</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.signUpButton} underlayColor="white" onPress={() => this.props.navigator.push(Router.welcomeScreen())}>
            <Text style={styles.signUpText}>Cancel</Text>
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

PasswordReset.propTypes = {
  resetID: React.PropTypes.string.isRequired
};

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
  }
});

module.exports = PasswordReset;
