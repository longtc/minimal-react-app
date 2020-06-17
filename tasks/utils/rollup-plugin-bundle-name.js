exports.bundleName = function bundleName({
  name,
  globalKey,
} = {}) {
  return {
    name: "bundleName",
    async writeBundle(options, bundle) {
      const modules = Object.keys(bundle);
      const main = modules.find(val => val.includes(name));
      global[globalKey] = main || name;
    },
  };
};
