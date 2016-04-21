/*global fetch, jest, describe, expect, pit */
'use strict';

jest.dontMock('../../Config');
jest.dontMock('../utils');

jest.unmock('../questions');
var questions = require('../questions');

jest.unmock('./helpers');
var helpers = require('./helpers');

describe('questions', () => {
  describe('get', () => {
    pit('successfully gets questions', () => {
      let qs = [
        { map: [0, 1, 2], prompt: "question 1" },
        { map: [3, 4, 5], prompt: "question 2" }
      ];

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify({questions: qs}), { status: 200 } ));

      return questions("token").get()
      .then(data => {
        data.questions.map((q, i) => {
          expect(q.map).toEqual(qs[i].map);
          expect(q.prompt).toEqual(qs[i].prompt);
        });
      })
      .catch(err => {
        console.log(err);
        expect(err).toBeUndefined();
        fetch.mockClear();
      });
    });
  });

  describe('answer', () => {
    pit('answers the question', () => {
      let question = { map: [1, 2, 3], prompt: "question" };

      fetch = jest.fn(() => helpers.successPromise( JSON.stringify({message: "updated"}), { status: 200 } ));

      return questions("token").answer(question, true)
      .then(data => {
        expect(data.message).toEqual("updated");
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
