/*global fetch */

'use strict';

// import {root, headers, processJSON, urlParams} from './utils';
var {root, headers, processJSON, urlParams} = require('./utils'); // ES6 importing doesn't work for some reason

module.exports = function(token) {
  return ({
    get(page = 1, distance = 25, gender = "", minAge = -1, maxAge = -1) {
      let params = urlParams({
          page: page,
          distance: distance,
          gender: gender,
          minAge: minAge,
          maxAge: maxAge
      });

      return fetch(`${root()}/matches?${params}`,
        {
          headers: headers(token),
          method: 'GET'
        })
        .then(resp => processJSON(resp));
    }
  });
};
