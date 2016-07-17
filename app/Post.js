'use strict';

import React, {
  Component,
  Linking,
  StyleSheet,
  View,
  Text
} from 'react-native';

import {KDSocialShare} from 'NativeModules';

import Colors from './Colors';
import Layout from './Layout';

import PostHeader from './posts/PostHeader';
import PostText from './posts/PostText';
import PostImage from './posts/PostImage';

import Comment from './Comment';

class Post extends Component {
  handleLink(url) {
    if(url.match(/^http/) != null) {
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    } else {
      Linking.openURL(`http://${url}`).catch(err => console.error('An error occurred', err));
    }
  }

  _handleFacebookShare() {
    let body = this.props.body;
    let postID = this.props.postID;
    let attachments = this.props.attachments;

    if(this.props.parent.id !== "") {
      body = this.props.parent.body;
      postID = this.props.parent.id;
      attachments = this.props.parent.attachments;
    }

    if(body.length > 0) {
      body = `"${body}"\n\n`;
    }

    let opts = {
        'text': `${body}Shared from Partisan.IO`,
        'link': `https://www.partisan.io/posts/${postID}`
    };

    if(attachments != null && attachments.length > 0) {
      opts.imagelink = attachments[0].url;
    }

    KDSocialShare.shareOnFacebook(opts,
      (results) => {
        console.log(results);
      }
    );
  }

  _handleTwitterShare() {
    let body = this.props.body;
    let postID = this.props.postID;
    let attachments = this.props.attachments;

    if(this.props.parent.id !== "") {
      body = this.props.parent.body;
      postID = this.props.parent.id;
      attachments = this.props.parent.attachments;
    }

    let sharetext = 'Shared from @partisan_io';
    let opts = {
        'link': `https://www.partisan.io/posts/${postID}`
    };

    if(body.length > 136 - sharetext.length) {
      body = body.substr(0, 136 - sharetext.length) + "…";
    }

    if(body.length > 0) {
      body = body + " | " + sharetext;
    } else {
      body = sharetext;
    }

    opts.text = body;

    if(attachments != null && attachments.length > 0) {
      opts.imagelink = attachments[0].url;
    }

    KDSocialShare.tweet(opts,
      (results) => {
        console.log(results);
      }
    );
  }

  _action(username, action) {
    switch(action) {
            case "comment":
                    return `@${username} commented on...`;
            case "like":
                    return `@${username} liked...`;
            case "usertag":
                    return `@${username} was tagged in...`;
            default:
                    return "";
    }
  }

