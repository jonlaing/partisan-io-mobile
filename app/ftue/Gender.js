/*global fetch */
'use strict';

import React, {
  StyleSheet,
  Component,
  TextInput,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import KeyboardSpacer from 'react-native-keyboard-spacer';

import api from '../API';
import Router from '../Router';
import Layout from '../Layout';
import Colors from '../Colors';

class ProfileFTUEGender extends Component {
  constructor(props) {
    super(props);

    this.state = {gender: '', error: false};
  }

  _handleSubmit() {
    api(this.props.navigator.environment).profile(this.props.token).updateGender(this.state.summary)
    .then((resp) => {
      if(resp.status !== 500) {
        this.props.navigator.push(Router.profileFTUESummary(this.props.token));
      } else {
        this.setState({error: true});
      }
    })
    .catch((err) => {
      console.log(err);
      this.setState({error: true});
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Enter your Gender</Text>
        <Text style={styles.paragraph}>This is optional, but it can help our algorithm to match you with other users.</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(val) => this.setState({gender: val})}
            value={this.state.gender}
            autoFocus={true}
          />
        </View>
        {this._showError()}
        <View style={styles.actionContainer}>
          <TouchableHighlight style={styles.submitButton} underlayColor={Colors.actionHighlight2} onPress={this._handleSubmit.bind(this)}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.skipButton} underlayColor="white" onPress={() => this.props.navigator.push(Router.profileFTUESummary(this.props.token))}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableHighlight>
        </View>
        <KeyboardSpacer />
      </View>
    );
  }

  _showError() {
    if(this.state.error === true) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>There was an error submitting. Check your connection and try again.</Text>
        </View>
      );
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Layout.lines(1),
    paddingLeft: Layout.lines(2),
    paddingRight: Layout.lines(2)
  },
  header: {
    marginVertical: Layout.lines(1),
    paddingVertical: Layout.lines(1),
    textAlign: 'center',
    fontSize: 24,
    fontWeight: "200"
  },
  paragraph: {
    marginBottom: Layout.lines(1),
    textAlign: 'center'
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
    paddingVertical: Layout.lines(1)
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
  skipButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    maxHeight: Layout.lines(3),
    padding: Layout.lines(0.25)
  },
  skipText: {
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

module.exports = ProfileFTUEGender;
