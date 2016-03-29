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
        let QuestionWelcome = require('./ftue/QuestionWelcome');
        return <QuestionWelcome token={token} navigator={navigator} />;
      }
    };
  },

  questionScreen(token) {
    return {
      renderScene(navigator) {
        let QuestionScreen = require('./ftue/QuestionScreen');
        return <QuestionScreen token={token} navigator={navigator} />;
      }
    };
  },

  profileFTUEWelcome(token) {
    return {
      renderScene(navigator) {
        let ProfileFTUEWelcome = require('./ftue/ProfileWelcome');
        return <ProfileFTUEWelcome token={token} navigator={navigator} />;
      }
    };
  },

  profileFTUEBirthdate(token) {
    return {
      renderScene(navigator) {
        let ProfileFTUEBirthdate = require('./ftue/Birthdate');
        return <ProfileFTUEBirthdate token={token} navigator={navigator} />;
      }
    };
  },

  profileFTUEGender(token) {
    return {
      renderScene(navigator) {
        let ProfileFTUEGender = require('./ftue/Gender');
        return <ProfileFTUEGender token={token} navigator={navigator} />;
      }
    };
  },

  profileFTUESummary(token) {
    return {
      renderScene(navigator) {
        let ProfileFTUESummary = require('./ftue/Summary');
        return <ProfileFTUESummary token={token} navigator={navigator} />;
      }
    };
  },

  profileFTUELookingFor(token) {
    return {
      renderScene(navigator) {
        let ProfileFTUELookingFor = require('./ftue/LookingFor');
        return <ProfileFTUELookingFor token={token} navigator={navigator} onSubmit={() => navigator.push(Router.profileFTUEAvatar(token))}/>;
      }
    };
  },

  profileFTUEAvatar(token) {
    return {
      renderScene(navigator) {
        let ProfileFTUEAvatar = require('./ftue/Avatar');
        return <ProfileFTUEAvatar token={token} navigator={navigator} />;
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