/*global fetch, FormData, XMLHttpRequest, WebSocket */
'use strict';

import Config from './Config';

function _headers(token, json = true) {
  if(token !== undefined) {
    return {
      'Accept': 'application/json',
      'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Auth-Token': token
    };
  } else {
    return {
      'Accept': 'application/json',
      'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8'
    };
  }
}

function _root(protocol = 'http://') {
  if(Config.env.dev()) {
    return `${protocol}localhost:4000/api/v1`;
  } else if (Config.env.prod()) {
    return `${protocol}www.partisan.io/api/v1`;
  } else {
    throw "UNKNOWN ENVIRONMENT: CANNOT PERFORM NETWORK REQUESTS";
  }
}


let Api = {
  auth() {
    return ({
      login(email, pw) {
        return fetch(`${_root()}/login`, {
          method: 'POST',
          headers: _headers(),
          body: JSON.stringify({
            email: email,
            password: pw
          })
        });
      },

      logout() {
        return fetch(`${_root()}/logout`, { headers: _headers() });
      },

      signUp(user) {
        return fetch(`${_root()}/users`, {
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
        return fetch(`${_root()}/feed?page=${page}`, { headers: _headers(token) });
      }
    });
  },

  // POSTS
  posts(token) {
    return ({
      get(id) {
        return fetch(`${_root()}/posts/${id}`, { headers: _headers(token) });
      },

      like(id) {
        return fetch(`${_root()}/posts/${id}/likes/`, {
          method: 'POST',
          headers: _headers(token)
        });
      },

      create(body, attachments = []) {
        let request = new FormData();

        attachments.forEach((uri) => {
          if(uri.length > 0) {
            request.append('attachment', {
              uri: uri,
              type: 'image/jpeg',
              name: 'post.jpg'
            });
          }
        });

        request.append('body', body);
        return _xhrUpload(request, `${_root()}/posts/`, token);
      }
    });
  },

  // COMMENTS
  comments(token) {
    return ({
      list(postID) {
        return fetch(`${_root()}/posts/${postID}/comments/`, { headers: _headers(token) });
      },

      like(id) {
        return fetch(`${_root()}/comments/${id}/likes/`, {
          method: 'POST',
          headers: _headers(token)
        });
      }
    });
  },

  // QUESTIONS
  questions(token) {
    return ({
      get() {
        return fetch(`${_root()}/questions/`, { headers: _headers(token) });
      },

      answer(question, agree) {
        return fetch(`${_root()}/answers/`, {
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
      get(userID) {
        return fetch(`${_root()}/profiles/${userID}`, {
          headers: _headers(token),
          method: 'GET'
        });
      },

      updateBirthdate(date) {
        let body = new FormData();
        let fDate = date.toJSON().split('T')[0]; // format it for the server
        body.append('birthdate', fDate);

        return fetch(`${_root()}/users/`, {
          headers: _headers(token, false),
          method: 'PATCH',
          body: body
        });
      },

      updateGender(gender) {
        let body = new FormData();
        body.append('gender', gender);

        return fetch(`${_root()}/users/`, {
          headers: _headers(token, false),
          method: 'PATCH',
          body: body
        });
      },

      updateSummary(summary) {
        let body = new FormData();
        body.append('summary', summary);

        return fetch(`${_root()}/profile/`, {
          headers: _headers(token, false),
          method: 'PATCH',
          body: body
        });
      },

      updateLookingFor(val) {
        let body = new FormData();
        body.append('looking_for', val.toString());

        return fetch(`${_root()}/profile/`, {
          headers: _headers(token, false),
          method: 'PATCH',
          body: body
        });
      },

      avatarUpload(uri) {
        let body = new FormData();
        const photo = {
          uri: uri,
          type: 'image/jpeg',
          name: 'avatar.jpg'
        };

        body.append('avatar', photo);
        return _xhrUpload(body, `${_root()}/users/avatar_upload`, token);
      }
    });
  },

  matches(token) {
    return ({
      get(page = 1, distance = 25, gender = "", minAge = -1, maxAge = -1) {
        let params = _urlParams({
            page: page,
            distance: distance,
            gender: gender,
            minAge: minAge,
            maxAge: maxAge
        });

        return fetch(`${_root()}/matches?${params}`,
          {
            headers: _headers(token),
            method: 'GET'
          });
      }
    });
  },

  friendships(token) {
    return ({
      list() {
        return fetch(`${_root()}/friendships/`, {
          headers: _headers(token),
          method: 'GET'
        });
      },

      count() {
        return Api.friendships(token).list().then(data => data.json()).then(json => json.friendships === null ? 0 : json.friendships.length);
      },

      get(friendID) {
        return fetch(`${_root()}/friendships/${friendID}`, {
          headers: _headers(token),
          method: 'GET'
        });
      },

      request(friendID) {
        var body = new FormData();
        body.append('friend_id', friendID.toString());

        return fetch(`${_root()}/friendships/`, {
          headers: _headers(token, false),
          method: 'POST',
          body: body
        });
      },

      confirm(friendID) {
        let body = new FormData();
        body.append('friend_id', friendID.toString());

        return fetch(`${_root()}/friendships/`, {
          headers: _headers(token, false),
          method: 'PATCH',
          body: body
        });
      }
    });
  },

  notifications(token) {
    return ({
      list() {
        return fetch(`${_root()}/notifications/`, { headers: _headers(token) });
      },

      countSocket(onMessage, onError) {
        fetch(`${_root()}/socket_ticket`, { headers: _headers(token) })
        .then(res => res.json())
        .then(ticket => {
          var _socket = new WebSocket(`${_root("ws://")}/notifications/count?key=${ticket.key}`);

          _socket.onmessage = onMessage;
          _socket.onerror = onError;

          _socket.onopen = () => {
            _socket.send("whatever");
            setInterval(() => {
              _socket.send("whatever");
            }, 5000);
          };
        })
        .catch(onError);
      }
    });
  }

};

function _urlParams(params) {
  return Object.keys(params)
  .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
  .join('&');
}

function _xhrUpload(formData, url, token, method = 'POST') {
  var xhr = new XMLHttpRequest();

  return new Promise(function(resolve, reject) {
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (_ok(xhr.status)) {
        resolve(xhr.response);
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.open(method, url);
    xhr.setRequestHeader( 'X-Auth-Token', token);
    xhr.send(formData);
  });
}

let _ok = (status) => status >= 200 && status < 300;

module.exports = Api;
