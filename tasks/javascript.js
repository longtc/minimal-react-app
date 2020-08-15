/* eslint-disable no-console */
const path = require("path");
const gulp = require("gulp");
const { rollup, watch } = require("rollup");

const { babel } = require("@rollup/plugin-babel");
const replace = require("@rollup/plugin-replace");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const externalGlobals = require("rollup-plugin-external-globals");
const { terser } = require("rollup-plugin-terser");

const postcss = require("rollup-plugin-postcss");
const genericNames = require("generic-names");
const csso = require("postcss-csso");
const postcssPresetEnv = require("postcss-preset-env");
const autoprefixer = require("autoprefixer");

const { bundleName } = require("./utils/rollup-plugin-bundle-name");

const MODULE_NAME = "main-module";
const NOMODULE_NAME = "main-nomodule";

const config = require("../config.json");
const { ENV } = require("../env");
const {
  DEVELOPMENT,
  STAGING,
  PRODUCTION,
  babelRuntimeVersion,
  supportBrowsers,
} = require("./utils/constants");

const reactAppGlobals = {
  react: "React",
  "react-dom": "ReactDOM",
  "react-router-dom": "ReactRouterDOM",
  // `react-router-breadcrumbs-hoc` import from `react-router`,
  // we redirect it to ReactRouterDOM since it's basically the same package
  "react-router": "ReactRouterDOM",
};

const reactAppExternal = Object.keys(reactAppGlobals);

const replaceOptions = {
  "process.env.NODE_ENV": JSON.stringify(ENV),
};

if (ENV === PRODUCTION) {
  replaceOptions["http://localhost:REPLACE"] = config.apiProduction;
}
else if (ENV === STAGING) {
  replaceOptions["http://localhost:REPLACE"] = config.apiStaging;
}
else if (ENV === DEVELOPMENT) {
  replaceOptions["http://localhost:REPLACE"] = config.apiStaging;
}


const cssModuleContext = path.resolve(__dirname, "app", "js");
const cssModuleScopedName = "[hash:base64:5]";

function baseBabelConfig({ nomodule = false }) {
  const browsers = nomodule ? ["ie 11"] : supportBrowsers;

  return {
    presets: [
      [
        "@babel/preset-env",
        {
          targets: { browsers },
          modules: false,
          useBuiltIns: "usage",
          // debug: true,
          // loose: true,
          corejs: 3,
        },
      ],
      [
        "@babel/preset-react",
        {
          useBuiltIns: true,
          useSpread: false,
        },
      ],
    ],
    plugins: [
      ["react-css-modules", {
        context: cssModuleContext,
        generateScopedName: cssModuleScopedName,
      }],
      "macros",
      "transform-react-remove-prop-types",
      "@babel/plugin-syntax-dynamic-import",
      [
        "@babel/plugin-transform-runtime",
        {
          // do NOT duplicate the `corejs` config here
          regenerator: false,
          useESModules: true,
          version: `^${babelRuntimeVersion}`,
        },
      ],
    ],
  };
}


