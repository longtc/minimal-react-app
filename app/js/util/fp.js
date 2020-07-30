// functional programming methods

export const DEBOUNCE_INPUT_WAIT = 200; // in miliseconds

/* eslint-disable */
// http://modernjavascript.blogspot.com/2013/08/building-better-debounce.html
export function debounce(func, wait, immediate) {
  // we need to save these in the closure
  var timeout, args, context, timestamp, result;
  return function () {
    context = this;
    args = arguments;
    timestamp = new Date();
    // this is where the magic happens
    var later = function () {
      // how long ago was the last call
      var last = (new Date()) - timestamp;
      // if the latest call was less that the wait period ago
      // then we reset the timeout to wait for the difference
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      }
      // or if not we can null out the timer and run the latest
      else {
        timeout = null;
        if (!immediate) result = func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    // we only need to set the timer now if one isn't already running
    if (!timeout) {
      timeout = setTimeout(later, wait);
    }
    if (callNow) result = func.apply(context, args);
    return result;
  };
};
/* eslint-enalbe */


// https://github.com/getify/FPO/blob/master/src/fpo.src.js
// adapted from: https://github.com/caiogondim/fast-memoize.js
export function memoize({ fn, n = fn.length }) {
  var cache = {};

  return Number( n ) > 1 ? memoizedMultipleArgs : memoizedSingleArg;


  // *********************

  function memoizedSingleArg(arg,...otherArgs) {
    var hash =
      // arg is a primitive?
      (
        arg == null ||
        !(typeof arg == "object" || typeof arg == "function")
      ) ?
      arg :
      JSON.stringify( arg );

    return (hash in cache) ?
      cache[hash] :
      (cache[hash] = fn( arg, ...otherArgs ));
  }

  function memoizedMultipleArgs(...args) {
    var arg = args[0];
    var hash =
      // only one argument?
      args.length == 1 &&
      // arg is a primitive?
      (
        arg == null ||
        !(typeof arg == "object" || typeof arg == "function")
      ) ?
      arg :
      JSON.stringify( args );

    return (hash in cache) ?
      cache[hash] :
      (cache[hash] = fn( ...args ));
  }
}
