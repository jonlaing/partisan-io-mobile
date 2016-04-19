/*global fetch, Response, jest, describe, expect, pit */
'use strict';

jest.dontMock('../Config');

require('whatwg-fetch');

jest.unmock('../Api');

function successPromise(body, opts = {}) {
  return new Promise(resolve => resolve( new Response(body, opts) ));
}

function errorPromise() {
  return new Promise((_, reject) => reject());
}

describe('Api', () => {
  var Api = require('../Api');

  describe('auth', () => {
    describe('login', () => {
      pit('successfully returns JSON', () => {
        fetch = jest.fn(() => successPromise(
            JSON.stringify({
              token: 'blah',
              user: { username: 'user1' },
              avatar_thumbnail_url: 'image.jpg'
            }),
            { status: 200 }
          )
        );

        return Api.auth().login('username', 'passwor')
        .then((resp) => {
          expect(resp.token).toEqual('blah');
          expect(resp.user.username).toEqual('user1');
          expect(resp.avatar_thumbnail_url).toEqual('image.jpg');
          fetch.mockClear();
        })
        .catch(err => {
          console.log(err);
          expect(err).toBeUndefined();
          fetch.mockClear();
        });
      });

      // though fetch will resolve upon a 404, login should throw an error and reject
      pit('appropriately throws error when not okay', () => {
        let errMsg = 'User Not Found';
        fetch = jest.fn(() => successPromise(
            JSON.stringify({
              token: 'blah',
              user: { username: 'user1' },
              avatar_thumbnail_url: 'image.jpg'
            }),
            {
              status: 404, // User not found
              statusText: errMsg
            }
          )
        );

        return Api.auth().login('username', 'passwor')
        .then((resp) => {
          // We shouldn't even really get here, so there's a problem if we do
          expect(resp.token).toBeUndefined();
          expect(resp.user).toBeUndefined();
          expect(resp.avatar_thumbnail_url).toBeUndefined();
          expect(resp.ok).toBeFalse();
          fetch.mockClear();
        })
        .catch(err => {
          expect(err).toBeDefined();
          expect(err.message).toEqual(errMsg);
          fetch.mockClear();
        });
      });
    });

    describe('signUp', () => {
      pit('successfully returns JSON', () => {
        let user = {
          email: 'me@email.com',
          username: 'user1',
          postalCode: '11211',
          password: 'password',
          passwordConfirm: 'password'
        };

        fetch = jest.fn(() => successPromise(
            JSON.stringify({
              token: 'blah',
              user: { username: 'user1' },
              avatar_thumbnail_url: 'image.jpg'
            }),
            { status: 201 }
          )
        );

        return Api.auth().signUp(user)
        .then((resp) => {
          expect(resp.token).toEqual('blah');
          expect(resp.user.username).toEqual('user1');
          expect(resp.avatar_thumbnail_url).toEqual('image.jpg');
          fetch.mockClear();
        })
        .catch(err => {
          console.log(err);
          expect(err).toBeUndefined();
          fetch.mockClear();
        });
      });

      // though fetch will resolve upon a 404, signUp should throw an error and reject
      pit('appropriately throws error when not okay', () => {
        let user = {
          email: 'me@email.com',
          username: 'user1',
          postalCode: '11211',
          password: 'password',
          passwordConfirm: 'password'
        };

        let errMsg = 'Something went wrong';

        fetch = jest.fn(() => successPromise(
            JSON.stringify({
              token: 'blah',
              user: { username: 'user1' },
              avatar_thumbnail_url: 'image.jpg'
            }),
            {
              status: 406, // Validation error
              statusText: errMsg
            }
          )
        );

        return Api.auth().signUp(user)
        .then((resp) => {
          // We shouldn't even really get here, so there's a problem if we do
          expect(resp.token).toBeUndefined();
          expect(resp.user).toBeUndefined();
          expect(resp.avatar_thumbnail_url).toBeUndefined();
          expect(resp.ok).toBeFalse();
          fetch.mockClear();
        })
        .catch(err => {
          expect(err).toBeDefined();
          expect(err.message).toEqual(errMsg);
          fetch.mockClear();
        });
      });
    });
  });

  describe('feed', () => {
    describe('get', () => {
      pit('successfully gets feed', () => {
        fetch = jest.fn(() => successPromise(
           JSON.stringify({
             feed_items: [
               { body: "item 1" },
               { body: "item 2" },
               { body: "item 3" }
             ]
           }),
           { status: 200 }
        ));

        return Api.feed("token").get(0)
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

        fetch = jest.fn(() => successPromise( JSON.stringify(post), { status: 200 } ));

        return Api.posts("token").get(4)
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

        fetch = jest.fn(() => successPromise( JSON.stringify(like), { status: 200 } ));

        return Api.posts("token").like(4)
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
  });
});