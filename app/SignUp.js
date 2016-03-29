'use strict';

import React, {
  AsyncStorage,
  Component,
  TouchableHighlight,
  TextInput,
  StyleSheet,
  View,
  Text
} from 'react-native';

import Router from './Router';
import Net from './Network';
import Layout from './Layout';
import Colors from './Colors';

const _SUCCESS = 201;
const _VALIDATIONERROR = 406;

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = { email: '', username: '', zip: '', password: '', passwordConfirm: '', index: 0, errors: null };
  }

  _handleFocus(index) {
    return () => { this.setState({index: index}); };
  }

  _handleSubmit() {
    let user = {
      email: this.state.email,
      username: this.state.username,
      postalCode: this.state.zip,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm
    };

    Net.auth().signUp(user)
    .then((resp) => {
      if(resp.status === _SUCCESS) {
        let data = JSON.parse(resp._bodyInit);
        this._handleSuccess(data.token);
      } else {
        this._handleFail(resp);
      }
    })
    .then(() => this.setState({index: 0}))
    .catch((err) => console.log("ERROR:", err));
  }

  _handleSuccess(token) {
    AsyncStorage.setItem('AUTH_TOKEN', token)
      .then(() => this.props.navigator.replace(Router.questionWelcome(token)))
      .catch((err) => console.log('Error setting AUTH_TOKEN: ' + err));
  }

  _handleFail(resp) {
    if(resp.status === _VALIDATIONERROR) {
      this.setState({errors: JSON.parse(resp._bodyInit)});
    } else {
      this.setState({error: "An unknown error has occurred"});
    }

    console.log(resp);
  }

  render() {
    return (
      <View style={_containerStyle(this.state.index)}>
        <Text style={styles.header}>Sign Up</Text>
        {this._showError()}
        <TextInput
          style={this._inputStyle(0)}
          onChangeText={(text) => this.setState({email: text})}
          value={this.state.email}
          placeholder="you@email.com"
          keyboardType="email-address"
          autoFocus={true}
          autoCorrect={false}
          autoCapitalize="none"
          onFocus={this._handleFocus(0)}
        />
        <TextInput
          style={this._inputStyle(1)}
          onChangeText={(text) => this.setState({username: text})}
          value={this.state.username}
          placeholder="Username"
          autoCorrect={false}
          autoCapitalize="none"
          onFocus={this._handleFocus(1)}
        />
        <TextInput
          style={this._inputStyle(2)}
          onChangeText={(text) => this.setState({zip: text})}
          value={this.state.zip}
          placeholder="Postal Code (ex: 11211)"
          keyboardType="numeric"
          onFocus={this._handleFocus(2)}
        />
        <TextInput
          style={this._inputStyle(3)}
          onChangeText={(text) => this.setState({password: text})}
          value={this.state.password}
          placeholder="Password"
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry={true}
          onFocus={this._handleFocus(3)}
        />
        <TextInput
          style={this._inputStyle(4)}
          onChangeText={(text) => this.setState({passwordConfirm: text})}
          value={this.state.passwordConfirm}
          placeholder="Password Confirm"
          autoCorrect={false}
          autoCapitalize="none"
          secureTextEntry={true}
          onFocus={this._handleFocus(4)}
        />
        <View style={styles.actionContainer}>
          <TouchableHighlight style={styles.submitButton} underlayColor={Colors.actionHighlight2} onPress={this._handleSubmit.bind(this)}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.cancelButton} underlayColor="white" onPress={() => this.props.navigator.pop()}>
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }

  _showError() {
    if(this.state.errors !== null) {
      let errors = [];

      for(var field in this.state.errors) {
        errors.push(<Text style={styles.errorText} key={field}>{field}: {this.state.errors[field]}</Text>);
      }

      return (
        <View style={styles.errorContainer}>
          {errors}
        </View>
      );
    }
  }

  _inputStyle(i) {
    return {
      height: Layout.lines(3),
      paddingVertical: Layout.lines(0.5),
      paddingHorizontal: Layout.lines(1),
      marginBottom: Layout.lines(1.5),
      backgroundColor: i === this.state.index ? 'white' : Colors.lightGrey,
      shadowColor: Colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 2,
      shadowOpacity: i === this.state.index ? 0.25 : 0,
      elevation: i === this.state.index ? 1 : 0,
      overflow: 'visible'
    };
  }
}

function _containerStyle(index) {
  return {
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: index * (-Layout.lines(3.5)),
    paddingVertical: Layout.lines(1),
    paddingHorizontal: Layout.lines(1),
    backgroundColor: Colors.lightGrey
  };
}

let styles = StyleSheet.create({
  header: {
    marginVertical: Layout.lines(1),
    paddingVertical: Layout.lines(1),
    textAlign: 'center',
    fontSize: 24,
    fontWeight: "200",
    backgroundColor: Colors.base,
    color: 'white'
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
    maxHeight: Layout.lines(3),
    marginRight: Layout.lines(0.5)
  },
  submitText: {
    textAlign: 'center',
    color: Colors.action,
    fontSize: 18
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: Layout.lines(0.5),
    padding: Layout.lines(0.5),
    maxHeight: Layout.lines(3),
    marginLeft: Layout.lines(0.5)
  },
  cancelText: {
    textAlign: 'center',
    color: Colors.grey,
    fontSize: 18
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

module.exports = SignUp;
