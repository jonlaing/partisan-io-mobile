'use strict';

import React, {
  Component,
  TouchableHighlight,
  StyleSheet,
  View,
  Text
} from 'react-native';

import ExNavigator from '@exponent/react-native-navigator';

import Api from './Api';
import Colors from './Colors';
import Layout from './Layout';

import Post from './Post';
import CommentList from './CommentList';

class PostScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { post: {}, user: {}, commentCount: 0, likeCount: 0, liked: false };
  }

  componentDidMount() {
    Api(this.props.navigator.props.environment).posts(this.props.token).get(this.props.postID)
    .then((res) => JSON.parse(res._bodyInit))
    .then((data) => this.setState({ post: data.post, user: data.user }));
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
        <Post
          token={this.props.token}
          post={this.state.post}
          user={this.state.user}
          imageAttachment={this.state.imageAttachment}
          likeCount={this.state.likeCount}
          liked={this.state.liked}
          navigator={this.props.navigator}
          onHeaderPress={() => console.log("header pressed")}
        />
        <CommentList token={this.props.token} postID={this.state.post.id} />
      </View>
    );
  }
}

PostScreen.propTypes = {
  token: React.PropTypes.string.isRequired,
  navigator: React.PropTypes.instanceOf(ExNavigator).isRequired,
  postID: React.PropTypes.number.isRequired
};

let styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.lightGrey
  },
  header: {
    paddingTop: Layout.lines(2),
    paddingHorizontal: Layout.lines(1),
    paddingBottom: Layout.lines(1),
    borderColor: Colors.lightGrey,
    borderBottomWidth: 1,
    backgroundColor: 'white'
  }
});

module.exports = PostScreen;
