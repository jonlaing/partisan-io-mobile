'use strict';
import React, {
  Component,
  NavigatorIOS,
  StyleSheet
} from 'react-native';

import NotificationList from './NotificationList';

class Notifications extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.navigator}
        barTintColor={'rgb(0,210,195)'}
        tintColor={'rgb(255,255,255)'}
        titleTextColor={'rgb(255,255,255)'}
        initialRoute={{
          title: 'Notifications',
          component: NotificationList
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  navigator: {
    flex: 1
  }
});

module.exports = Notifications;
