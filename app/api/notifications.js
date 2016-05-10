/*global fetch, WebSocket */
'use strict';

// import {protocols, root, headers, processJSON, withTicket} from './utils';
var {protocols, root, headers, processJSON, withTicket} = require('./utils'); // ES6 importing doesn't work for some reason

module.exports = function(token) {
  return ({
    list() {
      return fetch(`${root()}/notifications/`, { headers: headers(token) }).then(resp => processJSON(resp));
    },

    // TODO: figure out how to test this shit
    countSocket(onOpen, onMessage, onError) {
      // get the ticket first
      withTicket(token, (ticket) => {
        // once we get the ticket througha normal https request, open up the socket
        // using the ticket for authentication
        var _socket = new WebSocket(`${root(protocols.ws)}/notifications/count?key=${ticket.key}`);

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
  });
};
