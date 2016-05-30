'use strict';

import React, {
  Component,
  Linking,
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
            <Text style={styles.actionText} >Comments ({this.props.commentCount})</Text>
          </View>
        </TouchableHighlight>
      );
    }

    return <View />;
  }

  handleLink(url) {
    if(url.match(/^http/) != null) {
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    } else {
      Linking.openURL(`http://${url}`).catch(err => console.error('An error occurred', err));
    }
  }

  render() {
    if(this.props.attachments == null || this.props.attachments.length < 1) {
      return (
        <View style={styles.container}>
          <PostHeader
            postID={this.props.postID}
            username={this.props.username}
            avatar={this.props.avatar}
            createdAt={this.props.createdAt}
            onPress={this.props.onHeaderPress}
            onFlag={this.props.onFlag}
            isMine={this.props.isMine}
          />
          <PostText
            text={this.props.body}
            likeCount={this.props.likeCount}
            onLike={this.props.onLike}
            onComment={this.props.onComment}
            liked={this.props.liked}
            commentCount={this.props.commentCount}
            onHashtagPress={this.props.onHashtagPress}
            onUserTagPress={this.props.onUserTagPress}
            onLinkPress={this.handleLink.bind(this)} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <PostHeader
          postID={this.props.postID}
          username={this.props.username}
          avatar={this.props.avatar}
          createdAt={this.props.createdAt}
          onPress={this.props.onHeaderPress}
          onFlag={this.props.onFlag}/>
        <PostImage
          attachments={this.props.attachments}
          text={this.props.body}
          likeCount={this.props.likeCount}
          commentCount={this.props.commentCount}
          onLike={this.props.onLike}
          liked={this.props.liked}
          onPress={this.props.onHeaderPress}
        />
      </View>
    );
  }
}

Post.propTypes = {
  isMine: React.PropTypes.bool,
  username: React.PropTypes.string.isRequired,
  postID: React.PropTypes.string.isRequired,
  createdAt: React.PropTypes.string.isRequired,
  body: React.PropTypes.string,
  likeCount: React.PropTypes.number,
  liked: React.PropTypes.bool,
  commentCount: React.PropTypes.number,
  attachments: React.PropTypes.array,
  onLike: React.PropTypes.func,
  onComment: React.PropTypes.func,
  onFlag: React.PropTypes.func,
  onHashtagPress: React.PropTypes.func,
  onUserTagPress: React.PropTypes.func,
  onLinkPress: React.PropTypes.func,
  showComments: React.PropTypes.bool
};

Post.defaultProps = {
  isMine: false,
  body: '',
  likeCount: 0,
  liked: false,
  commentCount: 0,
  attachments: [],
  onHeaderPress: () => {},
  onLike: () => {},
  onComment: () => {},
  onFlag: () => {},
  onHashtagPress: () => {},
  onUserTagPress: () => {},
  onLinkPress: () => {},
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
