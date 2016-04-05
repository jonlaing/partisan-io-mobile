'use strict';

import moment from 'moment';

module.exports = {
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
