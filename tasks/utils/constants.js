const pkg = require("../../package.json");

exports.DEVELOPMENT = "development";
exports.PRODUCTION = "production";
exports.STAGING = "staging";

exports.reactVersion = getPackageVersion(pkg.dependencies.react);
exports.reactRouterDomVersion = getPackageVersion(pkg.dependencies["react-router-dom"]);
exports.babelRuntimeVersion = getPackageVersion(pkg.dependencies["@babel/runtime"]);

// these browsers support javascript Proxy
exports.supportBrowsers = [
  "last 2 Chrome versions",
  "last 2 Safari versions",
  "last 2 iOS versions",
  "last 2 Edge versions",
  "Edge 18",
  "Firefox ESR",
];


// ***************************************
// #region private

function getPackageVersion(str) {
  return str.replace(/[^\d.]/g, "");
}

// #endregion
