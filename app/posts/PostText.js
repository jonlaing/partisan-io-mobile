'use strict';

import React, {
  Component,
  StyleSheet,
  View,
  Text
} from 'react-native';

import Layout from '../Layout';
import Colors from '../Colors';
import formatter from '../utils/formatter';

import PostAction from './PostAction';

export default class PostText extends Component {
  _longPost() {
    return this.props.text.length > 140;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.actions}>
          <PostAction commentCount={this.props.commentCount} likeCount={this.props.likeCount} onLike={this.props.onLike} onComment={this.props.onComment} liked={this.props.liked}/>
        </View>
        <View style={styles.textContainer}>
          <Text style={this._longPost() ? styles.textLong : styles.text}>
            {formatter.post(this.props.text, this.props.onLinkPress, this.props.onHashtagPress, this.props.onUserTagPress)}
          </Text>
        </View>
      </View>
    );
  }
}

PostText.propTypes = {
  text: React.PropTypes.string.isRequired,
  likeCount: React.PropTypes.number,
  commentCount: React.PropTypes.number,
  liked: React.PropTypes.bool,
  onLike: React.PropTypes.func,
  onComment: React.PropTypes.func,
  onHashtagPress: React.PropTypes.func,
  onUserTagPress: React.PropTypes.func,
  onLinkPress: React.PropTypes.func
};

PostText.defaultProps = {
  likeCount: 0,
  commentCount: 0,
  liked: false,
  onLike: () => {},
  onComment: () => {},
  onHashtagPress: () => {},
  onUserTagPress: () => {},
  onLinkPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  actions: {
    width: Layout.lines(3)
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    borderLeftWidth: 1,
    borderLeftColor: Colors.grey,
    paddingLeft: Layout.lines(1)
  },
  text: {
    fontSize: Layout.lines(1),
    fontFamily: 'Georgia',
    lineHeight: Layout.lines(1.5)
  },
  textLong: {
    fontSize: Layout.lines(0.75),
    fontFamily: 'Georgia',
    lineHeight: Layout.lines(1.125)
  }
});

module.exports = PostText;
