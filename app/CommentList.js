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
    .then((res) => JSON.parse(res._bodyInit))
    .then((data) => this.setState({comments: data.comments}))
    .catch(err => console.log(err));
  }

  render() {
    if(this.state.comments.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.noComments}>This post has no comments</Text>
        </View>
      );
    }

    let comments = this.state.comments.map((i) => <Comment key={i.comment.id} item={i} />);

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
