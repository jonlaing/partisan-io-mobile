'use strict';

import React, {
  Component,
  StyleSheet,
  View,
  Text
} from 'react-native';

import Api from './Api';
import Colors from './Colors';
import Layout from './Layout';

import Comment from './Comment';

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
      return (
        <Comment key={c.id}
          commentID={c.id}
          avatar={c.user.avatar_thumbnail_url}
          username={c.user.username}
          createdAt={c.created_at}
          body={c.body}
          liked={c.liked}
          likeCount={c.likeCount}
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
