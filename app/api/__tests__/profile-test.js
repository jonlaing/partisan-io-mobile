/*global fetch, jest, describe, expect, pit */
'use strict';

jest.dontMock('../../Config');
jest.dontMock('../utils');

jest.unmock('../profile');
var profile = require('../profile');

jest.unmock('./helpers');
var helpers = require('./helpers');

jest.unmock('../utils');
var utils = require('../utils');

describe('profile', () => {
  describe('get', () => {
    pit('successfully gets the profile', () => {
      let p = {
        user: { username: 'user1' },
        profile: { summary: 'this is my summary' },
        match: 95.1
      };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(p), { status: 200 } ));

      return profile("token").get(1)
      .then(data => {
        expect(data.user.username).toEqual(p.user.username);
        expect(data.profile.summary).toEqual(p.profile.summary);
        expect(data.match).toEqual(p.match);
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });
  });

  describe('updateBirthdate', () => {
    pit('successfully updates birthdate', () => {
      let user = { username: 'user1' };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(user), { status: 200 } ));

      return profile("token").updateBirthdate(new Date())
      .then(data => {
        expect(data.username).toEqual(user.username);
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });
  });

  describe('updateGender', () => {
    pit('successfully updates gender', () => {
      let user = { username: 'user1' };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(user), { status: 200 } ));

      return profile("token").updateGender("unicorn")
      .then(data => {
        expect(data.username).toEqual(user.username);
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });
  });

  describe('updateSummary', () => {
    pit('successfully updates summary', () => {
      let p = { summary: 'blah blah' };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(p), { status: 200 } ));

      return profile("token").updateSummary('blah blah')
      .then(data => {
        expect(data.summary).toEqual(p.summary);
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });
  });

  describe('updateLookingFor', () => {
    pit('successfully updates looking-for', () => {
      let p = { summary: 'blah blah' };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(p), { status: 200 } ));

      return profile("token").updateLookingFor(3)
      .then(data => {
        expect(data.summary).toEqual(p.summary);
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });
  });

  describe('avatarUpload', () => {
    pit('successfully uploads avatar', () => {
      let user = { username: 'user1' };

      utils.newXHRRequest = helpers.createSuccessXHRmock(JSON.stringify(user), 200);

      return profile("token").avatarUpload('image.jpg')
      .then(resp => resp.json())
      .then(data => {
        expect(data.username).toEqual(user.username);
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
      });
    });
  });
});

