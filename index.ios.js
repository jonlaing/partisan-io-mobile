/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  AsyncStorage
} from 'react-native';

import EventEmitter from 'EventEmitter';
import ExNavigator from '@exponent/react-native-navigator';

import Router from './app/Router';

import LoadingScreen from './app/LoadingScreen';

class Partisan extends Component {
  constructor(props) {
    super(props);

    this.eventEmitter = new EventEmitter();
    this.state = { token: null, tokenFetched: false, user: null, notificationCount: 0 };
  }

  componentWillMount() {
  }

  componentDidMount() {
    this._getUserInfo();
    this.loginListener = this.eventEmitter.addListener('user-login', this._getUserInfo.bind(this));
    this.userChangeListener = this.eventEmitter.addListener('user-change', this._reloadUser.bind(this));
  }

  componentWillUnmount() {
    try {
      this.loginListener.remove();
    } catch(e) {
      console.log(e);
    }
  }

  _getUserInfo() {
    AsyncStorage.multiGet(['AUTH_TOKEN', 'user'])
      .then((arr) => {
        let tok = '';
        let user = null;

        arr.map((g) => {
          if(g[0] === 'AUTH_TOKEN') {
            tok = g[1];
          }

          if(g[0] === 'user') {
            user = JSON.parse(g[1]);
          }
        });


        if(tok === '' || user == null) {
          throw "Couldn't get token or user";
        }

        this.setState({token: tok, user: user, tokenFetched: true});
      })
      .catch((err) => {
        this.setState({tokenFetched: true});
        console.log('Error getting or initializing AUTH_TOKEN: ' + err);
      });
  }

  _reloadUser() {
    AsyncStorage.getItem('user')
    .then(data => JSON.parse(data))
    .then(user => this.setState({user: user}))
    .catch(err => console.log(err));
  }

  _initialRoute(token, user) {
    // we got the token, but it came back null, so we need to render the login screen
    if(token === null || user === null) {
      return Router.welcomeScreen();
    } else {
      return Router.mainScreen(this.state.token);
    }
  }

  render() {
    // We haven't gotten the token yet
    if(this.state.tokenFetched === false) {
      return <LoadingScreen />;
    }

    return (
      <ExNavigator
        initialRoute={this._initialRoute(this.state.token, this.state.user)}
        style={{flex: 1}}
        showNavigationBar={false}
        eventEmitter={this.eventEmitter}
        user={this.state.user}
        ref="nav"
      />
    );
  }
}

AppRegistry.registerComponent('Partisan.IO', () => Partisan);
