'use strict';
import React, {
  Component,
  View
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

import Router from './Router';
import Layout from './Layout';

import Post from './Post';
// import CommentList from './CommentList';

class FeedRow extends Component {
  render() {
    let record = this.props.item.record;

    return (
      <View style={{ flex: 1 }}>
        <Post
          token={this.props.token}
          post={record.post}
          user={record.user}
          imageAttachment={record.image_attachment}
          likeCount={record.like_count}
          liked={record.liked}
          commentCount={record.comment_count}
          navigator={this.props.navigator}
          onHeaderPress={() => this.props.navigator.push(Router.postScreen(record.post.id, this.props.token)) }
          onLike={this.props.onLike}
          onComment={() => this.props.navigator.push(Router.postScreen(record.post.id, this.props.token, true)) }
        />
      </View>
    );
  }
}

FeedRow.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  item: React.PropTypes.shape({
    record: React.PropTypes.shape({
      post: React.PropTypes.object,
      user: React.PropTypes.object,
      image_attachment: React.PropTypes.object,
      likeCount: React.PropTypes.number,
      liked: React.PropTypes.bool,
      commentCount: React.PropTypes.number
    })
  }).isRequired,
  onLike: React.PropTypes.func
};

FeedRow.defaultProps = {
  onLike: () => {}
};

module.exports = FeedRow;
