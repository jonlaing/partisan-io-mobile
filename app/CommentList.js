'use strict';

import React, {
  Component,
  ActionSheetIOS,
  StyleSheet,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

import Api from './Api';
import Router from './Router';
import Colors from './Colors';
import Layout from './Layout';

import Comment from './Comment';

const ACTION_SHEET_BUTTONS = [
  'Flag Comment',
  'Cancel'
];

const MY_ACTION_SHEET_BUTTONS = [
  'Delete Comment',
  'Cancel'
];

const DESTRUCTIVE_INDEX = 0;
const CANCEL_INDEX = 1;

class CommentList extends Component {
  constructor(props) {
    super(props);

    this.state = { comments: [] };
  }

  componentDidMount() {
    this._getComments();
  }

  refresh() {
    this._getComments();
  }

  _getComments() {
    Api.comments(this.props.token).list(this.props.postID)
    .then((data) => this.setState({comments: data.comments}))
    .catch(err => console.log(err));
  }

  _handleMorePress(id, isMine) {
    return () => {
      let sheet = isMine ? MY_ACTION_SHEET_BUTTONS : ACTION_SHEET_BUTTONS;
      ActionSheetIOS.showActionSheetWithOptions({
        options: sheet,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX
      },
      (buttonIndex) => {
        switch(buttonIndex) {
          case DESTRUCTIVE_INDEX:
            if(isMine === false) {
              this._handleFlag(id);
            } else {
              this._handleDelete(id);
            }
            break;
          case CANCEL_INDEX:
          default:
            return;
        }
      });
    };
  }

  _handleFlag(id) {
    let comments = JSON.parse(JSON.stringify(this.state.comments)).filter(c => c.id !== id);
    this.setState({comments: comments});
    this.props.navigator.push(Router.flag('comment', id, this.props.token));
  }

  _handleDelete(id) {
    let comments = JSON.parse(JSON.stringify(this.state.comments)).filter(c => c.id !== id);
    this.setState({comments: comments});

    Api.posts(this.props.token).destroy(id)
    .catch(err => console.log(err));
  }

  _handleUserTag(username) {
  }

  _handleLike(id) {
    return () => {
      // goddamn deep copy
      let comments = JSON.parse(JSON.stringify(this.state.comments)).map((c) => {
        if(c.id === id) {
          c.liked = !c.liked;
          c.like_count = c.liked ? c.like_count + 1 : c.like_count - 1;
          console.log(c);
        }

        return c;
      });

      this.setState({comments: comments});
      Api.posts(this.props.token).like(id).catch(err => console.log("err:", err));
    };
  }

  render() {
    console.log(this.state.comments);
    if(this.state.comments.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.noComments}>This post has no comments</Text>
        </View>
      );
    }

    let comments = this.state.comments.map((c) => {
      let isMine = c.user_id === this.props.navigator.props.user.id;

      return (
        <Comment key={c.id}
          commentID={c.id}
          avatar={c.user.avatar_thumbnail_url}
          username={c.user.username}
          createdAt={c.created_at}
          body={c.body}
          liked={c.liked}
          likeCount={c.like_count}
          onLike={this._handleLike(c.id).bind(this)}
          onHeaderPress={() => this.props.navigator.push(Router.profile(this.props.token, c.user_id))}
          onPress={this._handleMorePress(c.id, isMine).bind(this)}
        />
      );
    });

    return (
      <View style={styles.container}>
        {comments}
      </View>
    );
  }
}

CommentList.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  postID: React.PropTypes.string.isRequired
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.lightGrey
  },
  header: {
    marginBottom: Layout.lines(1)
  },
  headerText: {
    fontWeight: 'bold',
    color: Colors.darkGrey
  },
  horizontalRule: {
    height: 0,
    borderColor: Colors.grey,
    borderWidth: 1
  },
  noComments: {
    padding: Layout.lines(1),
    fontSize: 12,
    color: Colors.darkGrey
  }
});

module.exports = CommentList;
