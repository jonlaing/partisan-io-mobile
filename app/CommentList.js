'use strict';

import React, {
  Component,
  StyleSheet,
  View,
  Text
} from 'react-native';

import api from './API';
import Colors from './Colors';
import Layout from './Layout';

import Comment from './Comment';

class CommentList extends Component {
  constructor(props) {
    super(props);

    this.state = { comments: [] };
  }

  componentDidMount() {
    api(this.props.navigator.props.environment).comments(this.props.token).list(this.props.postID)
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
    padding: Layout.lines(1),
    backgroundColor: Colors.lightGrey
  },
  noComments: {
    fontSize: 12,
    color: Colors.grey
  }
});

module.exports = CommentList;
