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
  }
};
