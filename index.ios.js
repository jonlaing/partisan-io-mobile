/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
/*global fetch */
'use strict';
import React, {
  AppRegistry,
  Component,
  TabBarIOS,
  View,
  Text
} from 'react-native';

import Feed from './ios/Feed';
import Notifications from './ios/Notifications';

// HOLY SHIT GET RID OF THIS BEFORE GOING TO PRODUCTION AHHHH!!!!!!
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlfa2V5IjoiIiwidXNlcl9pZCI6MTF9.AZtPF03IzU6PJeNZK38XPGJTfXNe_J1WgQnfwavv17g";

class Partisan extends Component {
  constructor(props) {
    super(props);
    this.state = { currTab: 'feed', token: '' };
  }

  componentWillMount() {
    // var token;

    fetch('http://localhost:4000/api/v1/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'hereiam@email.com',
        password: 'password'
      })
    })
    .then((resp) => JSON.parse(resp._bodyInit))
    .then((data) => this.setState({token: data.token}))
    .then(() => console.log('set state'));
  }

  render() {
    return (
      <TabBarIOS
        barTintColor="rgb(15,15,15)"
        tintColor={'rgb(210,21,179)'}
        >
        <TabBarIOS.Item
          selected={this.state.currTab === 'feed'}
          systemIcon="favorites"
          title="Feed"
          onPress={() => this.setState({currTab: 'feed'})}
          >
          <Feed token={token} />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.currTab === 'notifs'}
          systemIcon="featured"
          title="Notifications"
          badge={3}
          onPress={() => this.setState({currTab: 'notifs'})}
          >
          <Notifications />
        </TabBarIOS.Item>
        <TabBarIOS.Item
          selected={this.state.currTab === 'account'}
          systemIcon="more"
          title="Account"
          onPress={() => this.setState({currTab: 'account'})}
          >
          <View>
            <Text>Account</Text>
          </View>
        </TabBarIOS.Item>
      </TabBarIOS>
    );
  }
}

AppRegistry.registerComponent('Partisan', () => Partisan);
