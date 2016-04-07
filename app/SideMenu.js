'use strict';

import React, {
  AsyncStorage,
  Dimensions,
  Component,
  StyleSheet,
  View,
  ScrollView,
  TouchableHighlight,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import ExNavigator from '@exponent/react-native-navigator';

import Api from './Api';
import Router from './Router';
import Layout from './Layout';
import Colors from './Colors';

import Avatar from './Avatar';

const window = Dimensions.get('window');

class SideMenu extends Component {
  _handleLogout() {
    Api.auth().logout();

    AsyncStorage.multiRemove(['AUTH_TOKEN', 'username'])
      .then(() => this.props.navigator.replace(Router.welcomeScreen()))
      .catch(err => console.log(err));
  }

  _notifCount() {
    let count = this.props.notificationCount;
    if(count > 0) {
      return <Text style={styles.counter}>{count}</Text>;
    }

    return <View />;
  }

  render() {
    return (
      <ScrollView scrollToTop={false} style={styles.menu} >
        <View style={styles.container}>
          <TouchableHighlight onPress={() => this.props.navigator.replace(Router.feed(this.props.token))}>
            <View style={styles.item}>
              <Icon name="th-list" size={14} color="white" style={styles.itemIcon}/>
              <Text style={styles.itemText}>Feed</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.navigator.replace(Router.notificationScreen(this.props.token))}>
            <View style={styles.item}>
              <Icon name="bell" size={14} color="white" style={styles.itemIcon}/>
              <Text style={styles.itemText}>Notifications</Text>
              {this._notifCount()}
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.navigator.replace(Router.matches(this.props.token))}>
            <View style={styles.item}>
              <Icon name="globe" size={14} color="white" style={styles.itemIcon}/>
              <Text style={styles.itemText}>Matches</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={() => this.props.navigator.replace(Router.friends(this.props.token))}>
            <View style={styles.item}>
              <Icon name="group" size={14} color="white" style={styles.itemIcon}/>
              <Text style={styles.itemText}>Friends</Text>
            </View>
          </TouchableHighlight>
          <View style={styles.item}>
            <Icon name="comments" size={14} color="white" style={styles.itemIcon}/>
            <Text style={styles.itemText}>Messages</Text>
          </View>
        </View>
        <View style={styles.accountContainer}>
          <View style={styles.item}>
            <Avatar style={styles.avatar} user={{ avatar_thumbnail_url: this.props.navigator.props.avatarUrl }} />
            <Text style={styles.itemText}>@{this.props.navigator.props.username}</Text>
          </View>
          <TouchableHighlight onPress={this._handleLogout.bind(this)}>
            <View style={styles.item}>
              <Icon name="sign-out" size={14} color="white" style={styles.itemIcon}/>
              <Text style={styles.itemText}>Logout</Text>
            </View>
          </TouchableHighlight>
        </View>
      </ScrollView>
    );
  }
}

SideMenu.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: Colors.darkGrey
  },
  container: {
    flex: 1,
    paddingTop: Layout.lines(4)
  },
  accountContainer: {
    flex: 1,
    paddingTop: Layout.lines(4),
    paddingBottom: Layout.lines(4)
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: Layout.lines(0.5),
    paddingLeft: Layout.lines(1),
    paddingRight: Layout.lines(1),
    paddingBottom: Layout.lines(0.5)
  },
  itemIcon: {
    marginTop: Layout.lines(0.25),
    marginRight: Layout.lines(1)
  },
  itemText: {
    color: 'white',
    fontSize: 18,
    flex: 1
  },
  avatar: {
    marginTop: Layout.lines(0.25),
    marginRight: Layout.lines(0.5),
    width: Layout.lines(1.25),
    height: Layout.lines(1.25)
  },
  counter: {
    flex: 1,
    color: 'white'
  }
});

module.exports = SideMenu;
