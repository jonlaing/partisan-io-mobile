'use strict';

import React, {
  Text
} from 'react-native';

import moment from 'moment';

import Colors from '../Colors';

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
    if(m < 0) {
      return "No Match";
    }

    return Math.round(m * 100) + '%';
  },

  summary(s) {
    return s.length < 1 ? "Tell us about yourself" : s;
  },

  post(p, onURL = () => {}, onHashtag = () => {}, onUsertag = () => {}) {
    let result = [p];
    result = _hashtag(result, onHashtag);
    result = _usertag(result, onUsertag);
    result = _url(result, onURL);
    return result;
  }

};

function _hashtag(text, onPress = () => {}) {
  let tagged = [];
  let regex = /#[a-zA-Z0-9]+/g;

  text.forEach((p) => {
    if(typeof p !== 'string') {
      return tagged.push(p);
    }

    let tags = p.match(regex);
    let nonHash = p.split(regex);

    if(tags == null || nonHash == null || tags.length < 1 || nonHash.length < 1) {
      return tagged.push(p);
    }

    for(let i = 0; i < nonHash.length; i++) {
      if(nonHash[i] !== "") {
        tagged.push(nonHash[i]);
      }

      if(tags[i] != null) {
        tagged.push(
          <Text key={tags[i]} style={{color: Colors.action}} onPress={() => onPress(tags[i])}>
            {tags[i]}
          </Text>
        );
      }
    }

  });

  return tagged;
}


function _usertag(text, onPress = () => {}) {
  let tagged = [];
  let regex = /@[a-zA-Z0-9_.]+/g;

  text.forEach((p) => {
    if(typeof p !== 'string') {
      return tagged.push(p);
    }

    let tags = p.match(regex);
    let nonTag = p.split(regex);

    if(tags == null || nonTag == null || tags.length < 1 || nonTag.length < 1) {
      return tagged.push(p);
    }

    for(let i = 0; i < nonTag.length; i++) {
      if(nonTag[i] !== "") {
        tagged.push(nonTag[i]);
      }

      if(tags[i] != null) {
        if(tags[i].match(/\.[a-zA-Z]+/) != null) {
          tagged.push(tags[i]);
        } else {
          tagged.push(
            <Text key={tags[i]} style={{color: Colors.action}} onPress={() => onPress(tags[i])}>
              {tags[i]}
            </Text>
          );
        }
      }
    }
  });

  return tagged;
}

function _url(text, onPress = () => {}) {
  let urled = [];
  let regex = /(?:https?\:\/{2})?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b(?:[-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;

  text.forEach((p) => {
    if(typeof p !== 'string') {
      return urled.push(p);
    }

    let urls = p.match(regex);
    let nonUrls = p.split(regex);

    if(urls == null || nonUrls == null || urls.length < 1 || nonUrls.length < 1) {
      return urled.push(p);
    }

    for(let i = 0; i < nonUrls.length; i++) {
      if(nonUrls[i] !== "") {
        urled.push(nonUrls[i]);
      }

      if(urls[i] != null) {
        urled.push(
          <Text key={urls[i]} style={{color: Colors.action}} onPress={() => onPress(urls[i])}>
            {urls[i]}
          </Text>
        );
      }
    }
  });

  return urled;
}
