/*global fetch, FormData */
'use strict';

// import {root, headers, processJSON, xhrUpload} from './utils';
var {root, headers, processJSON, xhrUpload} = require('./utils'); // ES6 importing doesn't work for some reeason

module.exports = function(token) {
  return ({
    list(postID) {
      return fetch(`${root()}/posts/${postID}/comments/`, { headers: headers(token) })
      .then(resp => processJSON(resp));
    },

    like(id) {
      return fetch(`${root()}/comments/${id}/like/`, {
        method: 'POST',
        headers: headers(token)
      })
      .then(resp => processJSON(resp));
    },

    create(postID, body, attachments = []) {
      let request = new FormData();

      attachments.forEach((uri) => {
        if(uri.length > 0) {
          request.append('attachments', {
            uri: uri,
            type: 'image/jpeg',
            name: 'post.jpg'
          });
        }
      });

      request.append('action', 'comment');
      request.append('body', body);
      return xhrUpload(request, `${root()}/posts/${postID}/comments`, token);
    }

  });
};
