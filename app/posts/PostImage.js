'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  Image,
  View
} from 'react-native';

import Layout from '../Layout';

import PostAction from './PostAction';

const DOUBLE_PRESS_DELAY = 300;

export default class PostImage extends Component {
  handleImagePress(e) {
    const now = new Date().getTime();

    if (this.lastImagePress && (now - this.lastImagePress) < DOUBLE_PRESS_DELAY) {
      delete this.lastImagePress;
      this.handleImageDoublePress(e);
      clearTimeout(this.timeout);
    }
    else {
      this.lastImagePress = now;
      this.timeout = setTimeout(this.props.onPress, DOUBLE_PRESS_DELAY);
    }
  }

  handleImageDoublePress(e) {
    this.props.onLike(e);
  }

  render() {
    if(this.props.attachments.length === 1) {
      return (
        <View style={styles.container}>
          <TouchableHighlight onPress={this.handleImagePress.bind(this)}>
            <Image source={{uri: this.props.attachments[0].url}} style={styles.image}>
              <View style={styles.actions}>
                <PostAction commentCount={this.props.commentCount} likeCount={this.props.likeCount} onLike={this.props.onLike} liked={this.props.liked} color='light' />
              </View>
            </Image>
          </TouchableHighlight>
        </View>
      );
    }

    console.warn("haven't figured out mutliple images");
    return <View />;
  }
}

PostImage.propTypes = {
  attachments: React.PropTypes.array.isRequired,
  likeCount: React.PropTypes.number,
  liked: React.PropTypes.bool,
  commentCount: React.PropTypes.number,
  onLike: React.PropTypes.func,
  onPress: React.PropTypes.func
};

PostImage.defaultProps = {
  likeCount: 0,
  liked: false,
  commentCount: 0,
  onLike: () => {},
  onPress: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginHorizontal: -Layout.lines(1)
  },
  image: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    height: Layout.lines(22),
    padding: Layout.lines(1)
  },
  actions: {
    width: Layout.lines(4),
    marginLeft: -Layout.lines(0.5),
    paddingLeft: Layout.lines(0.5),
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
});

module.exports = PostImage;
