'use strict';

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
  messages: messages
};
