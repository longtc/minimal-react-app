const { baseBabelConfig } = require("./tasks/javascript");

module.exports = {
  compileNamespace: "es",
  extractBabelOptions: baseBabelConfig({ nomodule: false }),
  fallbackLocale: "en-US",
  sourceLocale: "en",
  localeDir: "<rootDir>/app/locales",
  srcPathDirs: [
    "<rootDir>/app/js/view",
  ],
  srcPathIgnorePatterns: [
    "/node_modules/",
  ],
  format: "po",
};
