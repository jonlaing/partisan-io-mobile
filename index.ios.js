/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  NavigatorIOS,
  StyleSheet
} from 'react-native';

import Feed from './ios/Feed';

class Partisan extends Component {
  render() {
    return (
      <NavigatorIOS
        style={styles.navigator}
        barTintColor={'rgb(0,210,195)'}
        tintColor={'rgb(255,255,255)'}
        titleTextColor={'rgb(255,255,255)'}
        initialRoute={{
          title: 'Feed',
          component: Feed
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

AppRegistry.registerComponent('Partisan', () => Partisan);
