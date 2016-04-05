'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import ExNavigator from '@exponent/react-native-navigator';

import Router from './Router';
import Layout from './Layout';
import Colors from './Colors';

class NoFriends extends Component {
  render() {
    return (
      <View style={styles.noFriendsContainer}>
        <Text style={styles.noFriendsHeader}>You don't have any friends!</Text>
        <View style={styles.noFriendsFrown}>
          <Icon name="frown-o" color={Colors.grey} size={Layout.lines(4)} />
        </View>
        <Text style={styles.noFriendsParagraph}>
          Well, not on Partisan, anyway. Find matches to fill up your feed
          with posts from other people who have similar political opinions to yours.
        </Text>
        <View style={styles.noFriendsHR} />
        <TouchableHighlight
          style={styles.noFriendsButton}
          underlayColor={Colors.actionHighlight2}
          onPress={() => this.props.navigator.push(Router.matches(this.props.token, false))}>
          <Text style={styles.noFriendsButtonText}>Find Matches!</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

NoFriends.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

const styles = StyleSheet.create({
  noFriendsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginVertical: Layout.lines(1),
    padding: Layout.lines(1),
    backgroundColor: 'white',
    minHeight: Layout.lines(24)
  },
  noFriendsHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: Layout.lines(1.25),
    color: Colors.darkGrey,
    paddingBottom: Layout.lines(1)
  },
  noFriendsFrown: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Layout.lines(1)
  },
  noFriendsParagraph: {
    flex: 3,
    paddingVertical: Layout.lines(1),
    lineHeight: Layout.lines(1.5)
  },
  noFriendsButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Layout.lines(1),
    marginVertical: Layout.lines(1),
    borderWidth: 1,
    borderColor: Colors.action,
    borderRadius: Layout.lines(0.5)
  },
  noFriendsButtonText: {
    textAlign: 'center',
    fontSize: Layout.lines(1),
    color: Colors.action
  }
});

module.exports = NoFriends;
