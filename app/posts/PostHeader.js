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
  'Share on Facebook',
  'Share on Twitter',
  'Flag Post',
  'Cancel'
];

const MY_ACTION_SHEET_BUTTONS = [
  'Share on Facebook',
  'Share on Twitter',
  'Delete Post',
  'Cancel'
];

const FB_INDEX = 0;
const TW_INDEX = 1;
const DESTRUCTIVE_INDEX = 2;
const CANCEL_INDEX = 3;

export default class PostHeader extends Component {
  handleMorePress() {
    let sheet = this.props.isMine ? MY_ACTION_SHEET_BUTTONS : ACTION_SHEET_BUTTONS;
    ActionSheetIOS.showActionSheetWithOptions({
      options: sheet,
      cancelButtonIndex: CANCEL_INDEX,
      destructiveButtonIndex: DESTRUCTIVE_INDEX
    },
    (buttonIndex) => {
      switch(buttonIndex) {
        case FB_INDEX:
                this.props.onFacebookShare();
                break;
        case TW_INDEX:
                this.props.onTwitterShare();
                break;
        case DESTRUCTIVE_INDEX:
                if(this.props.isMine === false) {
                  this.props.onFlag("post", this.props.postID);
                } else {
                  this.props.onDelete(this.props.postID);
                }
                break;
        case CANCEL_INDEX:
        default:
                return;
      }
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
  action: React.PropTypes.string.isRequired,
  username: React.PropTypes.string.isRequired,
  createdAt: React.PropTypes.string.isRequired,
  onPress: React.PropTypes.func,
  onFacebookShare: React.PropTypes.func,
  onTwitterShare: React.PropTypes.func,
  onFlag: React.PropTypes.func,
  onDelete: React.PropTypes.func,
  isMine: React.PropTypes.bool
};

PostHeader.defaultProps = {
  onPress: () => {},
  onFlag: () => {},
  onFacebookShare: () => {},
  onTwitterShare: () => {},
  onDelete: () => {},
  isMine: false
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
