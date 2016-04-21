/*global fetch, XMLHttpRequest */
import Config from '../Config';

const _HTTP = 0;
const _SOCKET = 1;

export let protocols = { http: _HTTP, ws: _SOCKET };

export let ok = (status) => status >= 200 && status < 300;

export function headers(token, json = true) {
  if(token !== undefined) {
    return {
      'Accept': 'application/json',
      'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8',
      'X-Auth-Token': token
    };
  } else {
    return {
      'Accept': 'application/json',
      'Content-Type': json ? 'application/json' : 'application/x-www-form-urlencoded; charset=UTF-8'
    };
  }
}

export function root(prot = _HTTP) {
  if(Config.env.dev()) {
    return `${protocol(prot)}localhost:4000/api/v1`;
  } else if (Config.env.prod()) {
    return `${protocol(prot)}www.partisan.io/api/v1`;
  } else {
    throw "UNKNOWN ENVIRONMENT: CANNOT PERFORM NETWORK REQUESTS";
  }
}

export function protocol(prot) {
  switch(prot) {
    case _HTTP:
      if(Config.env.dev()) {
        return "http://";
      } else {
        return "https://";
      }
      break;
    case _SOCKET:
      if(Config.env.dev()) {
        return "ws://";
      } else {
        return "wss://";
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

    xhr.open(method, url);
    xhr.setRequestHeader( 'X-Auth-Token', token);
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
    .then(data => success(data))
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
