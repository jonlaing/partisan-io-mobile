'use strict';

import React from 'react-native';

let Router = {
  feed(token) {
    return {
      renderScene(navigator) {
        let FeedList = require('./FeedList');
        return <FeedList token={token} navigator={navigator} />;
      }
    };
  },

  postComposer(token) {
    return {
      renderScene(navigator) {
        let PostComposer = require('./PostComposer');
        return <PostComposer token={token} navigator={navigator} />;
      }
    };
  },

  postScreen(id, token) {
    return {
      renderScene(navigator) {
        let PostScreen = require('./PostScreen');
        return <PostScreen postID={id} token={token} navigator={navigator} />;
      }
    };
  }
};

module.exports = Router;
