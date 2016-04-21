/*global fetch, jest, describe, expect, pit */
'use strict';

jest.dontMock('../../Config');
jest.dontMock('../utils');

jest.unmock('../comments');
var comments = require('../comments');

jest.unmock('./helpers');
var helpers = require('./helpers');

jest.unmock('../utils');
var utils = require('../utils');

describe('comments', () => {
  describe('list', () => {
    pit('successfully gets list', () => {
      // NOTE: this is not an exhaustive list of what is returned by the server
      let cs = [
        {
          comment: { body: "comment 1" },
          user: { username: 'user 1' },
          likeCount: 3,
          liked: true
        },
        {
          comment: { body: "comment 2" },
          user: { username: 'user 2' },
          likeCount: 4,
          liked: false
        },
        {
          comment: { body: "comment 3" },
          user: { username: 'user 3' },
          likeCount: 2,
          liked: true
        }
      ];

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify({ comments: cs }), { status: 200 } ));

      return comments("token").list()
      .then(data => {
        data.comments.map((c, i) => {
          expect(c.comment.body).toEqual(cs[i].comment.body);
          expect(c.user.username).toEqual(cs[i].user.username);
          expect(c.likeCount).toEqual(cs[i].likeCount);
          expect(c.liked).toEqual(cs[i].liked);
          fetch.mockClear();
        });
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });
  });

  describe('like', () => {
    pit('successfully likes comment', () => {
      let like = {
        like_count: 3,
        liked: true
      };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify(like), { status: 200 } ));

      return comments("token").like(4)
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
    pit('successfully creates comment', () => {
      let body = "This is the body";
      let attachments = ["image.jpg"];

      let comment = {
        comment: { body: body },
        user: { username: 'user 1' },
        likeCount: 3,
        liked: true
      };

      utils.newXHRRequest = helpers.createSuccessXHRmock(JSON.stringify(comment), 201);

      // currently the response isn't used, but should add some tests soon anyway
      return comments("token").create(body, attachments)
      .then(resp => resp.json())
      .then(resp => {
        expect(resp.comment.body).toEqual(body);
        expect(resp.user.username).toEqual(comment.user.username);
        expect(resp.likeCount).toEqual(comment.likeCount);
        expect(resp.liked).toEqual(comment.liked);
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
      });
    });
  });
});
