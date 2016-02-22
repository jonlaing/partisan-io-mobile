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
import SideMenuNav from 'react-native-side-menu';

import Router from './app/Router';
import SideMenu from './app/SideMenu';
import LoginScreen from './app/LoginScreen';

class Partisan extends Component {
  constructor(props) {
    super(props);

    this.eventEmitter = new EventEmitter();
    this.state = { token: null, tokenFetched: false, username: '' };
  }

  componentWillMount() {
  }

  componentDidMount() {
    AsyncStorage.getItem('AUTH_TOKEN')
      .then((tok) => this.setState({token: tok, tokenFetched: true}))
      .catch((err) => console.log('Error getting or initializing AUTH_TOKEN: ' + err));
  }

  _onHamburger() {
    this.refs.sidemenu.openMenu(true);
  }

  _onLoginSuccess(token, user) {
    console.log("succes: " + token);
    AsyncStorage.setItem('AUTH_TOKEN', token)
      .then(() => this.setState({token: token, tokenFetched: true}))
      .catch((err) => console.log('Error setting AUTH_TOKEN: ' + err));

    AsyncStorage.setItem('username', user.username)
      .then(() => this.setState({username: user.username}))
      .catch((err) => console.log('Error setting user: ' + err));
  }

  _onLoginFail(resp) {
    console.log(resp);
  }

  _onLogout() {
    fetch("http://localhost:4000/api/v1/logout").then(() => console.log("logged out"));
    AsyncStorage.removeItem('AUTH_TOKEN').
      then(() => this.setState({token: null, tokenFetched: true}));
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

    // We got the token, but it came back null, we need to login
    if(this.state.token === null) {
      return (
        <LoginScreen onSuccess={this._onLoginSuccess.bind(this)} onFail={this._onLoginFail.bind(this)} />
      );
    }

    // Got valid token, render the feed
    let sideMenu = <SideMenu username={this.state.username} onLogout={this._onLogout.bind(this)} />;
    return (
      <SideMenuNav ref="sidemenu" menu={sideMenu} navigator={this.refs.nav}>
        <ExNavigator
          initialRoute={Router.feed(this.state.token)}
          style={{flex: 1}}
          showNavigationBar={false}
          onHamburger={this._onHamburger.bind(this)}
          eventEmitter={this.eventEmitter}
          ref="nav"
        />
      </SideMenuNav>
    );
  }
}

AppRegistry.registerComponent('Partisan', () => Partisan);
