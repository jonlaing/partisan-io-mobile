/*global fetch, FormData */
'use strict';

function _headers(token) {
  if(token !== undefined) {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-Auth-Token': token
    };
  } else {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }
}

let Net = {
  auth() {
    return ({
      login(email, pw) {
        return fetch('http://localhost:4000/api/v1/login', {
          method: 'POST',
          headers: _headers(),
          body: JSON.stringify({
            email: email,
            password: pw
          })
        });
      },

      logout() {
        return fetch("http://localhost:4000/api/v1/logout", { headers: _headers() });
      }
    });
  },

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
  },

  // QUESTIONS
  questions(token) {
    return ({
      get() {
        return fetch('http://localhost:4000/api/v1/questions', { headers: _headers(token) });
      },
      answer(question, agree) {
        return fetch('http://localhost:4000/api/v1/answers', {
          headers: _headers(token),
          method: "PATCH",
          body: JSON.stringify({
            "map": question.map,
            "agree": agree
          })
        });
      }
    });
  }
};

module.exports = Net;

