'use strict';
import React, {
  Component,
  View
} from 'react-native';

import Router from './Router';
import Layout from './Layout';

import Post from './Post';
import CommentList from './CommentList';

class FeedRow extends Component {
  render() {
    let record = this.props.item.record;

    return (
      <View style={{ marginTop: Layout.lines(0.75) }}>
        <Post
          token={this.props.token}
          post={record.post}
          user={record.user}
          imageAttachment={record.image_attachment}
          likeCount={record.like_count}
          liked={record.liked}
          commentCount={record.comment_count}
          navigator={this.props.navigator}
          onHeaderPress={() => this.props.navigator.push(Router.postScreen(record.post.id, this.props.token)) } />
      </View>
    );
  }
}

module.exports = FeedRow;
