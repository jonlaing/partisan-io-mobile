/*global fetch */
'use strict';

import React, {
  StyleSheet,
  Component,
  TouchableHighlight,
  DatePickerIOS,
  View,
  Text
} from 'react-native';

import Net from './Network';
import Router from './Router';
import Layout from './Layout';
import Colors from './Colors';

class ProfileFTUEBirthdate extends Component {
  constructor(props) {
    super(props);

    this.state = {birthdate: new Date()};
  }

  _handleSubmit() {
    Net.profile(this.props.token).updateBirthdate(this.state.birthdate)
    .then((resp) => console.log(resp))
    .catch((err) => console.log("error", err));
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Enter your Birthdate</Text>
        <View style={styles.inputContainer}>
          <DatePickerIOS
            onDateChange={(date) => this.setState({birthdate: date})}
            date={this.state.birthdate}
            maximumDate={new Date()}
            mode="date"
          />
        </View>
        <View style={styles.actionContainer}>
          <TouchableHighlight style={styles.submitButton} underlayColor={Colors.actionHighlight2} onPress={this._handleSubmit.bind(this)}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.signUpButton} underlayColor="white">
            <Text style={styles.signUpText}>Skip</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
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
    marginVertical: Layout.lines(1),
    paddingVertical: Layout.lines(1),
    textAlign: 'center',
    fontSize: 24,
    fontWeight: "200"
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

module.exports = ProfileFTUEBirthdate;
