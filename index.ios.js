/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
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
    this.state = { token: null, tokenFetched: false, username: null, avatarUrl: null };
  }

  componentWillMount() {
  }

  componentDidMount() {
    AsyncStorage.multiGet(['AUTH_TOKEN', 'username', 'avatarUrl'])
      .then((arr) => {
        let tok = '';
        let username = '';
        let avatarUrl = '';

        arr.map((g) => {
          if(g[0] === 'AUTH_TOKEN') {
            tok = g[1];
          }

          if(g[0] === 'username') {
            username = g[1];
          }

          if(g[0] === 'avatarUrl') {
            avatarUrl = g[1];
          }
        });

        if(tok === '' || username === '' || avatarUrl === '') {
          throw "Couldn't get token or username";
        }

        this.setState({token: tok, username: username, avatarUrl: avatarUrl, tokenFetched: true});
      })
      .catch((err) => console.log('Error getting or initializing AUTH_TOKEN: ' + err));
  }

  _initialRoute(token, username) {
    // we got the token, but it came back null, so we need to render the login screen
    if(token === null || username === null) {
      return Router.welcomeScreen();
    } else {
      return Router.feed(this.state.token);
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
        initialRoute={this._initialRoute(this.state.token, this.state.username)}
        style={{flex: 1}}
        showNavigationBar={false}
        eventEmitter={this.eventEmitter}
        username={this.state.username}
        avatarUrl={this.state.avatarUrl}
        ref="nav"
      />
    );
  }
}

AppRegistry.registerComponent('Partisan', () => Partisan);