function baseRollupPlugins({ nomodule = false } = {}) {

  const postcssPlugins = [];
  if (ENV !== DEVELOPMENT) {
    postcssPlugins.push(
      postcssPresetEnv({
        browsers: supportBrowsers,
        stage: 3,
        features: {
          "nesting-rules": true,
        },
      }),
      autoprefixer({
        overrideBrowserslist: supportBrowsers,
      }),
      csso,
    );
  }

  const babelConfigForRollup = Object.assign({
    exclude: [
      /core-js/,
      /regenerator-runtime/,
      /node_modules/,
    ],
    babelHelpers: "runtime", // @rollup/plugin-babel specific
  }, baseBabelConfig({ nomodule }));

  const plugins = [
    postcss({
      // TODO: extract to a css file with hashed name,
      // inject css modules to <head> for now
      extract: false,
      inject: true,
      plugins: postcssPlugins,
      modules: {
        // Special scoped name generation function used to sync
        // babel-plugin-postcss-modules with rollup-plugin-postcss.
        generateScopedName: (cssname, filepath) => {
          // Generation logic basically adapted from here:
          // https://github.com/gajus/babel-plugin-react-css-modules/blob/9fcb91f5c3d3b181d0087ab7de999ac2c9c1dd11/src/requireCssModule.js#L103-L109
          const generate = genericNames(cssModuleScopedName, {
            context: cssModuleContext,
          });
          return generate(cssname, filepath);
        },
      },
      autoModules: false,
      sourceMap: ENV === DEVELOPMENT,
    }),
    nodeResolve({
      browser: true,
      extensions: [".js", ".jsx"],
    }),
    replace(replaceOptions),
    babel(babelConfigForRollup),
    commonjs({
      exclude: [
        "node_modules/**/es?(m)/**",
      ],
      // https://github.com/rollup/plugins/tree/master/packages/commonjs#esmexternals
      esmExternals: true,
      requireReturnsDefault: "auto",
      // include: "node_modules/**",
    }),
    bundleName({
      name: nomodule ? NOMODULE_NAME : MODULE_NAME,
      globalKey: nomodule ? "nomoduleBundleName" : "moduleBundleName",
    }),
  ];

  if (!nomodule) {
    plugins.push(externalGlobals(reactAppGlobals));
  }

  if (ENV !== DEVELOPMENT) {
    plugins.push(terser({
      mangle: {
        toplevel: true,
        // properties: {
        //   regex: /(^_|_$)/,
        // },
        safari10: nomodule,
      },
      module: !nomodule,
    }));
  }

  return plugins;
}


function manualChunks(id) {
  if (id.includes("node_modules")) {
    // The directory name following the last `node_modules`.
    // Usually this is the package, but it could also be the scope.
    const directories = id.split(path.sep);
    const name = directories[directories.lastIndexOf("node_modules") + 1];

    // Group react dependencies into a common "react" chunk.
    // NOTE: This isn't strictly necessary for this app, but it's included
    // as an example to show how to manually group common dependencies.
    if (name.match(/^react-?((dom)|(router)|(router-dom))?$/) ||
    ["prop-types", "scheduler"].includes(name)) {
      return "react";
    }

    // Group `tslib` and `dynamic-import-polyfill` into the default bundle.
    // NOTE: This isn't strictly necessary for this app, but it's included
    // to show how to manually keep deps in the default chunk.
    if (name === "tslib" || name === "dynamic-import-polyfill") {
      return;
    }

    if (name.match(/babel/) || name.match(/core-js/)) {
      return "core-js";
    }

    // remove `@` from name
    if (name.includes("@")) {
      return name.replace(/@/g, "");
    }

    // Otherwise just return the name.
    return name;
  }

  if (id.includes("js/utils")) {
    return "utils";
  }
  if (id.includes("view/component")) {
    return "component";
  }
}


// ***************************************
// #region watch

let watchCache;

function watchFiles() {

  const inputOptions = {
    input: {
      [MODULE_NAME]: `./app/js/${MODULE_NAME}.js`,
    },
    external: reactAppExternal,
    plugins: baseRollupPlugins({ nomodule: false }),
    cache: watchCache,
    preserveEntrySignatures: false,
    preserveSymlinks: true, // Needed for `file:` entries in package.json.
    manualChunks,
  };

  const moduleOutputOptions = {
    dir: config.publicStaticJsDir,
    entryFileNames: "[name]-[hash].js", // prod build
    chunkFileNames: "[name]-[hash].chunk.js", // prod build
    format: "esm",
    globals: reactAppGlobals,

    // Don't rewrite dynamic import when developing (for easier debugging).
    dynamicImportFunction: ENV === DEVELOPMENT ? undefined : "__import__",
  };

  if (ENV === DEVELOPMENT) {
    moduleOutputOptions.entryFileNames = "[name].js";
    moduleOutputOptions.chunkFileNames = "[name].chunk.js";
    moduleOutputOptions.sourcemap = true;
  }

  try {
    const watcher = watch({
      ...inputOptions,
      output: [moduleOutputOptions],
      watch: {
        include: [
          "app/js/**/*.js?(x)",
          "app/js/**/*.css",
          "config.json",
        ],
        exclude: [
          "node_modules/**",
        ],
        clearScreen: false,
      },
    });

    /* eslint-disable no-console */
    watcher.on("event", ev => {
      if (ev.code === "END") {
        console.info("Bundling completed!");
      }
      if (ev.code === "BUNDLE_END") {
        watchCache = ev.result.cache;
      }
      if (ev.code === "ERROR") {
        console.error(ev.error);
      }
      if (ev.code === "FATAL") {
        console.error(ev.error);
      }
    });
    // /* eslint-enable no-console */

  }
  catch (err) {
    process.stdout.write("\x07");

    // Log but don't throw so watching still works.
    console.error(err);
  }
}

