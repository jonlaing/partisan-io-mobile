'use strict';

import React, {
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import Button from 'react-native-button';

let Router = {
  feed(token) {
    return {
      renderScene(navigator) {
        let FeedList = require('./FeedList');
        return <FeedList token={token} navigator={navigator} />;
      },

      renderTitle() {
        return (
          <View style={styles.navBar}>
            <Text style={styles.navBarText}>Feed</Text>
          </View>
        );
      },

      renderLeftButton(navigator) {
        return (
          <TouchableHighlight onPress={navigator.props.onHamburger} >
            <Icon name="bars" color="rgb(255,255,255)" size={24} style={styles.navBarLeftButton} />
          </TouchableHighlight>
        );
      },

      renderRightButton(navigator) {
        return (
          <Button
            style={styles.navBarRightButton}
            onPress={() => navigator.push(Router.postComposer(token))}>
            Post
          </Button>
        );
      }

    };
  },

  postComposer(token) {
    return {
      renderScene(navigator) {
        let PostComposer = require('./PostComposer');
        return <PostComposer token={token} navigator={navigator} />;
      },

      renderTitle() {
        return (
          <View style={styles.navBar}>
            <Text style={styles.navBarText}>Write Post</Text>
          </View>
        );
      },

      renderLeftButton() {
        return;
      },

      renderRightButton(navigator) {
        return (
          <TouchableHighlight onPress={() => navigator.pop()} >
            <Text style={styles.x}>✕</Text>
          </TouchableHighlight>
        );
      }
    };
  }
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: 'row',
    paddingTop: 10
  },
  navBarText: {
    fontSize: 18,
    color: 'white'
  },
  navBarLeftButton: {
    marginTop: 10,
    marginLeft: 15,
    color: 'white'
  },
  navBarRightButton: {
    marginTop: 10,
    marginRight: 15,
    color: 'white'
  },
  x: {
    marginTop: 5,
    marginRight: 15,
    fontSize: 24,
    color: 'white'
  }
});

module.exports = Router;
