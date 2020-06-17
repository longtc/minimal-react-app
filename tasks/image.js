const { task, src, dest } = require("gulp");

const config = require("../config.json");

task("image", async () => {
  src("./app/image/*.*")
    .pipe(dest(config.publicStaticImageDir));
});
