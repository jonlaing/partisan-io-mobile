/*global fetch, XMLHttpRequest */
import Config from '../Config';

const _APP_TOKEN = '';

if (Config.env.prod()) {
  _APP_TOKEN = 'ddae5d96-6005-4983-b305-a688127c8208';
} else if (Config.env.staging()) {
  _APP_TOKEN = 'ce0ebc53-9fb6-4c72-b00e-a8280676126e';
} else {
  _APP_TOKEN = 'c47675bb-3a76-49ae-977b-694ab87add88';
}

const _HTTP = 0;
const _SOCKET = 1;

const _millisecond = 1;
const _second = 1000 * _millisecond;
const _minute = 60 * _second;

export let protocols = { http: _HTTP, ws: _SOCKET };

export let ok = (status) => status >= 200 && status < 300;

export function headers(token, json = true) {
  if(token != null) {
    return {
      'Accept': 'application/json',
      'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-App-Token': _APP_TOKEN,
      'X-Auth-Token': token
    };
  } else {
    return {
      'Accept': 'application/json',
      'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-App-Token': _APP_TOKEN
    };
  }
}

export function root(prot = _HTTP) {
  if(Config.env.dev()) {
    return `${protocol(prot)}localhost:4000/api/v2`;
  } else if (Config.env.prod()) {
    return `${protocol(prot)}www.partisan.io/api/v2`;
  } else if (Config.env.staging()) {
    return `${protocol(prot)}enigmatic-cliffs-84517.herokuapp.com//api/v2`;
  } else {
    throw "UNKNOWN ENVIRONMENT: CANNOT PERFORM NETWORK REQUESTS";
  }
}

export function protocol(prot) {
  switch(prot) {
    case _HTTP:
      if(Config.env.prod()) {
        return "https://";
      } else {
        return "http://";
      }
      break;
    case _SOCKET:
      if(Config.env.prod()) {
        return "wss://";
      } else {
        return "ws://";
      }
      break;
    default:
      return "https://";
  }
}

export function processJSON(resp) {
  // If the status is bad, throw a well-formatted error
  if(!ok(resp.status)) {
    var error = new Error(resp.statusText);
    error.response = resp;
    throw error;
  }

  // otherwise return the JSON
  return resp.json();
}

export function xhrUpload(formData, url, token, method = 'POST') {
  var xhr = _utils.newXHRRequest();

  return new Promise(function(resolve, reject) {
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) {
        return;
      }

      if (ok(xhr.status)) {
        if(xhr.response === undefined) {
          resolve(xhr.responseText);
        } else {
          resolve(xhr.response);
        }
      } else {
        reject(xhr.statusText);
      }
    };

    xhr.timeout = _minute;
    xhr.ontimeout = reject;

    xhr.open(method, url);
    xhr.setRequestHeader( 'X-Auth-Token', token);
    xhr.setRequestHeader( 'X-App-Token', _APP_TOKEN);
    xhr.send(formData);
  });
}

// this is for testing purposes because we can mock this in jest
export function newXHRRequest() {
  return new XMLHttpRequest();
}

export function urlParams(params) {
  return Object.keys(params)
  .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(params[k])}`)
  .join('&');
}

export function withTicket(token, success, err) {
    fetch(`${root()}/socket_ticket`, { headers: headers(token) })
    .then(res => res.json())
    .then(data => success(data.ticket))
    .catch(e => err(e));
}

let _utils = {
  protocols: protocols,
  ok: ok,
  headers: headers,
  root: root,
  processJSON: processJSON,
  xhrUpload: xhrUpload,
  newXHRRequest: newXHRRequest,
  urlParams: urlParams,
  withTicket: withTicket
};

// ES6 Doesn't work for some reason
export default _utils;
// ES6 Doesn't work for some reason

module.exports = _utils;
