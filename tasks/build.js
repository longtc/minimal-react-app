const gulp = require("gulp");

require("./javascript");
require("./html");
require("./css");
require("./image");
// require("./vendor");

gulp.task("build", gulp.series(
  // "clean",
  gulp.parallel("image", "css", "javascript"),
  "html"
));

gulp.task("build:watch", gulp.series(
  // "clean",
  gulp.parallel("image", "css", "javascript:watch"),
  "html"
));
