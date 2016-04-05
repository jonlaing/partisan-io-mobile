'use strict';

import React, {
  Component,
  StyleSheet,
  ActivityIndicatorIOS,
  View
} from 'react-native';

import Colors from './Colors';

class LoadingScreen extends Component {
  render() {
    return (
      <View style={styles.loader}>
        <ActivityIndicatorIOS animating={true} color={Colors.darkGrey} size="large" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

module.exports = LoadingScreen;
