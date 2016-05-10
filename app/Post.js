'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from './Colors';
import Layout from './Layout';

import PostHeader from './posts/PostHeader';
import PostText from './posts/PostText';
import PostImage from './posts/PostImage';

class Post extends Component {
  _comments() {
    if(this.props.showComments === true) {
      return (
        <TouchableHighlight style={styles.action} onPress={this.props.onComment}>
          <View style={styles.actionContainerRight}>
            <Icon name="comments-o" color={Colors.grey} size={Layout.lines(1.5)} style={styles.actionIcon} />
            <Text style={styles.actionText} >Comment ({this.props.commentCount})</Text>
          </View>
        </TouchableHighlight>
      );
    }

    return <View />;
  }

  render() {
    if(this.props.imageAttachment.image_url === '') {
      return (
        <View style={styles.container}>
          <PostHeader user={this.props.user} post={this.props.post} onPress={this.props.onHeaderPress}/>
          <PostText text={this.props.post.body} likeCount={this.props.likeCount} onLike={this.props.onLike} liked={this.props.liked}/>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <PostHeader user={this.props.user} post={this.props.post} onPress={this.props.onHeaderPress}/>
        <PostImage
          uri={this.props.imageAttachment.image_url}
          text={this.props.post.body}
          likeCount={this.props.likeCount}
          onLike={this.props.onLike}
          liked={this.props.liked}
          onPress={this.props.onHeaderPress}
        />
      </View>
    );
  }
}

Post.propTypes = {
  user: React.PropTypes.shape({ username: React.PropTypes.string }).isRequired,
  post: React.PropTypes.shape({
    id: React.PropTypes.number,
    created_at: React.PropTypes.oneOfType([ React.PropTypes.number, React.PropTypes.string ]),
    body: React.PropTypes.string
  }).isRequired,
  likeCount: React.PropTypes.number,
  liked: React.PropTypes.bool,
  commentCount: React.PropTypes.number,
  imageAttachment: React.PropTypes.shape({ image_url: React.PropTypes.string }),
  onLike: React.PropTypes.func,
  onComment: React.PropTypes.func,
  showComments: React.PropTypes.bool
};

Post.defaultProps = {
  likeCount: 0,
  liked: false,
  commentCount: 0,
  imageAttachment: { image_url: '' },
  onHeaderPress: () => {},
  onLike: () => {},
  onComment: () => {},
  showComments: true
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.lines(1),
    backgroundColor: 'white'
  },
  postHead: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: Layout.lines(1)
  },
  avatar: {
    height: Layout.lines(2),
    width: Layout.lines(2),
    marginRight: Layout.lines(1),
    backgroundColor: Colors.lightGrey
  },
  postUser: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  postUserText: {
    fontSize: 18,
    color: Colors.action
  },
  postDate: {
    color: Colors.grey,
    fontSize: 12
  },
  postBody: {
    flex: 1
  },
  postBodyText: {
    fontSize: 16,
    fontFamily: 'Georgia',
    lineHeight: Layout.lines(1.5)
  },
  postImageContainer: {
    flex: 1,
    height: Layout.lines(22),
    justifyContent: 'center',
    alignItems: 'stretch',
    marginHorizontal: Layout.lines(-1),
    backgroundColor: Colors.grey
  },
  postImage: {
    flex: 1
  },
  actions: {
    flex: 1,
    marginTop: Layout.lines(1),
    paddingTop: Layout.lines(1),
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  action: {
    flex: 1
  },
  actionContainerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  actionIcon: {
    width: Layout.lines(1.5),
    marginRight: Layout.lines(0.5)
  },
  actionText: {
    fontSize: 12
  }
});

module.exports = Post;
