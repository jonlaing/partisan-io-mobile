'use strict';

import React from 'react-native';

let Router = {
  welcomeScreen() {
    return {
      renderScene(navigator) {
        let Welcome = require('./Welcome');
        return <Welcome navigator={navigator} />;
      }
    };
  },

  signUpScreen(props) {
    return {
      renderScene(navigator) {
        let SignUp = require('./SignUp');
        return <SignUp navigator={navigator} {...props} />;
      }
    };
  },

  loginScreen(props) {
    return {
      renderScene(navigator) {
        let LoginScreen = require('./LoginScreen');
        return <LoginScreen navigator={navigator} {...props} />;
      }
    };
  },

  questionWelcome(token) {
    return {
      renderScene(navigator) {
        let QuestionWelcome = require('./QuestionWelcome');
        return <QuestionWelcome token={token} navigator={navigator} />;
      }
    };
  },

  questionScreen(token) {
    return {
      renderScene(navigator) {
        let QuestionScreen = require('./QuestionScreen');
        return <QuestionScreen token={token} navigator={navigator} />;
      }
    };
  },

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
