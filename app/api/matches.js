/*global fetch */

'use strict';

// import {root, headers, processJSON, urlParams} from './utils';
var {root, headers, processJSON} = require('./utils'); // ES6 importing doesn't work for some reason

module.exports = function(token) {
  return ({
    get(page = 1, distance = 25, gender = "", minAge = -1, maxAge = -1, lookingFor = 7) {
      let params = JSON.stringify({
          page: page,
          radius: distance,
          gender: gender,
          minAge: minAge,
          maxAge: maxAge,
          lookingfor: lookingFor
      });

      return fetch(`${root()}/matches`,
        {
          headers: headers(token),
          method: 'POST',
          body: params
        })
        .then(resp => processJSON(resp))
        .then(resp => resp.matches)
        .then(matches => { console.log(matches); return matches; });
    }
  });
};
