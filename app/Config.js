'use strict';

const _DEV = 0;
const _STAG = 1;
const _PROD = 2;

module.exports = {
  env: _environment(_DEV)
};

function _environment(env) {
  return {
    dev: function() { return env === _DEV; },
    staging: function() { return env === _STAG; },
    prod: function() { return env === _PROD; }
  };
}
