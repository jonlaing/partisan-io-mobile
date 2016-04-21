/*global fetch, jest, describe, expect, pit */
'use strict';

jest.dontMock('../../Config');
jest.dontMock('../utils');

jest.unmock('../posts');
var posts = require('../posts');

jest.unmock('./helpers');
var helpers = require('./helpers');

jest.unmock('../utils');
var utils = require('../utils');

describe('posts', () => {
  describe('get', () => {
    pit('successfully gets post', () => {
      let post = {
        post: { body: "body" },
        user: { username: "user1" },
        imageAttachment: { url: "whatever" },
        liked: true,
        like_count: 3
      };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(post), { status: 200 } ));

      return posts("token").get(4)
      .then(data => {
        expect(data.post.body).toEqual(post.post.body);
        expect(data.user.username).toEqual(post.user.username);
        expect(data.imageAttachment.url).toEqual(post.imageAttachment.url);
        expect(data.liked).toEqual(true);
        expect(data.like_count).toEqual(post.like_count);
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });
  });

  describe('like', () => {
    pit('successfully likes post', () => {
      let like = {
        like_count: 3,
        liked: true
      };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(like), { status: 200 } ));

      return posts("token").like(4)
      .then(data => {
        expect(data.like_count).toEqual(3);
        expect(data.liked).toEqual(true);
        fetch.mockClear();
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });

    });
  });

  describe('create', () => {
    pit('successfully creates post', () => {
      let body = "This is the body";
      let attachments = ["image.jpg"];

      let feedItem = {
        user: { username: 'user 1' },
        record_type: "post",
        record_id: 1,
        record: { post: { body: "body" } }
      };

      utils.newXHRRequest = helpers.createSuccessXHRmock(JSON.stringify({"feed_item": feedItem }), 201);

      // currently the response isn't used, but should add some tests soon anyway
      return posts("token").create(body, attachments)
      .then(resp => resp.json())
      .then(resp => {
        expect(resp.feed_item.record_type).toEqual(feedItem.record_type);
        expect(resp.feed_item.record_id).toEqual(feedItem.record_id);
        expect(resp.feed_item.record.post.body).toEqual(feedItem.record.post.body);
        expect(resp.feed_item.user.username).toEqual(feedItem.user.username);
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
      });
    });
  });
});
