'use strict';

import React, {
  Component,
  Dimensions,
  Linking,
  TouchableHighlight,
  StyleSheet,
  Image,
  View,
  Text
} from 'react-native';

import Lightbox from 'react-native-lightbox';
import ExNavigator from '@exponent/react-native-navigator';
import moment from 'moment';

import Colors from './Colors';
import Layout from './Layout';
import formatter from './utils/formatter';

import Avatar from './Avatar';
import PostAction from './posts/PostAction';

var {height, width} = Dimensions.get('window');

class Comment extends Component {
  _handleLink(url) {
    if(url.match(/^http/) != null) {
      Linking.openURL(url).catch(err => console.error('An error occurred', err));
    } else {
      Linking.openURL(`http://${url}`).catch(err => console.error('An error occurred', err));
    }
  }

  _photo() {
    if(this.props.attachments != null && this.props.attachments.length > 0) {
      if(this.props.navigator != null) {
        return (
          <Lightbox navigator={this.props.navigator.parentNavigator} activeProps={
            {style: {
              width: width,
              height: height,
              resizeMode: "contain",
              backgroundColor: 'transparent',
              borderWidth: 0,
              borderRadius: 0}}} >
            <Image source={{uri: this.props.attachments[0].url}} style={styles.image} />
          </Lightbox>
        );
      }

      return <Image source={{uri: this.props.attachments[0].url}} style={styles.image} />;
    }

    return <View />;
  }

  body() {
    if(this.props.showLike === false) {
      return (
        <TouchableHighlight style={[styles.comment, {marginLeft: Layout.lines(3.25)}]} onPress={this.props.onPress}>
          <View>
            <Text style={styles.commentText}>{formatter.post(this.props.body)}</Text>
            {this._photo()}
          </View>
        </TouchableHighlight>
      );
    }

    return (
      <View style={styles.bodyContainer}>
        <View style={styles.actions}>
          <PostAction
            action="comment"
            liked={this.props.liked}
            likeCount={this.props.likeCount}
            onLike={this.props.onLike}
          />
        </View>
        <TouchableHighlight style={styles.comment} onPress={this.props.onPress}>
          <View>
            <Text style={styles.commentText}>{formatter.post(this.props.body, this._handleLink.bind(this), this.props.onHashtagPress, this.props.onUserTagPress)}</Text>
            {this._photo()}
          </View>
        </TouchableHighlight>
      </View>
    );
  }

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <TouchableHighlight onPress={this.props.onHeaderPress}>
          <View style={styles.commentHeader}>
            <Avatar url={this.props.avatar} style={styles.avatar} />
            <Text style={styles.userText}>@{this.props.username}</Text>
            <Text style={styles.commentTime}>{moment(this.props.createdAt).fromNow()}</Text>
          </View>
        </TouchableHighlight>
        {this.body()}
      </View>
    );
  }
}

Comment.propTypes = {
  commentID: React.PropTypes.string.isRequired,
  avatar: React.PropTypes.string,
  username: React.PropTypes.string.isRequired,
  createdAt: React.PropTypes.string.isRequired,
  body: React.PropTypes.string,
  attachments: React.PropTypes.array,
  liked: React.PropTypes.bool,
  likeCount: React.PropTypes.number,
  onLike: React.PropTypes.func,
  showLike: React.PropTypes.bool,
  onHeaderPress: React.PropTypes.func,
  onPress: React.PropTypes.func,
  onUserTagPress: React.PropTypes.func,
  onHashtagPress: React.PropTypes.func,
  navigator: React.PropTypes.instanceOf(ExNavigator)
};

Comment.defaultProps = {
  attachments: [],
  likeCount: 0,
  liked: false,
  onLike: () => {},
  showLike: true,
  onHeaderPress: () => {},
  onPress: () => {},
  onUserTagPress: () => {},
  onHashtagPress: () => {}
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
    marginLeft: Layout.lines(0.25),
    marginRight: Layout.lines(1.5),
    borderRadius: Layout.lines(0.75)
  },
  commentTime: {
    flex: 1,
    alignSelf: 'flex-end',
    textAlign: 'right',
    color: Colors.darkGrey,
    fontSize: 12
  },
  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
    marginTop: Layout.lines(0.25)
  },
  actions: {
    width: Layout.lines(3)
  },
  comment: {
    flex: 1,
    marginTop: Layout.lines(0.5),
    marginLeft: Layout.lines(0.25)
  },
  userText: {
    flex: 1,
    color: Colors.action
  },
  commentText: {
    fontSize: 12
  },
  image: {
    marginTop: Layout.lines(1),
    height: Layout.lines(4),
    width: Layout.lines(4)
  }
});

module.exports = Comment;
