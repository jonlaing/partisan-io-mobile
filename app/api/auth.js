/*global fetch */
'use strict';

// import {root, headers, processJSON} from './utils';
var {root, headers, processJSON} = require('./utils'); // ES6 importing doesn't work for some reason

module.exports = function() {
  return ({
    login(email, pw, deviceToken) {
      return fetch(`${root()}/login`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          email: email,
          password: pw,
          device_token: deviceToken
        })
      })
      .then(resp => processJSON(resp));
    },

    logout() {
      return fetch(`${root()}/logout`, { headers: headers(), method: 'DELETE' });
    },

    signUp(user, deviceToken) {
      return fetch(`${root()}/users`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          email: user.email,
          username: user.username,
          postal_code: user.postalCode,
          password: user.password,
          password_confirm: user.passwordConfirm,
          device_token: deviceToken
        })
      })
      .then(resp => processJSON(resp));
    },

    forgotPW(email) {
      return fetch(`${root()}/password_reset`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ email: email })
      })
      .then(resp => processJSON(resp));
    },

    resetPW(resetID, email, pw, pwC) {
      return fetch(`${root()}/password_reset/${resetID}`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify({
          email: email,
          password: pw,
          password_confirm: pwC
        })
      });
    }
  });
};
