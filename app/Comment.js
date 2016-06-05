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
import formatter from './utils/formatter';

import Avatar from './Avatar';

class Comment extends Component {
  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.commentHeader}>
          <Avatar url={this.props.avatar} style={styles.avatar} />
          <Text style={styles.userText}>@{this.props.username}</Text>
          <Text style={styles.commentTime}>{moment(this.props.createdAt).fromNow()}</Text>
        </View>
        <View style={styles.comment}>
          <Text style={styles.commentText}>{formatter.post(this.props.body)}</Text>
        </View>
      </View>
    );
  }
}

Comment.propTypes = {
  commentID: React.PropTypes.string.isRequired,
  avatar: React.PropTypes.string,
  username: React.PropTypes.string.isRequired,
  createdAt: React.PropTypes.string.isRequired,
  body: React.PropTypes.string
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.lines(1)
  },
  commentHeader: {
    flex: 1,
    flexDirection: 'row'
  },
  avatar: {
    width: Layout.lines(1.5),
    height: Layout.lines(1.5),
    marginRight: Layout.lines(1),
    borderRadius: Layout.lines(0.75)
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
