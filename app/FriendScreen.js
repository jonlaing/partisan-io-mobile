'use strict';

import React, {
  Component,
  StyleSheet,
  View
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';
import Icon from 'react-native-vector-icons/FontAwesome';

import Layout from './Layout';

import FriendList from './FriendList';
import NavBar from './NavBar';

export default class FriendScreen extends Component {
  render() {
    return (
      <View style={styles.container}>
        <FriendList token={this.props.token} navigator={this.props.navigator} />
        <NavBar
          title="My Friends"
          leftButton={ <Icon name="chevron-left" color="rgb(255,255,255)" size={24} /> }
          leftButtonPress={() => this.props.navigator.pop()}
        />
      </View>
    );
  }
}

FriendScreen.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    paddingTop: Layout.lines(4)
  }
});

module.exports = FriendScreen;
