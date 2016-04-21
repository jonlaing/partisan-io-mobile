/*global fetch, jest, describe, expect, pit */
'use strict';

jest.dontMock('../../Config');
jest.dontMock('../utils');

jest.unmock('../matches');
var matches = require('../matches');

jest.unmock('./helpers');
var helpers = require('./helpers');

describe('matches', () => {
  describe('get', () => {
    pit('successfully gets matches', () => {
      let ms = [
        {
          user: { username: 'user1' },
          match: 100.0
        },
        {
          user: { username: 'user2' },
          match: 98.6
        },
        {
          user: { username: 'user3' },
          match: 93.2
        }
      ];

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(ms), { status: 200 } ));

      return matches("token").get()
      .then(data => {
        data.map((match, i) => {
          expect(match.user.username).toEqual(ms[i].user.username);
          expect(match.match).toEqual(ms[i].match);
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
