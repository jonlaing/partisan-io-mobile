'use strict';

const _DEV = 0;
const _PROD = 1;

module.exports = {
  env: _environment(_PROD)
};

function _environment(env) {
  return {
    dev: function() { return env === _DEV; },
    prod: function() { return env === _PROD; }
  };
}
