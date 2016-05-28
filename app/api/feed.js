/*global fetch */
'use stict';

// import {root, headers, processJSON} from './utils';
var {root, headers, processJSON} = require('./utils'); // ES6 importing doesn't work for some reason

module.exports = function(token) {
  return ({
    get(page = 0) {
      return fetch(`${root()}/posts/?page=${page}`, { headers: headers(token) })
        .then(res => processJSON(res))
        .then(data => { console.log(data); return data.posts; });
    }
  });
};
