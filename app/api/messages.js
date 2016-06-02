/*global fetch, WebSocket */
'use strict';

import moment from 'moment';

// import { protocols, root, headers, withTicket } from './utils';
var { protocols, root, headers, withTicket } = require('./utils'); // ES6 importing doesn't work for some reason

module.exports = function(token) {
  return {
    threads() {
      return fetch(`${root()}/messages/threads/`, { headers: headers(token) }).then(resp => resp.json());
    },

    createThread(friendID) {
      return fetch(`${root()}/messages/threads`, {
        method: 'POST',
        headers: headers(token),
        body: JSON.stringify({
          user_ids: [friendID]
        })
      });
    },

    list(threadID) {
      return fetch(`${root()}/messages/threads/${threadID}`, { headers: headers(token) });
    },

    send(threadID, text) {
      return fetch(`${root()}/messages/threads/${threadID}`, {
        headers: headers(token),
        body: JSON.stringify({
          body: text
        }),
        method: 'POST'
      });
    },


    socket(threadID, onMessage, onError) {
      var _socket = null;
      var sendInterval, reopenInterval;

      withTicket(token, (ticket) => {
        // once we get the ticket througha normal https request, open up the socket
        // using the ticket for authentication
        if(!_socket) {
          _socket = new WebSocket(`${root(protocols.ws)}/messages/threads/${threadID}/subscribe?key=${ticket.id}`);
        } else {
          return;
        }

        let start = function() {
          _socket.onmessage = onMessage;
          _socket.onerror = onError;

          _socket.onopen = () => {
            clearInterval(reopenInterval);

            let lastNow = moment(Date.now()).unix();

            sendInterval = setInterval(() => {
              if(!_socket || _socket.readyState === 2 || _socket.readyState === 3) {
                clearInterval(sendInterval);
                return;
              }

              _socket.send(lastNow.toString());
              lastNow = moment(Date.now()).unix();
            }, 1000);
          };

          reopenInterval = setInterval(() => {
            if(!_socket || _socket.readyState === 0 || _socket.readyState === 1) {
              clearInterval(reopenInterval);
              return;
            }

            _socket = null;
            start();
          }, 5000);
        };

        start();
      }, onError);
    },

    unreadSocket(onOpen, onMessage, onError) {
      // get the ticket first
      withTicket(token, (ticket) => {
        // once we get the ticket througha normal https request, open up the socket
        // using the ticket for authentication
        var _socket = new WebSocket(`${root(protocols.ws)}/messages/unread?key=${ticket.id}`);

        _socket.onmessage = onMessage;
        _socket.onerror = onError;

        _socket.onopen = () => {
          onOpen(_socket);
          _socket.send("whatever");
          setInterval(() => {
            _socket.send("whatever");
          }, 5000);
        };
      }, onError);
    }
  };
};
