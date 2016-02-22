'use strict';

import React, {
  Component,
  StyleSheet,
  View,
  Text
} from 'react-native';

import moment from 'moment';

import Colors from './Colors';
import Layout from './Layout';

import Avatar from './Avatar';

class Comment extends Component {
  render() {
    console.log(this.props.item);
    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentHeader}>
          <Avatar user={this.props.item.user} style={styles.avatar} />
          <Text style={styles.userText}>@{this.props.item.user.username}</Text>
          <Text style={styles.commentTime}>{moment(this.props.item.comment.created_at).fromNow()}</Text>
        </View>
        <View style={styles.comment}>
          <Text style={styles.commentText} >{this.props.item.comment.body}</Text>
        </View>
      </View>
    );
  }
}

let styles = StyleSheet.create({
  commentHeader: {
    flex: 1,
    flexDirection: 'row'
  },
  avatar: {
    width: Layout.lines(1.5),
    height: Layout.lines(1.5),
    marginRight: Layout.lines(1)
  },
  commentTime: {
    flex: 1,
    textAlign: 'right',
    color: Colors.darkGrey,
    fontSize: 12
  },
  comment: {
    flex: 1,
    marginLeft: Layout.lines(2.5)
  },
  userText: {
    flex: 1,
    color: Colors.action
  },
  commentText: {
    fontSize: 12
  }
});

module.exports = Comment;
