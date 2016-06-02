'user strict';
import React, {
  Component,
  TouchableHighlight,
  View,
  Text,
  Image,
  StyleSheet
} from 'react-native';

import moment from 'moment';
import ExNavigator from '@exponent/react-native-navigator';

import Router from './Router';

import Layout from './Layout';
import Colors from './Colors';

import Avatar from './Avatar';

class MessageThread extends Component {
  _handlePress() {
    this.props.navigator.push(Router.chat(this.props.thread.id, this.props.user, this.props.token));
  }

  _containerStyle() {
  }

  render() {
    return (
      <TouchableHighlight onPress={this._handlePress.bind(this)}>
        <View style={styles.container} >
          <Avatar style={styles.avatar} url={this.props.user.avatar_thumbnail_url} />
          <View style={styles.textContainer}>
            <Text style={styles.username}>@{this.props.user.username}</Text>
            <Text>{`${this.props.thread.last_message.body.substring(0, 40)}…`}</Text>
            <Text style={styles.time}>{moment(this.props.thread.created_at).fromNow()}</Text>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

MessageThread.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  thread: React.PropTypes.object.isRequired,
  user: React.PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: Layout.lines(1),
    borderColor: Colors.lightGrey,
    borderBottomWidth: 1
  },
  avatar: {
    height: Layout.lines(2),
    width: Layout.lines(2),
    marginRight: Layout.lines(2),
    borderRadius: Layout.lines(1),
    backgroundColor: Colors.lightGrey
  },
  textContainer: {
    flex: 1
  },
  username: {
    color: Colors.action
  },
  time: {
    fontSize: Layout.lines(0.75),
    color: Colors.grey
  }
});

module.exports = MessageThread;
