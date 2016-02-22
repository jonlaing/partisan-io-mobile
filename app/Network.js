/*global fetch, FormData */
'use strict';

function _headers(token) {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'X-Auth-Token': token
  };
}

let Net = {
  // FEED
  feed(token) {
    return ({
      get(page) {
        return fetch('http://localhost:4000/api/v1/feed?page=' + page, { headers: _headers(token) });
      }
    });
  },

  // POSTS
  posts(token) {
    return ({
      get(id) {
        return fetch('http://localhost:4000/api/v1/posts/' + id, { headers: _headers(token) });
      },

      create(body, attachments = []) {
        var request = new FormData();

        attachments.forEach((val) => request.append('attachment', val));
        request.append('body', body);

        return fetch('http://localhost:4000/api/v1/posts', {
          method: 'POST',
          headers: _headers(token),
          body: request
        });
      }
    });
  },

  // COMMENTS
  comments(token) {
    return ({
      list(postID) {
        return fetch('http://localhost:4000/api/v1/posts/' + postID + '/comments', { headers: _headers(token) });
      }
    });
  }
};

module.exports = Net;

