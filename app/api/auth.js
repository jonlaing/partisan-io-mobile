/*global fetch */
'use strict';

// import {root, headers, processJSON} from './utils';
var {root, headers, processJSON} = require('./utils'); // ES6 importing doesn't work for some reason

module.exports = function() {
  return ({
    login(email, pw) {
      return fetch(`${root()}/login`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          email: email,
          password: pw
        })
      })
      .then(resp => processJSON(resp));
    },

    logout() {
      return fetch(`${root()}/logout`, { headers: headers() });
    },

    signUp(user) {
      return fetch(`${root()}/users`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({
          email: user.email,
          username: user.username,
          postal_code: user.postalCode,
          password: user.password,
          password_confirm: user.passwordConfirm
        })
      })
      .then(resp => processJSON(resp));
    }
  });
};
