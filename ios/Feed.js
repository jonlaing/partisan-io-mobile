/*global fetch */
'use strict';
import React, {
  Component,
  NavigatorIOS,
  StyleSheet
} from 'react-native';

import FeedList from './FeedList';
import PostComposer from './PostComposer';

class Feed extends Component {
  constructor(props) {
    super(props);
    this.state = { post: '', optimisticPost: {} };
  }

  _submitPost() {
    fetch('http://localhost:4000/api/v1/posts', {
      method: 'POST',
      header: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: _serializeJSON({
        body: this.state.post
      })
    })
    .then(() => this.refs.nav.resetTo(this._feedRoute()));
  }

  _feedRoute(margin = false) {
    return {
      title: 'Feed',
      component: FeedList,
      passProps: { token: this.props.token, margin: margin },
      rightButtonTitle: "Post",
      onRightButtonPress: () => {
        this.refs.nav.push({
          title: 'Post',
          component: PostComposer,
          passProps: {
            token: this.props.token,
            onChange: (text) => this.setState({post: text})
          },
          leftButtonTitle: "Cancel",
          onLeftButtonPress: () => this.refs.nav.pop(),
          rightButtonTitle: "Submit",
          onRightButtonPress: this._submitPost.bind(this)
        });
      }
    };
  }

  render() {
    return (
      <NavigatorIOS
        ref="nav"
        style={styles.navigator}
        initialRoute={this._feedRoute()}
        tintColor="rgb(255,255,255)"
        titleTextColor="rgb(255,255,255)"
        barTintColor="rgb(0,210,195)"
      />
    );
  }
}

const styles = StyleSheet.create({
  navigator: {
    flex: 1
  }
});

var _serializeJSON = (data) => {
  return Object.keys(data)
    .map( (keyName) => encodeURIComponent(keyName) + '=' + encodeURIComponent(data[keyName]) )
    .join('&');
};


module.exports = Feed;
