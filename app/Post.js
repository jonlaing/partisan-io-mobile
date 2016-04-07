'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  Image,
  View,
  Text
} from 'react-native';

import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from './Colors';
import Layout from './Layout';

import Avatar from './Avatar';
import LikeButton from './LikeButton';

class Post extends Component {
  _postImage() {
    let url = this.props.imageAttachment.image_url;

    if(url.length > 0) {
      if(!url.includes('amazonaws.com')) {
        url = "http://localhost:4000" + url;
      }

      return (
        <View style={styles.postImageContainer}>
          <Image
            source={{uri: url}}
            style={styles.postImage} />
        </View>
      );
    }

    return (<View />);
  }

  _handleHeaderPress() {
    if(this.props.onHeaderPress !== undefined) {
      return this.props.onHeaderPress();
    }

    console.log("No onHeaderPress defined for Post");
  }

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
    return (
      <View style={styles.container}>
        <TouchableHighlight onPress={this._handleHeaderPress.bind(this)} >
          <View style={styles.postHead}>
            <Avatar user={this.props.user} style={styles.avatar} />
            <View style={styles.postUser}>
              <Text style={styles.postUserText}>@{this.props.user.username}</Text>
              <Text style={styles.postDate}>{moment(this.props.post.created_at).fromNow()}</Text>
            </View>
          </View>
        </TouchableHighlight>
        {this._postImage()}
        <View style={styles.postBody}>
          <Text style={styles.postBodyText}>{this.props.post.body}</Text>
        </View>
        <View style={styles.actions}>
          <LikeButton active={this.props.liked} count={this.props.likeCount} onPress={this.props.onLike} />
          {this._comments()}
        </View>
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
  commentCount: React.PropTypes.number,
  imageAttachment: React.PropTypes.shape({ image_url: React.PropTypes.string }),
  onLike: React.PropTypes.func,
  onComment: React.PropTypes.func,
  showComments: React.PropTypes.bool
};

Post.defaultProps = {
  likeCount: 0,
  commentCount: 0,
  imageAttachment: { image_url: '' },
  onLike: () => {},
  onComment: () => {},
  showComments: true
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Layout.lines(1),
    backgroundColor: 'white',
    borderRadius: 2
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
