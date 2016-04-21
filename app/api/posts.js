/*global fetch, FormData */
'use strict';

// import {root, headers, processJSON, xhrUpload} from './utils';
var {root, headers, processJSON, xhrUpload} = require('./utils'); // ES6 importing doesn't work for some reason

module.exports = function(token) {
  return ({
    get(id) {
      return fetch(`${root()}/posts/${id}`, { headers: headers(token) })
      .then(res => processJSON(res));
    },

    like(id) {
      return fetch(`${root()}/posts/${id}/likes/`, {
        method: 'POST',
        headers: headers(token)
      })
      .then(res => processJSON(res));
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
      return xhrUpload(request, `${root()}/posts/`, token);
    }
  });
};
