// https://github.com/philipwalton/blog/blob/master/tasks/utils/assets.js
const fs = require("fs-extra");
const path = require("path");
const revHash = require("rev-hash");
const revPath = require("rev-path");

const config = require("../../config.json");
const { ENV } = require("../../env");
const { DEVELOPMENT } = require("../utils/constants");

let manifest;

const ensureManifest = () => {
  if (!manifest) {
    manifest = fs.readJsonSync(
      path.join(config.publicDir, config.manifestFileName),
      { throws: false }) || {};
  }
};


const getManifest = () => {
  ensureManifest();
  return manifest;
};


const saveManifest = () => {
  fs.outputJsonSync(
    path.join(config.publicDir, config.manifestFileName),
    manifest, { spaces: 2 });
};


const resetManifest = () => {
  manifest = {};
  saveManifest();
};


const getAsset = filename => {
  ensureManifest();

  if (!manifest[filename]) {
    // eslint-disable-next-line no-console
    console.error(`Revisioned file for '${filename}' doesn't exist`);
  }

  return manifest[filename];
};


const addAsset = (filename, revisionedFilename) => {
  ensureManifest();

  manifest[filename] = revisionedFilename;

  saveManifest();
};


const getRevisionedAssetUrl = filename => {
  return path.join(config.publicStaticPath, getAsset(filename) || filename);
};


const generateRevisionedAsset = (filename, content) => {
  let outputFilename = filename;

  if (ENV !== DEVELOPMENT) {
    const hash = revHash(content);
    outputFilename = revPath(filename, hash);
  }

  let basePath = config.publicStaticDir;

  if (filename.includes(".css")) {
    basePath = config.publicStaticCssDir;
  }
  else if (filename.includes(".js")) {
    basePath = config.publicStaticJsDir;
  }

  // Updates the internal revision map so it can be referenced later.
  // addAsset(filename, revisionedFilename);

  fs.outputFileSync(
    path.join(basePath, outputFilename), content);

  return outputFilename;
};

module.exports = {
  getManifest,
  saveManifest,
  resetManifest,
  getAsset,
  addAsset,
  getRevisionedAssetUrl,
  generateRevisionedAsset,
};
