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

import Net from './Network';
import Router from './Router';
import Colors from './Colors';

const window = Dimensions.get('window');

class SideMenu extends Component {
  _handleLogout() {
    Net.auth().logout();

    AsyncStorage.removeItem('AUTH_TOKEN')
      .then(() => this.props.navigator.replace(Router.welcomeScreen()))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <ScrollView scrollToTop={false} style={styles.menu} >
        <View style={styles.container}>
          <View style={styles.item}>
            <Icon name="th-list" size={14} color="white" style={styles.itemIcon}/>
            <Text style={styles.itemText}>Feed</Text>
          </View>
          <View style={styles.item}>
            <Icon name="bell" size={14} color="white" style={styles.itemIcon}/>
            <Text style={styles.itemText}>Notification</Text>
          </View>
          <View style={styles.item}>
            <Icon name="globe" size={14} color="white" style={styles.itemIcon}/>
            <Text style={styles.itemText}>Matches</Text>
          </View>
          <View style={styles.item}>
            <Icon name="group" size={14} color="white" style={styles.itemIcon}/>
            <Text style={styles.itemText}>Friends</Text>
          </View>
          <View style={styles.item}>
            <Icon name="comments" size={14} color="white" style={styles.itemIcon}/>
            <Text style={styles.itemText}>Messages</Text>
          </View>
        </View>
        <View style={styles.accountContainer}>
          <View style={styles.item}>
            <Icon name="comments" size={14} color="white" style={styles.itemIcon}/>
            <Text style={styles.itemText}>@{this.props.username}</Text>
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

const styles = StyleSheet.create({
  menu: {
    flex: 1,
    width: window.width,
    height: window.height,
    backgroundColor: Colors.darkGrey
  },
  container: {
    flex: 1,
    paddingTop: 64
  },
  accountContainer: {
    flex: 1,
    paddingTop: 64,
    paddingBottom: 64
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10
  },
  itemIcon: {
    marginTop: 5,
    marginRight: 20
  },
  itemText: {
    color: 'white',
    fontSize: 18,
    flex: 1
  }
});

module.exports = SideMenu;
