'use strict';

import React, {
  Component,
  StyleSheet,
  ActionSheetIOS,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Layout from '../Layout';
import Colors from '../Colors';

import Avatar from '../Avatar';

const ACTION_SHEET_BUTTONS = [
  'Flag Post',
  'Cancel'
];

const DESTRUCTIVE_INDEX = 0;
const CANCEL_INDEX = 1;

export default class PostHeader extends Component {
  handleMorePress() {
    ActionSheetIOS.showActionSheetWithOptions({
      options: ACTION_SHEET_BUTTONS,
      cancelButtonIndex: CANCEL_INDEX,
      destructiveButtonIndex: DESTRUCTIVE_INDEX
    },
    (buttonIndex) => {
      if(buttonIndex === CANCEL_INDEX) {
        return;
      }

      this.props.onFlag("post", this.props.postID);
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableHighlight style={{flex: 1}} onPress={this.props.onPress} >
          <View style={styles.postHead}>
            <Avatar url={this.props.avatar} style={styles.avatar} />
            <View style={styles.postUser}>
              <Text style={styles.postUserText}>@{this.props.username}</Text>
              <Text style={styles.postDate}>{moment(this.props.createdAt).fromNow()}</Text>
            </View>
          </View>
        </TouchableHighlight>
        <TouchableHighlight onPress={this.handleMorePress.bind(this)}>
          <Icon name="more-vert" size={32} color={Colors.grey} />
        </TouchableHighlight>
      </View>
    );
  }
}

PostHeader.propTypes = {
  postID: React.PropTypes.string.isRequired,
  username: React.PropTypes.string.isRequired,
  createdAt: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func,
  onFlag: React.PropTypes.func
};

PostHeader.defaultProps = {
  onPress: () => {},
  onFlag: () => {}
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: Layout.lines(1),
    marginRight: -Layout.lines(1)
  },
  postHead: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'row'
  },
  avatar: {
    height: Layout.lines(2),
    width: Layout.lines(2),
    marginRight: Layout.lines(2),
    borderRadius: Layout.lines(1),
    backgroundColor: Colors.lightGrey
  },
  postUser: {
    flex: 1,
    justifyContent: 'flex-start'
  },
  postUserText: {
    fontSize: Layout.lines(1),
    color: Colors.action
  },
  postDate: {
    color: Colors.grey,
    fontSize: Layout.lines(0.75)
  }
});

module.exports = PostHeader;
