/*global FormData, Response, jest, describe, expect, pit */
'use strict';

jest.dontMock('../../Config');

jest.unmock('../utils');
var utils = require('../utils');

jest.unmock('./helpers');
var helpers = require('./helpers');

describe('utils.xhrUpload', () => {
  pit('successfully uploads', () => {
    utils.newXHRRequest = helpers.createSuccessXHRmock("successful");

    let request = new FormData();
    request.append('body', 'whatever');

    return utils.xhrUpload(request, '/wherever', 'token')
    .then(resp => resp.text())
    .then(resp => {
      expect(resp).toEqual("successful");
    })
    .catch(err => {
      console.log(err);
      expect(err).toBeUndefined();
    });
  });

  pit('errors', () => {
    utils.newXHRRequest = helpers.createErrorXHRmock("some error");

    let request = new FormData();
    request.append('body', 'whatever');

    return utils.xhrUpload(request, '/wherever', 'token')
    .then(resp => resp.text())
    .then(resp => {
      expect(resp).toBeUndefined();
    })
    .catch(err => {
      expect(err).toEqual("some error");
    });
  });
});

