/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  AppState,
  Component,
  Linking,
  PushNotificationIOS,
  Alert,
  AsyncStorage
} from 'react-native';

import EventEmitter from 'EventEmitter';
import ExNavigator from '@exponent/react-native-navigator';
import qs from 'qs';

import Router from './app/Router';

import LoadingScreen from './app/LoadingScreen';

class Partisan extends Component {
  constructor(props) {
    super(props);

    this.eventEmitter = new EventEmitter();
    this.state = { token: null, tokenFetched: false, deviceToken: "", user: null, badgeCount: 0, initialRoute: null, routeToPush: null };
  }

  componentWillMount() {
    this._setupPushNotifs();
  }

  componentDidMount() {
    this._getUserInfo();
    this.loginListener = this.eventEmitter.addListener('user-login', this._getUserInfo.bind(this));
    this.userChangeListener = this.eventEmitter.addListener('user-change', this._reloadUser.bind(this));
    this.badgeChangeListener = this.eventEmitter.addListener('badge-change', number => number !== this.state.badgeCount ? this.setState({badgeCount: number}) : {});

    Linking.getInitialURL()
    .then((url) => {
      if(url) {
        this._processURL({url});
      }
    })
    .catch(err => console.log("error getting initial url:", err));

    AppState.addEventListener('change', this._handleAppStateChange.bind(this));
    Linking.addEventListener('url', this._processURL.bind(this));
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._processURL.bind(this));
    try {
      this.loginListener.remove();
      this.userChangeListener.remove();
      this.badgeChangeListener.remove();
    } catch(e) {
      console.log(e);
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if(this.state.badgeCount !== nextState.badgeCount) {
      PushNotificationIOS.setApplicationIconBadgeNumber(nextState.badgeCount);
    }
  }

  _setupPushNotifs() {
    PushNotificationIOS.requestPermissions();

    PushNotificationIOS.addEventListener('register', (token) => {
      console.log("got device token:", token);
      this.setState({deviceToken: token});
    });

    PushNotificationIOS.addEventListener('notification', (notif) => {
      if(AppState.currentState === "background") {
        let data = notif.getData();

        switch(data.action) {
                case "like":
                case "comment":
                case "user_tag":
                        this.setState({ routeToPush: Router.postScreen(data.meta.record_id, this.state.token) });
                        break;
                case "friendrequest":
                case "friendaccept":
                        this.setState({ routeToPush: Router.profile(this.state.token, data.meta.record_id) });
                        break;
                case "message":
                        this.setState({ routeToPush: Router.messageList(this.state.token) });
                        break;
                default:
                        break;
        }
      }
    });
  }

  _handleAppStateChange(appState) {
    if(appState === "active" && this.state.routeToPush != null) {
      this.refs.nav.push(this.state.routeToPush);
      this.setState({ routeToPush: null });
    }
  }

  _processURL(e) {
    let url = e.url.replace('partisanio://', '').split('?');
    let path = url[0];
    let params = url[1] ? qs.parse(url[1]) : {};

    switch(path) {
            case "post":
                    if(this.state.token != null) {
                      this.refs.nav.push(Router.postScreen(params.postID, this.state.token));
                    }
                    break;
            case "user":
                    if(this.state.token != null) {
                      this.refs.nav.push(Router.profile(this.state.token, params.user_id));
                    }
                    break;
            case "event":
                    if(this.state.token != null) {
                      this.refs.nav.push(Router.eventScreen(params.event_id, this.state.token));
                    }
                    break;
            case "password_reset":
                    this.refs.nav.push(Router.passwordReset(params.reset_id));
                    break;
            default:
                    break;
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
        deviceToken={this.state.deviceToken}
        ref="nav"
      />
    );
  }
}

AppRegistry.registerComponent('Partisan.IO', () => Partisan);
