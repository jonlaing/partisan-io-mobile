/*global fetch, jest, describe, expect, pit */
'use strict';

jest.dontMock('../../Config');
jest.dontMock('../utils');

jest.unmock('../notifications');
var notifications = require('../notifications');

jest.unmock('./helpers');
var helpers = require('./helpers');

describe('notifications', () => {
  describe('list', () => {
    pit('successfully lists notifications', () => {
      let ns = [
        {
          notification: { user_id: 1, record_type: "post", record_id: 1, seen: false },
          user: { username: 'user 1' },
          record: { id: 1 }
        },
        {
          notification: { user_id: 2, record_type: "post", record_id: 2, seen: false },
          user: { username: 'user 2' },
          record: { id: 2 }
        },
        {
          notification: { user_id: 3, record_type: "post", record_id: 3, seen: false },
          user: { username: 'user 3' },
          record: { id: 3 }
        }
      ];

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(ns), { status: 200 } ));

      return notifications("token").list()
      .then(data => {
        data.map((notif, i) => {
          expect(notif.notification.user_id).toEqual(ns[i].notification.user_id);
          expect(notif.notification.record_id).toEqual(ns[i].notification.record_id);
          expect(notif.notification.record_type).toEqual(ns[i].notification.record_type);
          expect(notif.notification.seen).toEqual(ns[i].notification.seen);
          expect(notif.user.username).toEqual(ns[i].user.username);
          expect(notif.record.id).toEqual(ns[i].record.id);
        });
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });
  });
});
