const BouncerJs = require("../index.js");
const fs = require("fs");
const path = require("path");
const { chat } = require("../echo.js");

const indexFile = fs.readFileSync(path.resolve(__dirname, "index.html"), {
  encoding: "utf8",
});

const { router } = new BouncerJs({
  debug: true,
  plugins: { chat },
});

router.get("/*", (res, req) => {
  res.end(indexFile);
});
