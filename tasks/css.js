const path = require("path");
const fs = require("fs-extra");
const gulp = require("gulp");

const postcss = require("postcss");
const csso = require("postcss-csso");
const atImport = require("postcss-import");
const tailwindcss = require("tailwindcss");
const postcssPresetEnv = require("postcss-preset-env");
const autoprefixer = require("autoprefixer");

const { generateRevisionedAsset } = require("./utils/assets");
const { ENV } = require("../env");
const { DEVELOPMENT, supportBrowsers } = require("./utils/constants");

async function compileCss(srcPath) {
  const css = await fs.readFile(srcPath, "utf-8");

  const plugins = [
    atImport(),
    tailwindcss("./tailwind.config.js"),
    postcssPresetEnv({
      browsers: supportBrowsers.join(", "),
      stage: 3,
      features: {
        "nesting-rules": true,
      },
    }),
    autoprefixer({
      overrideBrowserslist: supportBrowsers,
    }),
  ];

  if (ENV !== DEVELOPMENT) {
    plugins.push(csso);
  }

  const result = await postcss(plugins).process(
    css,
    {
      from: srcPath,
      // map: ENV === DEVELOPMENT, // sourcemap
      map: false, // sourcemap
    }
  );
  // TODO: upgrade to postcss-values-parser@3

  return result.css;
}

gulp.task("css", async () => {
  try {
    const srcPath = "./app/css/tailwind.css";
    const css = await compileCss(srcPath);
    const cssFileName = await generateRevisionedAsset(path.basename(srcPath), css);
    global.cssFileName = cssFileName; // this will be used to replace content in `index.html`
  }
  catch (err) {
    console.error(err);
  }
});
