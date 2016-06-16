/*global fetch, FormData */

'use strict';

// import {root, headers, processJSON, urlParams} from './utils';
var {root, headers, processJSON, xhrUpload} = require('./utils'); // ES6 importing doesn't work for some reason

module.exports = function(token) {
  return ({
    list(page = 0) {
      return fetch(`${root()}/events?page=${page}`,
        {
          headers: headers(token),
          method: 'GET'
        })
        .then(resp => processJSON(resp))
        .then(resp => resp.events)
        .then(events => { console.log(events); return events; });
    },

    listSubscriptions(page = 0) {
      return fetch(`${root()}/events?page=${page}&subscriptions=true`,
        {
          headers: headers(token),
          method: 'GET'
        })
        .then(resp => processJSON(resp))
        .then(resp => resp.events)
        .then(events => { console.log(events); return events; });
    },

    get(eventID) {
      return fetch(`${root()}/events/${eventID}`, { headers: headers(token) }).then(resp => resp.json());
    },

    posts(eventID, page = 0) {
      return fetch(`${root()}/events/${eventID}/posts?page=${page}`, { headers: headers(token) })
      .then(resp => resp.json())
      .then(data => data.posts);
    },

    post(eventID, body, attachments = []) {
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

      request.append('body', body);
      request.append('action', 'post');
      request.append('parent_type', 'event');
      request.append('parent_id', eventID);
      return xhrUpload(request, `${root()}/posts/`, token);
    },

    going(eventID) {
      return fetch(`${root()}/events/${eventID}/going`, {
          headers: headers(token),
          method: 'POST'
      })
      .then(resp => processJSON(resp));
    },

    maybe(eventID) {
      return fetch(`${root()}/events/${eventID}/maybe`, {
          headers: headers(token),
          method: 'POST'
      })
      .then(resp => processJSON(resp));
    },

    unsubscribe(eventID) {
      return fetch(`${root()}/events/${eventID}/unsubscribe`, {
          headers: headers(token),
          method: 'DELETE'
      })
      .then(resp => processJSON(resp));
    },

    addHost(eventID, userID) {
      return fetch(`${root()}/events/${eventID}/hosts/${userID}`, {
          headers: headers(token),
          method: 'POST'
      })
      .then(resp => processJSON(resp));
    },

    removeHost(eventID, hostID) {
      return fetch(`${root()}/events/${eventID}/hosts/${hostID}`, {
          headers: headers(token),
          method: 'DELETE'
      })
      .then(resp => processJSON(resp));
    },

    create(event) {
      let request = new FormData();

      if(event.coverPhoto.uri.length > 0) {
        request.append('cover_photo', {
          uri: event.coverPhoto.uri,
          type: 'image/jpeg',
          name: 'coverphoto.jpg'
        });
      }

      let startDate = event.startDate.toJSON().split('Z')[0];
      let endDate = event.endDate.toJSON().split('Z')[0];

      request.append('title', event.title);
      request.append('start_date', startDate);
      request.append('end_date', endDate);
      request.append('location', event.location);
      request.append('summary', event.summary);

      return xhrUpload(request, `${root()}/events/`, token);
    },

    update(eventID, event) {
      let request = new FormData();

      if(event.coverPhoto.uri.length > 0 && event.coverPhoto.uri.match(/^http/) == null) {
        request.append('cover_photo', {
          uri: event.coverPhoto.uri,
          type: 'image/jpeg',
          name: 'coverphoto.jpg'
        });
      }

      let startDate = event.startDate.toJSON().split('Z')[0];
      let endDate = event.endDate.toJSON().split('Z')[0];

      request.append('title', event.title);
      request.append('start_date', startDate);
      request.append('end_date', endDate);
      request.append('location', event.location);
      request.append('summary', event.summary);

      return xhrUpload(request, `${root()}/events/${eventID}`, token, 'PATCH');
    },

    destroy(eventID) {
      return fetch(`${root()}/events/${eventID}`, {
        headers: headers(token),
        method: 'DELETE'
      });
    }
  });
};
