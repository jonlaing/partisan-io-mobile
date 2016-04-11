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

import Colors from './Colors';

class MessageThread extends Component {
  _avatar(user) {
    let url = user.avatar_thumbnail_url;
    if(url.length > 0) {
      if(!url.includes('amazonaws.com')) {
        url = "http://localhost:4000" + url;
      }

      return (
        <Image
          style={styles.avatar}
          source={{uri: url}}
        />
      );
    } else {
      return (<View style={styles.avatar}/>);
    }
  }

  _handlePress() {
    this.props.navigator.push(Router.chat(this.props.thread.thread_user.thread_id, this.props.token));
  }

  render() {
    return (
      <TouchableHighlight onPress={this._handlePress.bind(this)}>
        <View style={styles.container} >
          {this._avatar(this.props.thread.thread_user.user)}
          <View style={styles.textContainer}>
            <Text style={styles.username}>@{this.props.thread.thread_user.user.username}</Text>
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
  thread: React.PropTypes.object.isRequired
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 10,
    borderColor: 'rgb(242,242,242)',
    borderBottomWidth: 1
  },
  avatar: {
    width: 30,
    height: 30,
    marginRight: 10
  },
  textContainer: {
    flex: 1
  },
  username: {
    color: Colors.action
  },
  time: {
    fontSize: 12,
    color: Colors.grey
  }
});

module.exports = MessageThread;
