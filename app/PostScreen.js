'use strict';

import React, {
  Component,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import Api from './Api';
import Router from './Router';
import Colors from './Colors';
import Layout from './Layout';

import Post from './Post';
import CommentList from './CommentList';
import CommentComposer from './CommentComposer';

class PostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { post: {}, likeCount: 0, liked: false };
  }

  componentDidMount() {
    Api.posts(this.props.token).get(this.props.postID)
    .then((data) => { console.log(data); this.setState({ post: data.post, likeCount: data.post.like_count, liked: data.post.liked } ); });
  }

  _handleLike() {
    let liked = !this.state.liked;
    // be optimistic
    this.setState({likeCount: (liked ? this.state.likeCount + 1 : this.state.likeCount - 1), liked: liked});

    Api.posts(this.props.token).like(this.props.postID)
    .catch(err => console.log(err));
  }

  _handleDelete(id) {
    Api.posts(this.props.token).destroy(id)
    .then(() => this.props.navigator.pop())
    .then(() => this.props.navigator.props.eventEmitter.emit('post-delete'))
    .catch(err => console.log(err));
  }

  render() {
    if(this.state.post.id === undefined) {
      return <View />;
    }

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableHighlight onPress={() => this.props.navigator.pop()}>
            <Text>Back</Text>
          </TouchableHighlight>
        </View>
        <ScrollView>
          <Post
            token={this.props.token}
            navigator={this.props.navigator}
            postID={this.props.postID}
            username={this.state.post.user.username}
            avatar={this.state.post.user.avatar_thumbnail_url}
            createdAt={this.state.post.created_at}
            action={this.state.post.action}
            body={this.state.post.body}
            attachments={this.state.post.attachments}
            likeCount={this.state.likeCount}
            liked={this.state.liked}
            commentCount={this.state.post.child_count}
            onLike={this._handleLike.bind(this)}
            onFlag={() => this.props.navigator.push(Router.flag('post', this.props.postID, this.props.token))}
            onDelete={this._handleDelete.bind(this)}
            onComment={() => this.refs.commentComposer.focus()}
            onHeaderPress={() => this.props.navigator.push(Router.profile(this.props.token, this.state.post.user_id))}
            showComments={false}
            isMine={this.state.post.user_id === this.props.navigator.props.user.id}
          />
          <CommentList token={this.props.token} postID={this.state.post.id} ref="commentList" />
        </ScrollView>
        <CommentComposer
          token={this.props.token}
          postID={this.state.post.id}
          autoFocus={this.props.comment}
          onFinish={() => this.refs.commentList.refresh() }
          ref="commentComposer"/>
        <KeyboardSpacer />
      </View>
    );
  }
}

PostScreen.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  postID: React.PropTypes.string.isRequired,
  comment: React.PropTypes.bool
};

PostScreen.defaultProps = {
  comment: false
};

let styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGrey
  },
  header: {
    paddingTop: Layout.lines(2),
    paddingHorizontal: Layout.lines(1),
    paddingBottom: Layout.lines(1),
    borderColor: Colors.lightGrey,
    borderBottomWidth: 1,
    backgroundColor: 'white'
  },
  scrollView: {
    flex: 1
  }
});

module.exports = PostScreen;
