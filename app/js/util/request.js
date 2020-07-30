/**
 * @callback onSuccessCallback
 * @param {Object|Array} response
 * @returns {void}
 */

/**
 * @callback onErrorCallback
 * @param {Error} error
 * @returns {void}
 */


import { memoize } from "./fp";
import { BASE_API_HOST } from "./constant";
import { ACCESS_TOKEN } from "./access-token";


/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response) {
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.indexOf("application/json") !== -1) {
    if (response.status === 204 || response.status === 205) {
      return null;
    }
    return response.json();
  }
  return response.text();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request,
 * or prepend it with `BASE_API_HOST` if starts with a slash `/`
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export function request(url, options) {
  return fetch(
    url.startsWith("/") ? `${BASE_API_HOST}${url}` : url,
    options)
    .then(checkStatus)
    .then(parseJSON);
}

const defaultHeaders = {
  "Content-Type": "application/json; charset=utf-8",
};
export function option({
  method = "GET",
  body,
  // credentials = "include",
  headers = {},
  useToken = false,
}) {
  const baseHeaders = {};
  if (useToken) baseHeaders.Authorization = `Bearer ${ACCESS_TOKEN}`;

  const opt = {
    method,
    headers: Object.assign(baseHeaders, defaultHeaders, headers),
    // credentials,
  };

  if (body) {
    const bodyType = toString(body);
    switch (bodyType) {
      case "[object Object]":
      case "[object Array]":
        opt.body = JSON.stringify(body);
        break;

      default:
        opt.body = body;
        break;
    }
  }

  return opt;
}


export async function basicGet({ url, headers, useToken }) {
  return await request(url, option({
    method: "GET",
    headers,
    useToken,
  }));
}

export const memoGet = memoize({
  fn: basicGet,
  n: 2,
});


/**
 * HttpGet request with some default options
 * @param {Object} param
 * @param {string} param.url - The URL we want to request,
 * or prepend it with `BASE_API_HOST` if starts with a slash `/`
 * @param {Object} param.params - The queries params
 * @param {Object} param.headers - The request headers
 * @param {boolean} param.useToken - If true, add the Bearer token to request header
 * @param {boolean} param.useCache - If true, cache the response by header + url
 * @param {onSuccessCallback} param.onSuccess - The callback that handle the response
 * @param {onErrorCallback} param.onError - The callback that handle the error
 */
export async function get({
  url, params,
  headers, useToken,
  useCache = false, // cache response by url + header
  onSuccess, onError,
}) {
  try {
    let usableUrl = url;
    if (params && toString(params) === "[object Object]")
      usableUrl = `${url}?${build(params)}`;

    let res;
    if (useCache)
      res = await memoGet({ url: usableUrl, headers, useToken });
    else
      res = await basicGet({ url: usableUrl, headers, useToken });

    onSuccess(res);
  }
  catch (err) {
    if (onError) onError(err);
  }
}


export async function basicPost({
  url,
  body,
  headers,
  useToken,
}) {
  return await request(url, option({
    method: "POST",
    body,
    headers,
    useToken,
  }));
}

/**
 * HttpPost request with some default options
 * @param {Object} param
 * @param {string} param.url - The URL we want to request,
 * or prepend it with `BASE_API_HOST` if starts with a slash `/`
 * @param {Object} param.body - Payload of the request
 * @param {Object} param.headers - The request headers
 * @param {boolean} param.useToken - If true, add the Bearer token to request header
 * @param {onSuccessCallback} param.onSuccess - The callback that handle the response
 * @param {onErrorCallback} param.onError - The callback that handle the error
 */
export async function post({
  url,
  body,
  headers, useToken,
  onSuccess, onError,
}) {
  try {
    const res = await basicPost({ url, body, headers, useToken });
    onSuccess(res);
  }
  catch (err) {
    if (onError) onError(err);
  }
}


/* eslint-disable */
// https://github.com/MithrilJS/mithril.js/blob/next/querystring/build.js
export function build(object) {
  if (toString(object) !== "[object Object]") return ""

  var args = []
  for (var key in object) {
    destructure(key, object[key])
  }

  return args.join("&")

  function destructure(key, value) {
    if (Array.isArray(value)) {
      for (var i = 0; i < value.length; i++) {
        destructure(key + "[" + i + "]", value[i])
      }
    } else if (toString(value) === "[object Object]") {
      for (var i in value) {
        destructure(key + "[" + i + "]", value[i])
      }
    } else args.push(encodeURIComponent(key) + (value != null && value !== "" ? "=" + encodeURIComponent(value) : ""))
  }
}

// https://github.com/MithrilJS/mithril.js/blob/next/querystring/parse.js
export function parse(string) {
  if (string === "" || string == null) return {}
  if (string.charAt(0) === "?") string = string.slice(1)

  var entries = string.split("&"), counters = {}, data = {}
  for (var i = 0; i < entries.length; i++) {
    var entry = entries[i].split("=")
    var key = decodeURIComponent(entry[0])
    var value = entry.length === 2 ? decodeURIComponent(entry[1]) : ""

    if (value === "true") value = true
    else if (value === "false") value = false

    var levels = key.split(/\]\[?|\[/)
    var cursor = data
    if (key.indexOf("[") > -1) levels.pop()
    for (var j = 0; j < levels.length; j++) {
      var level = levels[j], nextLevel = levels[j + 1]
      var isNumber = nextLevel == "" || !isNaN(parseInt(nextLevel, 10))
      if (level === "") {
        var key = levels.slice(0, j).join()
        if (counters[key] == null) {
          counters[key] = Array.isArray(cursor) ? cursor.length : 0
        }
        level = counters[key]++
      }
      // Disallow direct prototype pollution
      else if (level === "__proto__") break
      if (j === levels.length - 1) cursor[level] = value
      else {
        // Read own properties exclusively to disallow indirect
        // prototype pollution
        var desc = Object.getOwnPropertyDescriptor(cursor, level)
        if (desc != null) desc = desc.value
        if (desc == null) cursor[level] = desc = isNumber ? [] : {}
        cursor = desc
      }
    }
  }
  return data
}
/* eslint-enable */


// ***************************************
// #region private

function toString(obj) {
  return Object.prototype.toString.call(obj);
}

// #endregion
