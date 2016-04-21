/*global fetch, FormData */
'use strict';

// import {root, headers, processJSON, xhrUpload} from './utils';
var {root, headers, processJSON, xhrUpload} = require('./utils'); // ES6 importing doesn't work for some reason

module.exports = function(token) {
  return ({
    get(userID) {
      return fetch(`${root()}/profiles/${userID}`, {
        headers: headers(token),
        method: 'GET'
      })
      .then(resp => processJSON(resp));
    },

    updateBirthdate(date) {
      let body = new FormData();
      let fDate = date.toJSON().split('T')[0]; // format it for the server
      body.append('birthdate', fDate);

      return fetch(`${root()}/users/`, {
        headers: headers(token, false),
        method: 'PATCH',
        body: body
      })
      .then(resp => processJSON(resp));
    },

    updateGender(gender) {
      let body = new FormData();
      body.append('gender', gender);

      return fetch(`${root()}/users/`, {
        headers: headers(token, false),
        method: 'PATCH',
        body: body
      })
      .then(resp => processJSON(resp));
    },

    updateSummary(summary) {
      let body = new FormData();
      body.append('summary', summary);

      return fetch(`${root()}/profile/`, {
        headers: headers(token, false),
        method: 'PATCH',
        body: body
      })
      .then(resp => processJSON(resp));
    },

    updateLookingFor(val) {
      let body = new FormData();
      body.append('looking_for', val.toString());

      return fetch(`${root()}/profile/`, {
        headers: headers(token, false),
        method: 'PATCH',
        body: body
      })
      .then(resp => processJSON(resp));
    },

    avatarUpload(uri) {
      let body = new FormData();
      const photo = {
        uri: uri,
        type: 'image/jpeg',
        name: 'avatar.jpg'
      };

      body.append('avatar', photo);
      return xhrUpload(body, `${root()}/users/avatar_upload`, token);
    }
  });
};
