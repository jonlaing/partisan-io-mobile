'use strict';

import moment from 'moment';

module.exports = {
  count(n) {
    if(n > 999999) {
      return `${Math.round(n / 100000) / 10}m`;
    }

    if(n > 9999) {
      return `${Math.round(n / 1000)}k`;
    }

    if(n > 999) {
      return `${Math.round(n / 100) / 10}k`;
    }

    return n;
  },

  age(birthdate, showIfNone) {
    // You're probably not older than 200 years old, which means
    // your bithdate hasn't been entered
    if(moment(birthdate).isBefore('1800-12-31')) {
      if(showIfNone === false) {
        return "";
      }

      return "No Age";
    }

    // return moment().diff(birthdate, 'years') + " years old";
    return moment().diff(birthdate, 'years') + "yrs";
  },

  cityState(location) {
    return location.replace(/\s\d+.*$/, '');
  },

  gender(g) {
    return g.length < 1 ? "No Gender" : g;
  },

  match(m) {
    return Math.round(m * 100) + '%';
  }
};
