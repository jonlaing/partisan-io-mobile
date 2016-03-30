/*global fetch, FormData */
'use strict';

import Config from './Config';

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

function _root() {
  if(Config.env.dev()) {
    return 'http://localhost:4000/api/v1';
  } else if (Config.env.prod()) {
    return 'http://www.partisan.io/api/v1';
  }

  throw "UNKNOWN ENVIRONMENT: CANNOT PERFORM NETWORK REQUESTS";
}


let Api = {
  auth() {
    return ({
      login(email, pw) {
        return fetch(_root() + '/login', {
          method: 'POST',
          headers: _headers(),
          body: JSON.stringify({
            email: email,
            password: pw
          })
        });
      },

      logout() {
        return fetch(_root() + '/logout', { headers: _headers() });
      },

      signUp(user) {
        return fetch(_root() + '/users', {
          method: 'POST',
          headers: _headers(),
          body: JSON.stringify({
            email: user.email,
            username: user.username,
            postal_code: user.postalCode,
            password: user.password,
            password_confirm: user.passwordConfirm
          })
        });
      }
    });
  },

  // FEED
  feed(token) {
    return ({
      get(page) {
        return fetch(_root() + '/feed?page=' + page, { headers: _headers(token) });
      }
    });
  },

  // POSTS
  posts(token) {
    return ({
      get(id) {
        return fetch(_root() + '/posts/' + id, { headers: _headers(token) });
      },

      create(body, attachments = []) {
        var request = new FormData();

        attachments.forEach((val) => request.append('attachment', val));
        request.append('body', body);

        return fetch(_root() + '/posts', {
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
        return fetch(_root() + '/posts/' + postID + '/comments', { headers: _headers(token) });
      }
    });
  },

  // QUESTIONS
  questions(token) {
    return ({
      get() {
        return fetch(_root() + '/questions', { headers: _headers(token) });
      },
      answer(question, agree) {
        return fetch(_root() + '/answers', {
          headers: _headers(token),
          method: "PATCH",
          body: JSON.stringify({
            "map": question.map,
            "agree": agree
          })
        });
      }
    });
  },

  // PROFILE
  profile(token) {
    return ({
      updateBirthdate(date) {
        return fetch(_root() + '/users', {
          headers: _headers(token),
          method: 'PATCH',
          body: JSON.stringify({
            birthdate: date
          })
        });
      },
      updateGender(gender) {
        return fetch(_root() + '/users', {
          headers: _headers(token),
          method: 'PATCH',
          body: JSON.stringify({
            gender: gender
          })
        });
      },
      updateSummary(summary) {
        return fetch(_root() + '/users', {
          headers: _headers(token),
          method: 'PATCH',
          body: JSON.stringify({
            summary: summary
          })
        });
      },
      updateLookingFor(val) {
        return fetch(_root() + '/users', {
          headers: _headers(token),
          method: 'PATCH',
          body: JSON.stringify({
            looking_for: val
          })
        });
      }
    });
  }
};

module.exports = Api;
