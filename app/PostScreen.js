'use strict';

import React, {
  Component,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  TextInput,
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

class PostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { post: {}, user: {}, commentCount: 0, likeCount: 0, liked: false, imageAttachment: { image_url: '' } };
  }

  componentDidMount() {
    Api.posts(this.props.token).get(this.props.postID)
    .then(res => res.json())
    .then((data) => this.setState({ post: data.post, user: data.user, imageAttachment: data.image_attachment }));
  }

  _handleLike() {
    Api.posts(this.props.token).like(this.props.postID)
    .then(res => res.json())
    .then(data => this.setState({likeCount: data.like_count, liked: data.liked}))
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
            post={this.state.post}
            user={this.state.user}
            imageAttachment={this.state.imageAttachment}
            likeCount={this.state.likeCount}
            liked={this.state.liked}
            navigator={this.props.navigator}
            onHeaderPress={() => this.props.navigator.push(Router.profile(this.props.token, this.state.user.id))}
            onLike={this._handleLike.bind(this)}
            onComment={() => this.refs.commentComposer.focus()}
          />
          <CommentList token={this.props.token} postID={this.state.post.id} />
        </ScrollView>
        <TextInput
          style={styles.commentComposer}
          autoFocus={this.props.comment}
          placeholder="Write a comment..."
          ref="commentComposer"
        />
        <KeyboardSpacer />
      </View>
    );
  }
}

PostScreen.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  postID: React.PropTypes.number.isRequired,
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
  },
  commentComposer: {
    minHeight: Layout.lines(3),
    paddingHorizontal: Layout.lines(1),
    borderColor: Colors.lightGrey,
    borderWidth: 1,
    backgroundColor: 'white'
  }
});

module.exports = PostScreen;
