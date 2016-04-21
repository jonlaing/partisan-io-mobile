/*global fetch, jest, describe, expect, pit */
'use strict';

jest.dontMock('../../Config');
jest.dontMock('../utils');

jest.unmock('../feed');
var feed = require('../feed');

jest.unmock('./helpers');
var helpers = require('./helpers');

describe('feed', () => {
  describe('get', () => {
    pit('successfully gets feed', () => {
      fetch = jest.fn(() => helpers.successPromise(
         JSON.stringify({
           feed_items: [
             { body: "item 1" },
             { body: "item 2" },
             { body: "item 3" }
           ]
         }),
         { status: 200 }
      ));

      return feed("token").get(0)
      .then(items => {
        expect(items.length).toEqual(3);
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
