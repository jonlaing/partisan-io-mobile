/*global fetch, jest, describe, expect, pit */
'use strict';

jest.dontMock('../../Config');
jest.dontMock('../utils');

jest.unmock('../friendships');
var friendships = require('../friendships');

jest.unmock('./helpers');
var helpers = require('./helpers');

describe('friendships', () => {
  describe('list', () => {
    pit('it successfully lists friends', () => {
      let fships = [
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

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify({friendships: fships }), { status: 200 } ));

      return friendships("token").list()
      .then(data => {
        data.map((friend, i) => {
          expect(friend.user.username).toEqual(fships[i].user.username);
          expect(friend.match).toEqual(fships[i].match);
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

  describe('count', () => {
    pit('it successfully counts friends', () => {
      let fships = [
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

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify({friendships: fships }), { status: 200 } ));

      return friendships("token").count()
      .then(data => {
        expect(data).toEqual(fships.length);
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });

    pit('it returns 0 if friends are undefined', () => {
      fetch = jest.fn(() => helpers.successPromise( JSON.stringify({}), { status: 200 } ));

      return friendships("token").count()
      .then(data => {
        expect(data).toEqual(0);
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });
  });

  describe('get', () => {
    pit('successfully returns when users are not friends', () => {
      fetch = jest.fn(() => helpers.successPromise( JSON.stringify({}), { status: 200 } ));

      return friendships("token").get(1)
      .then(() => {
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });

    pit('successfully gets unconfirmed friendship', () => {
      let friendship = { confirmed: false };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(friendship), { status: 200 } ));

      return friendships("token").get(1)
      .then(data => {
        expect(data.confirmed).toEqual(false);
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });

    pit('successfully gets confirmed friendship', () => {
      let friendship = { confirmed: true };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(friendship), { status: 200 } ));

      return friendships("token").get(1)
      .then(data => {
        expect(data.confirmed).toEqual(true);
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });
  });

  describe('request', () => {
    pit('successfully requests friendship', () => {
      let friendship = { confirmed: false };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(friendship), { status: 200 } ));

      return friendships("token").request(1)
      .then(data => {
        expect(data.confirmed).toEqual(false);
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });
  });

  describe('confirm', () => {
    pit('successfully confirms friendship', () => {
      let friendship = { confirmed: true };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(friendship), { status: 200 } ));

      return friendships("token").confirm(1)
      .then(data => {
        expect(data.confirmed).toEqual(true);
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
