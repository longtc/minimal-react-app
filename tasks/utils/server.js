const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const config = require("../../config.json");
const { mimeType } = require("./mime-type");

const PORT = 5000;
const BUILD_PATH = config.publicDir;
const DEFAULT_RESPONSE = BUILD_PATH + "/index.html";

const server = http.createServer(async (req, res) => {
  // parse URL
  const parsedUrl = url.parse(req.url);
  // extract URL path
  // Avoid https://en.wikipedia.org/wiki/Directory_traversal_attack
  // e.g curl --path-as-is http://localhost:9000/../fileInDanger.txt
  // by limiting the path to current directory only
  const sanitizePath = path.normalize(parsedUrl.pathname).replace(/^(\.\.[/\\]0-9@)+/, "");
  const pathname = path.join(BUILD_PATH, sanitizePath);

  const stream = await fs.createReadStream(pathname);
  const ext = path.parse(pathname).ext;
  res.setHeader("Content-type", mimeType[ext] || "text/plain");

  // eslint-disable-next-line no-unused-vars
  stream.on("error", async err => {
    const rootObject = await fs.createReadStream(DEFAULT_RESPONSE);
    const ext = path.parse(DEFAULT_RESPONSE).ext;
    res.setHeader("Content-type", mimeType[ext] || "text/plain");

    rootObject.pipe(res);
  });

  stream.pipe(res);

});

const start = async () => {
  await server.listen(PORT, async () => {
    console.info(`listening on ${PORT}`);
  });
};

const stop = async () => {
  await server.close();
};

module.exports = { start, stop, PORT };
