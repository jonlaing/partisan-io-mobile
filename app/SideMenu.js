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

import Icon from 'react-native-vector-icons/MaterialIcons';
import ExNavigator from '@exponent/react-native-navigator';

import Api from './Api';
import Router from './Router';
import Layout from './Layout';
import Colors from './Colors';

import Avatar from './Avatar';

const window = Dimensions.get('window');

class SideMenu extends Component {
  constructor(props) {
    super(props);

    this.user = this.props.navigator.props.user;
  }

  _handleLogout() {
    Api.auth().logout();

    AsyncStorage.multiRemove(['AUTH_TOKEN', 'user'])
      .then(() => this.props.navigator.replace(Router.welcomeScreen()))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <ScrollView scrollToTop={false} style={styles.menu} >
        <View style={styles.container}>
          <TouchableHighlight onPress={this.props.onUserPress}>
            <View style={styles.user}>
              <View style={styles.userInner}>
                <Avatar style={styles.avatar} url={this.user.avatar_thumbnail_url} />
                <Text style={styles.userText}>@{this.user.username}</Text>
              </View>
              <Text style={{color: 'white'}}>Edit Profile</Text>
            </View>
          </TouchableHighlight>
          <TouchableHighlight onPress={this._handleLogout.bind(this)}>
            <View style={styles.item}>
              <Icon name="clear" size={24} color="white" style={styles.itemIcon}/>
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
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  onUserPress: React.PropTypes.func
};

SideMenu.defaultProps = {
  onUserPress: () => {}
};

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width * 2 / 3,
    height: window.height,
    backgroundColor: Colors.darkGrey
  },
  container: {
    flex: 1
  },
  group: {
    flex: 1,
    flexDirection: 'column',
    paddingVertical: Layout.lines(1)
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: Layout.lines(1),
    flex: 1
  },
  user: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Layout.lines(1.5),
    paddingHorizontal: Layout.lines(1),
    backgroundColor: Colors.base
  },
  userInner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Layout.lines(0.75)
  },
  avatar: {
    marginRight: Layout.lines(1),
    width: Layout.lines(1.5),
    height: Layout.lines(1.5),
    borderRadius: Layout.lines(0.75)
  },
  userText: {
    fontSize: Layout.lines(1.5),
    color: 'white'
  },
  counter: {
    flex: 1,
    color: 'white'
  }
});

module.exports = SideMenu;
