'use strict';

class Routes {
  Feed() {
    return {
      component: require('./FeedList'),
      title: "Feed"
    }
  }

  PostComposer() {
    return {
      component: require('./PostComposer'),
      title: "Write Post"
    }
  }
