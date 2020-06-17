const gulp = require("gulp");
const livereload = require("livereload");

const { PORT } = require("./utils/server");

gulp.task("livereload", async () => {
  try {
    const server = livereload.createServer({
      originalPath: `http://localhost:${PORT}`,
      delay: 100,
    });

    server.watch([
      "build/**/*.*",
    ]);

  }
  catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }

});
