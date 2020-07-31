const gulp = require("gulp");

require("./build");
require("./server");
require("./livereload");

gulp.task("watch", gulp.series("build:watch", "server", "livereload", () => {
  gulp.watch([
    "app/css/**/*.css",
    "./tailwind.config.js",
  ], gulp.series("css"));

  gulp.watch("app/image/**/*",
    gulp.series("image"));

  gulp.watch([
    "public/index.html",
  ], gulp.series("html"));

}));
