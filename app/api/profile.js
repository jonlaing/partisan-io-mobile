/*global fetch, FormData */
'use strict';

// import {root, headers, processJSON, xhrUpload} from './utils';
var {root, headers, processJSON, xhrUpload} = require('./utils'); // ES6 importing doesn't work for some reason

module.exports = function(token) {
  return ({
    get(userID) {
      return fetch(`${root()}/users/${userID}`, {
        headers: headers(token),
        method: 'GET'
      })
      .then(resp => processJSON(resp));
    },

    update(postalCode, birthdate, gender, lookingFor, summary) {
      let date = new Date(birthdate);
      let fDate = date.toJSON().split('T')[0]; // format it for the server

      return fetch(`${root()}/users/`, {
        headers: headers(token),
        method: 'PATCH',
        body: JSON.stringify({
          postal_code: postalCode,
          birthdate: fDate,
          gender: gender,
          looking_for: lookingFor,
          summary: summary
        })
      })
      .then(resp => processJSON(resp));
    },

    updateBirthdate(date) {
      let fDate = date.toJSON().split('T')[0]; // format it for the server

      return fetch(`${root()}/users/`, {
        headers: headers(token),
        method: 'PATCH',
        body: JSON.stringify({ birthdate: fDate })
      })
      .then(resp => processJSON(resp));
    },

    updateGender(gender) {
      return fetch(`${root()}/users/`, {
        headers: headers(token),
        method: 'PATCH',
        body: JSON.stringify({ gender: gender })
      })
      .then(resp => processJSON(resp));
    },

    updateSummary(summary) {
      return fetch(`${root()}/users/`, {
        headers: headers(token),
        method: 'PATCH',
        body: JSON.stringify({ summary: summary })
      })
      .then(resp => processJSON(resp));
    },

    updateLookingFor(val) {
      return fetch(`${root()}/users/`, {
        headers: headers(token),
        method: 'PATCH',
        body: JSON.stringify({ looking_for: val })
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
