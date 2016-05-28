/*global fetch, FormData */
'use strict';

// import {root, headers, processJSON} from './utils';
var {root, headers, processJSON} = require('./utils'); // ES6 importing doesn't work for some reason

function friendships(token) {
  return ({
    list() {
      return fetch(`${root()}/friendships/`, {
        headers: headers(token),
        method: 'GET'
      })
      .then(resp => processJSON(resp))
      .then(json => json.friendships);
    },

    count() {
      return friendships(token).list().then(fs => fs === undefined ? 0 : fs.length);
    },

    get(friendID) {
      return fetch(`${root()}/friendships/${friendID}`, {
        headers: headers(token),
        method: 'GET'
      })
      .then(resp => processJSON(resp));
    },

    request(friendID) {
      return fetch(`${root()}/friendships/`, {
        headers: headers(token, false),
        method: 'POST',
        body: JSON.stringify({ friend_id: friendID })
      })
      .then(resp => processJSON(resp));
    },

    confirm(friendID) {
      return fetch(`${root()}/friendships/${friendID}`, {
        headers: headers(token, false),
        method: 'PATCH',
        body: JSON.stringify({ friend_id: friendID, confirmed: true })
      })
      .then(resp => processJSON(resp));
    }
  });
}

module.exports = friendships;
