/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
/*global fetch */
'use strict';
import React, {
  AppRegistry,
  Component,
  View,
  Text,
  AsyncStorage
} from 'react-native';

import EventEmitter from 'EventEmitter';
import ExNavigator from '@exponent/react-native-navigator';

import Router from './app/Router';

class Partisan extends Component {
  constructor(props) {
    super(props);

    this.eventEmitter = new EventEmitter();
    this.state = { token: null, tokenFetched: false, username: '' };
  }

  componentWillMount() {
  }

  componentDidMount() {
    console.log(this.props);
    AsyncStorage.getItem('AUTH_TOKEN')
      .then((tok) => this.setState({token: tok, tokenFetched: true}))
      .catch((err) => console.log('Error getting or initializing AUTH_TOKEN: ' + err));
  }

  _initialRoute(token) {
    // we got the token, but it came back null, so we need to render the login screen
    if(token === null) {
      return Router.welcomeScreen();
    } else {
      return Router.profileFTUELookingFor(this.state.token);
    }
  }

  render() {
    // We haven't gotten the token yet
    if(this.state.tokenFetched === false) {
      return (
        <View>
          <Text>Loading...</Text>
        </View>
      );
    }

    return (
      <ExNavigator
        initialRoute={this._initialRoute(this.state.token)}
        style={{flex: 1}}
        showNavigationBar={false}
        eventEmitter={this.eventEmitter}
        ref="nav"
      />
    );
  }
}

AppRegistry.registerComponent('Partisan', () => Partisan);
