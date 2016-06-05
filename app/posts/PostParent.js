'use strict';

import React, {
  Component,
  StyleSheet,
  View,
  Text
} from 'react-native';

import moment from 'moment';

import Layout from '../Layout';
import Colors from '../Colors';

import Avatar from '../Avatar';
import PostText from './PostText';
import PostImage from './PostImage';

export default class PostParent extends Component {
  render() {
    if(this.props.attachments == null || this.props.attachments.length < 1) {
      return (
        <View style={styles.container}>
          <View style={styles.postHead}>
            <Avatar style={styles.avatar} url={this.props.avatar} />
            <Text style={styles.postUserText}>@{this.props.username}</Text>
            <Text style={styles.postDate}> {moment(this.props.createdAt).fromNow()}</Text>
          </View>
          <PostText
            parent={true}
            text={this.props.body}
            onHashtagPress={this.props.onHashtagPress}
            onUserTagPress={this.props.onUserTagPress}
            onLinkPress={this.props.onLinkPress} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <PostImage
          attachments={this.props.attachments}
          text={this.props.body}
        />
      </View>
    );
  }
}

PostParent.propTypes = {
  username: React.PropTypes.string.isRequired,
  postID: React.PropTypes.string.isRequired,
  createdAt: React.PropTypes.string.isRequired,
  body: React.PropTypes.string,
  attachments: React.PropTypes.array,
  onHashtagPress: React.PropTypes.func,
  onUserTagPress: React.PropTypes.func,
  onLinkPress: React.PropTypes.func
};

PostParent.defaultProps = {
  body: '',
  likeCount: 0,
  liked: false,
  commentCount: 0,
  attachments: [],
  onHashtagPress: () => {},
  onUserTagPress: () => {},
  onLinkPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: Layout.lines(3),
    paddingLeft: Layout.lines(1),
    marginTop: Layout.lines(1),
    borderLeftWidth: 1,
    borderLeftColor: Colors.grey
  },
  postHead: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    paddingBottom: Layout.lines(0.5)
  },
  avatar: {
    height: Layout.lines(1),
    width: Layout.lines(1),
    marginRight: Layout.lines(0.5),
    borderRadius: Layout.lines(0.5),
    backgroundColor: Colors.lightGrey
  },
  postUser: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  postUserText: {
    fontSize: Layout.lines(1),
    color: Colors.action
  },
  postDate: {
    color: Colors.darkGrey,
    fontSize: Layout.lines(0.75)
  }
});

module.exports = PostParent;
