'use strict';

import React, {
  Component,
  StyleSheet,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import Layout from '../Layout';
import Colors from '../Colors';
import formatter from '../utils/formatter';

import LikeButton from '../LikeButton';

export default class PostAction extends Component {
  render() {
    return (
      <View style={styles.container}>
        <LikeButton count={this.props.likeCount} onPress={this.props.onLike} active={this.props.liked} color={this.props.color}/>
        <TouchableHighlight style={styles.button} onPress={this.props.onComment}>
          <View style={styles.commentContainer}>
            <Icon style={styles.commentIcon} name="question-answer" size={Layout.lines(1.25)} color={Colors.grey} />
            <Text style={[styles.text, this.props.color === 'light' ? styles.textLight : {}]}>{formatter.count(this.props.commentCount)}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
}

PostAction.propTypes = {
  color: React.PropTypes.oneOf(['dark', 'light']),
  likeCount: React.PropTypes.number,
  commentCount: React.PropTypes.number,
  liked: React.PropTypes.bool,
  onLike: React.PropTypes.func,
  onComment: React.PropTypes.func
};

PostAction.defaultProps = {
  color: 'dark',
  likeCount: 0,
  commentCount: 0,
  liked: false,
  onLike: () => {},
  onComment: () => {}
};

const styles = StyleSheet.create({
  container: {
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: Layout.lines(2),
    marginTop: Layout.lines(0.75)
  },
  commentContainer: {
    flex: 1,
    flexDirection: 'row'
  },
  commentIcon: {
    marginRight: Layout.lines(0.25)
  },
  text: {
    fontSize: Layout.lines(0.75)
  },
  textLight: {
    color: 'white'
  }
});

module.exports = PostAction;