// #endregion


// ***************************************
// #region bundle
let moduleBundleCache;

const compileModuleBundle = async () => {

  const plugins = baseRollupPlugins({ nomodule: false });

  const bundle = await rollup({
    input: {
      [MODULE_NAME]: `./app/js/${MODULE_NAME}.js`,
    },
    external: reactAppExternal,
    plugins,
    cache: moduleBundleCache,
    preserveEntrySignatures: false,
    preserveSymlinks: true, // Needed for `file:` entries in package.json.
    manualChunks,
  });

  // eslint-disable-next-line require-atomic-updates
  moduleBundleCache = bundle.cache;

  const moduleOutputOptions = {
    dir: config.publicStaticJsDir,
    entryFileNames: "[name]-[hash].js", // prod build
    chunkFileNames: "[name]-[hash].chunk.js", // prod build
    format: "esm",
    globals: reactAppGlobals,

    // Don't rewrite dynamic import when developing (for easier debugging).
    dynamicImportFunction: ENV === DEVELOPMENT ? undefined : "__import__",
  };

  if (ENV === DEVELOPMENT) {
    moduleOutputOptions.entryFileNames = "[name].js";
    moduleOutputOptions.chunkFileNames = "[name].chunk.js";
    moduleOutputOptions.sourcemap = true;
  }

  await bundle.write(moduleOutputOptions);
};

let nomoduleBundleCache;

const compileClassicBundle = async () => {
  const plugins = baseRollupPlugins({ nomodule: true });

  const bundle = await rollup({
    input: {
      [NOMODULE_NAME]: `./app/js/${NOMODULE_NAME}.js`,
    },
    external: reactAppExternal,
    cache: nomoduleBundleCache,
    plugins,
    inlineDynamicImports: true, // Need for a single output bundle.
    preserveEntrySignatures: false,
    preserveSymlinks: true, // Needed for `file:` entries in package.json.
  });

  // eslint-disable-next-line require-atomic-updates
  nomoduleBundleCache = bundle.cache;

  const nomoduleOptions = {
    dir: config.publicStaticJsDir,
    format: "iife",
    entryFileNames: "[name]-[hash].js",
    globals: reactAppGlobals,
  };

  // const { output } = await bundle.generate(nomoduleOptions);

  // global.nomoduleBundleName = output[0].fileName;

  await bundle.write(nomoduleOptions);
};

// #endregion

gulp.task("javascript", async () => {
  try {
    const bundleTasks = [compileModuleBundle()];

    if (ENV !== DEVELOPMENT) {
      bundleTasks.push(compileClassicBundle());
    }

    await bundleTasks;
  }
  catch (err) {
    // Beep!
    process.stdout.write("\x07");

    // Log but don't throw so watching still works.
    console.error(err);
  }
});

gulp.task("javascript:watch", async () => {
  try {
    watchFiles();
  }
  catch (err) {
    // Beep!
    process.stdout.write("\x07");

    // Log but don't throw so watching still works.
    console.error(err);
  }
});


// export base babel config so lingui can use
module.exports = {
  baseBabelConfig,
};
