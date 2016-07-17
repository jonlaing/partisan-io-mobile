/*global fetch */
'use strict';

// import {root, headers, processJSON} from './utils';
var {root, headers, processJSON} = require('./utils'); // ES6 importing doesn't work for some reason

module.exports = function(token) {
  return ({
    get() {
      return fetch(`${root()}/questions/`, { headers: headers(token) })
      .then(resp => processJSON(resp));
    },

    answer(question, mask, agree) {
      return fetch(`${root()}/answers/`, {
        headers: headers(token),
        method: "PATCH",
        body: JSON.stringify({
          "map": question.map,
          "mask": mask,
          "agree": agree
        })
      })
      .then(resp => processJSON(resp));
    }
  });
};
