/*global fetch */
'use strict';

var {root, headers, processJSON} = require('./api/utils'); // ES6 importing doesn't work for some reason

import auth from './api/auth';
import feed from './api/feed';
import posts from './api/posts';
import comments from './api/comments';
import questions from './api/questions';
import profile from './api/profile';
import matches from './api/matches';
import friendships from './api/friendships';
import notifications from './api/notifications';
import messages from './api/messages';

module.exports = {
  auth: auth,
  feed: feed,
  posts: posts,
  comments: comments,
  questions: questions,
  profile: profile,
  matches: matches,
  friendships: friendships,
  notifications: notifications,
  messages: messages,
  flag: (recordType, recordID, reason, comment, token) => {
    return fetch(`${root()}/flag`, {
      headers: headers(token),
      body: JSON.stringify({
        record_type: recordType,
        record_id: recordID,
        reason: reason,
        message: comment
      }),
      method: 'POST'
    }).then(res => processJSON(res));
  }
};
