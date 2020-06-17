const { task, src, dest, parallel } = require("gulp");

const {
  reactVersion,
  reactRouterDomVersion,
} = require("./utils/constants");

task("react", async () => {
  return src("./node_modules/react/umd/react.production.min.js")
    .pipe(dest(`build/js/vendor/react${reactVersion}/`));
});

task("dom", async () => {
  return src("./node_modules/react-dom/umd/react-dom.production.min.js")
    .pipe(dest(`build/js/vendor/react-dom${reactVersion}/`));
});

task("router", async () => {
  return src("./node_modules/react-router-dom/umd/react-router-dom.min.js")
    .pipe(dest(`build/js/vendor/react-router-dom${reactRouterDomVersion}/`));
});

task("vendor", parallel("react", "dom", "router"));