  render() {
    if(this.props.action === "comment") {
      return (
        <View style={styles.container}>
          <View style={styles.action}>
            <Text>{this._action(this.props.username, this.props.action)}</Text>
          </View>
          <PostHeader
            postID={this.props.parent.id}
            username={this.props.parent.user.username}
            avatar={this.props.parent.user.avatar_thumbnail_url}
            createdAt={this.props.parent.created_at}
            onPress={this.props.onHeaderPress}
            onFacebookShare={this._handleFacebookShare.bind(this)}
            onTwitterShare={this._handleTwitterShare.bind(this)}
            onFlag={this.props.onFlag}
            onDelete={this.props.onDelete}
            isMine={false}
            action={this.props.parent.action}
          />
          <PostText
            text={this.props.parent.body}
            likeCount={this.props.parent.like_count}
            onLike={this.props.onLike}
            onComment={this.props.onComment}
            liked={this.props.parent.liked}
            commentCount={this.props.parent.child_count}
            onHashtagPress={this.props.onHashtagPress}
            onUserTagPress={this.props.onUserTagPress}
            onLinkPress={this.handleLink.bind(this)}
            action={this.props.parent.action}
          />
          <Comment
            commentID={this.props.postID}
            avatar={this.props.avatar}
            username={this.props.username}
            createdAt={this.props.createdAt}
            body={this.props.body}
            style={{backgroundColor: Colors.lightGrey, marginHorizontal: Layout.lines(-1)}}
            onHeaderPress={this.props.onHeaderPress}
            onUserTagPress={this.props.onUserTagPress}
            onHashTagPress={this.props.onHashTagPress}
            onPress={this.props.onHeaderPress}
            showLike={false}
          />
        </View>
      );
    }

    if(this.props.action === "like" || this.props.action === "usertag") {
      return (
        <View style={styles.container}>
          <View style={styles.action}>
            <Text>{this._action(this.props.username, this.props.action)}</Text>
          </View>
          <PostHeader
            postID={this.props.parent.id}
            username={this.props.parent.user.username}
            avatar={this.props.parent.user.avatar_thumbnail_url}
            createdAt={this.props.parent.created_at}
            onPress={this.props.onHeaderPress}
            onFacebookShare={this._handleFacebookShare.bind(this)}
            onTwitterShare={this._handleTwitterShare.bind(this)}
            onFlag={this.props.onFlag}
            onDelete={this.props.onDelete}
            isMine={false}
            action={this.props.parent.action}
          />
          <PostText
            text={this.props.parent.body}
            likeCount={this.props.parent.like_count}
            onLike={this.props.onLike}
            onComment={this.props.onComment}
            liked={this.props.parent.liked}
            commentCount={this.props.parent.child_count}
            onHashtagPress={this.props.onHashtagPress}
            onUserTagPress={this.props.onUserTagPress}
            onLinkPress={this.handleLink.bind(this)}
            action={this.props.parent.action}
          />
        </View>
      );
    }

    if(this.props.attachments == null || this.props.attachments.length < 1) {
      return (
        <View style={styles.container}>
          <PostHeader
            postID={this.props.postID}
            username={this.props.username}
            avatar={this.props.avatar}
            createdAt={this.props.createdAt}
            onPress={this.props.onHeaderPress}
            onFacebookShare={this._handleFacebookShare.bind(this)}
            onTwitterShare={this._handleTwitterShare.bind(this)}
            onFlag={this.props.onFlag}
            onDelete={this.props.onDelete}
            isMine={this.props.isMine}
            action={this.props.action}
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
            onLinkPress={this.handleLink.bind(this)}
            action={this.props.action}
          />
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
          onFacebookShare={this._handleFacebookShare.bind(this)}
          onTwitterShare={this._handleTwitterShare.bind(this)}
          onFlag={this.props.onFlag}
          onDelete={this.props.onDelete}
          isMine={this.props.isMine}
          action={this.props.action}
        />
        <PostImage
          attachments={this.props.attachments}
          text={this.props.body}
          showFullText={this.props.showFullText}
          likeCount={this.props.likeCount}
          commentCount={this.props.commentCount}
          onLike={this.props.onLike}
          liked={this.props.liked}
          onPress={this.props.onHeaderPress}
          action={this.props.action}
        />
      </View>
    );
  }
}

Post.propTypes = {
  isMine: React.PropTypes.bool,
  username: React.PropTypes.string.isRequired,
  postID: React.PropTypes.string.isRequired,
  action: React.PropTypes.string.isRequired,
  createdAt: React.PropTypes.string.isRequired,
  body: React.PropTypes.string,
  likeCount: React.PropTypes.number,
  liked: React.PropTypes.bool,
  commentCount: React.PropTypes.number,
  attachments: React.PropTypes.array,
  onHeaderPress: React.PropTypes.func,
  onLike: React.PropTypes.func,
  onComment: React.PropTypes.func,
  onFlag: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  onHashtagPress: React.PropTypes.func,
  onUserTagPress: React.PropTypes.func,
  onLinkPress: React.PropTypes.func,
  showComments: React.PropTypes.bool,
  showFullText: React.PropTypes.bool, // For image posts only, whether to truncate or not
  parent: React.PropTypes.object
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
  onDelete: () => {},
  onHashtagPress: () => {},
  onUserTagPress: () => {},
  onLinkPress: () => {},
  showComments: true,
  showFullText: false,
  parent: {
    user: {
      username: '',
      avatar_thumbnail_url: ''
    },
    id: '',
    body: '',
    createdAt: '',
    attachments: []
  }
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
  action: {
    flex: 1,
    paddingBottom: Layout.lines(0.5)
  }
});

module.exports = Post;
