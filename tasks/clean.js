const fs = require("fs-extra");
const gulp = require("gulp");

const config = require("../config");

gulp.task("clean", async () => {
  await fs.remove(config.publicDir);
});
