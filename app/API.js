/*global fetch, FormData */
'use strict';

const _DEV = 0;
const _PROD = 1;

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

function _root(env) {
  if(env === _DEV) {
    return 'http://localhost:4000/api/v1';
  } else if (env === _PROD) {
    return 'http://www.partisan.io/api/v1';
  }

  throw "UNKNOWN ENVIRONMENT: CANNOT PERFORM NETWORK REQUESTS";
}


let api = function(env) {
  return {
    auth() {
      return ({
        login(email, pw) {
          return fetch(_root(env) + '/login', {
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
        },

        signUp(user) {
          return fetch("http://localhost:4000/api/v1/users", {
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
          return fetch(_root(env) + '/feed?page=' + page, { headers: _headers(token) });
        }
      });
    },

    // POSTS
    posts(token) {
      return ({
        get(id) {
          return fetch(_root(env) + '/posts/' + id, { headers: _headers(token) });
        },

        create(body, attachments = []) {
          var request = new FormData();

          attachments.forEach((val) => request.append('attachment', val));
          request.append('body', body);

          return fetch(_root(env) + '/posts', {
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
          return fetch(_root(env) + '/posts/' + postID + '/comments', { headers: _headers(token) });
        }
      });
    },

    // QUESTIONS
    questions(token) {
      return ({
        get() {
          return fetch(_root(env) + '/questions', { headers: _headers(token) });
        },
        answer(question, agree) {
          return fetch(_root(env) + '/answers', {
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
          return fetch(_root(env) + '/users', {
            headers: _headers(token),
            method: 'PATCH',
            body: JSON.stringify({
              birthdate: date
            })
          });
        },
        updateGender(gender) {
          return fetch(_root(env) + '/users', {
            headers: _headers(token),
            method: 'PATCH',
            body: JSON.stringify({
              gender: gender
            })
          });
        },
        updateLookingFor(val) {
          return fetch(_root(env) + '/users', {
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
};

module.exports = api;
