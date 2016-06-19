'use strict';

import React from 'react-native';

let Router = {
  mainScreen(token, openSideMenu = false) {
    return {
      renderScene(navigator) {
        let MainScreen = require('./MainScreen');
        return <MainScreen token={token} navigator={navigator} openSideMenu={openSideMenu} />;
      }
    };
  },

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

  passwordReset(resetID) {
    return {
      renderScene(navigator) {
        let PasswordReset = require('./PasswordReset');
        return <PasswordReset navigator={navigator} resetID={resetID} />;
      }
    };
  },

  questionWelcome(token) {
    return {
      renderScene(navigator) {
        let QuestionWelcome = require('./ftue/QuestionWelcome');
        return <QuestionWelcome token={token} onComplete={() => navigator.push(Router.questionScreen(token))} />;
      }
    };
  },

  questionScreen(token) {
    return {
      renderScene(navigator) {
        let QuestionScreen = require('./ftue/QuestionScreen');
        return <QuestionScreen token={token} onComplete={() => navigator.push(Router.profileFTUELookingFor(token))}/>;
      }
    };
  },

  profileFTUELookingFor(token) {
    return {
      renderScene(navigator) {
        let ProfileFTUELookingFor = require('./LookingFor');
        return <ProfileFTUELookingFor token={token} navigator={navigator} onSubmit={() => navigator.push(Router.mainScreen(token, true))}/>;
      }
    };
  },

  profile(token, userID) {
    return {
      renderScene(navigator) {
        let Profile = require('./Profile');
        return <Profile token={token} navigator={navigator} userID={userID} />;
      }
    };
  },

  profileEdit(token, user) {
    return {
      renderScene(navigator) {
        let ProfileEdit = require('./ProfileEdit');
        return <ProfileEdit token={token} navigator={navigator} user={user} />;
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

  matches(token, sideMenu = true) {
    return {
      renderScene(navigator) {
        let MatchList = require('./MatchList');
        return <MatchList token={token} navigator={navigator} sideMenu={sideMenu} />;
      }
    };
  },

  events(token) {
    return {
      renderScene(navigator) {
        let EventList = require('./EventList');
        return <EventList token={token} navigator={navigator} />;
      }
    };
  },

  friends(token) {
    return {
      renderScene(navigator) {
        let FriendList = require('./FriendList');
        return <FriendList token={token} navigator={navigator} />;
      }
    };
  },

  eventComposer(token, eventID = '') {
    return {
      renderScene(navigator) {
        let EventComposer = require('./EventComposer');
        return <EventComposer token={token} navigator={navigator} eventID={eventID} />;
      }
    };
  },

  eventScreen(id, token) {
    return {
      renderScene(navigator) {
        let EventScreen = require('./EventScreen');
        return <EventScreen eventID={id} token={token} navigator={navigator} />;
      }
    };
  },

  eventHosts(id, hosts, token) {
    return {
      renderScene(navigator) {
        let EventHosts = require('./EventHosts');
        return <EventHosts eventID={id} hosts={hosts} token={token} navigator={navigator} />;
      }
    };
  },

  eventSubscriptions(token) {
    return {
      renderScene(navigator) {
        let EventSubscriptionsScreen = require('./EventSubscriptionsScreen');
        return <EventSubscriptionsScreen token={token} navigator={navigator} />;
      }
    };
  },

  postComposer(token, parentType = '', parentID = '') {
    return {
      renderScene(navigator) {
        let PostComposer = require('./PostComposer');
        return <PostComposer token={token} navigator={navigator} parentType={parentType} parentID={parentID} />;
      }
    };
  },

  postScreen(id, token, comment = false) {
    return {
      renderScene(navigator) {
        let PostScreen = require('./PostScreen');
        return <PostScreen postID={id} token={token} navigator={navigator} comment={comment} />;
      }
    };
  },

  notifications(token) {
    return {
      renderScene(navigator) {
        let NotificationScreen = require('./NotificationScreen');
        return <NotificationScreen token={token} navigator={navigator} />;
      }
    };
  },

  messageList(token) {
    return {
      renderScene(navigator) {
        let MessageList = require('./MessageList');
        return <MessageList token={token} navigator={navigator} />;
      }
    };
  },

  chat(threadID, user, token) {
    return {
      renderScene(navigator) {
        let Chat = require('./Chat');
        return <Chat threadID={threadID} user={user} token={token} navigator={navigator} />;
      }
    };
  },

  flag(recordType, recordID, token) {
    return {
      renderScene(navigator) {
        let Flag = require('./Flag');
        return <Flag recordType={recordType} recordID={recordID} token={token} navigator={navigator} />;
      }
    };
  }
};

module.exports = Router;
