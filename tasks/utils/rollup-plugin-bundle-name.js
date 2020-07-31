/**
 * This rollup plugin get the main entry file name (with hashes)
 * and assign it to a global variable
 * @param {Object} param
 * @param {string} param.name - Name of the main entry file
 * @param {string} param.globalKey - Name of the global variable
 */
exports.bundleName = function bundleName({
  name,
  globalKey,
} = {}) {
  return {
    name: "bundleName",
    async writeBundle(options, bundle) {
      const modules = Object.keys(bundle);
      const main = modules.find(val => val.includes(name));
      // change the global `<globalKey>` variable,
      // we will use this in the `html` gulp task
      global[globalKey] = main || name;
    },
  };
};
