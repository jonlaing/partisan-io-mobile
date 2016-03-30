'use strict';

import React, {
  StyleSheet,
  Component,
  TouchableHighlight,
  DatePickerIOS,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

import Api from '../Api';
import Router from '../Router';
import Layout from '../Layout';
import Colors from '../Colors';

class ProfileFTUEBirthdate extends Component {
  constructor(props) {
    super(props);

    this.state = {birthdate: new Date(), error: false};
  }

  _handleSubmit() {
    Api.profile(this.props.token).updateBirthdate(this.state.birthdate)
    .then((resp) => {
      if(resp.status !== 500) {
        this.props.navigator.push(Router.profileFTUEGender(this.props.token));
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
        <Text style={styles.header}>Enter your Birthdate</Text>
        <Text style={styles.paragraph}>This will help us match you with other users.</Text>
        <View style={styles.inputContainer}>
          <DatePickerIOS
            style={{flex: 1}}
            onDateChange={(date) => this.setState({birthdate: date})}
            date={this.state.birthdate}
            maximumDate={new Date()}
            mode="date"
          />
        </View>
        {this._showError()}
        <View style={styles.actionContainer}>
          <TouchableHighlight style={styles.submitButton} underlayColor={Colors.actionHighlight2} onPress={this._handleSubmit.bind(this)}>
            <Text style={styles.submitText}>Submit</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.skipButton} underlayColor="white" onPress={() => this.props.navigator.push(Router.profileFTUEGender(this.props.token))}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableHighlight>
        </View>
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

ProfileFTUEBirthdate.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

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
  paragraph: {
    marginBottom: Layout.lines(1),
    textAlign: 'center'
  },
  inputContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: -Layout.lines(2)
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

module.exports = ProfileFTUEBirthdate;
