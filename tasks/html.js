const { task, src, dest } = require("gulp");
const { replace, after } = require("gulp-inject-string");

const { ENV } = require("../env");
const {
  DEVELOPMENT,
} = require("./utils/constants");

task("html", async () => {
  let stream = src("./public/index.html")
    .pipe(replace("main.css", global.cssFileName || "main.css"))
    .pipe(replace("main-nomodule.js", global.nomoduleBundleName || "main-nomodule.js"))
    .pipe(replace("main-module.js", global.moduleBundleName || "main-module.js"));

  if (ENV !== DEVELOPMENT) {
    // stream = stream
    //   .pipe(replace("/js/vendor/react-router-dom.js",
    //     `/js/vendor/react-router-dom${reactRouterDomVersion}/react-router-dom.min.js`))
    //   .pipe(replace("/js/vendor/react.development.js",
    //     `/js/vendor/react${reactVersion}/react.production.min.js`))
    //   .pipe(replace("/js/vendor/react-dom.development.js",
    //     `/js/vendor/react-dom${reactVersion}/react-dom.production.min.js`));
  }
  else {
    stream = stream
      .pipe(after(
        "<!-- append livereload script -->",
        `\n  <script>
        document.write('<script src="http://' + (location.host || 'localhost').split(':')[0] +
        ':35729/livereload.js?snipver=1"></' + 'script>')
      </script>`
      ));
  }

  return stream.pipe(dest("build"));
});
