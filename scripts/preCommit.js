/* eslint-disable no-console */
const path = require("path");
const fse = require("fs-extra");

const cwd = process.cwd();
function copyPrecommit() {
  fse.copySync(
    "pre-commit",
    "./.git/hooks/pre-commit",
    {
      overwrite: true,
    },
    err => {
      if (err) return console.error(err);
      console.info("pre-commit was copied to .git/hooks/");
    }
  );

  fse.chmod(path.resolve(cwd, ".git/hooks", "pre-commit"), 0o755,
    err => {
      if (err) throw err;
      console.info("Permission of pre-commit was changed");
    });
}

copyPrecommit();
