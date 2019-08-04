import { spawnSync } from "child_process";
import which from "which";
import debug from "debug";
const log = debug("apr:dev");
module.exports = async function dev() {
  const serverCommand = which.sync("webpack-dev-server");
  const args = ["--config", "./webpack/webpack.config.js"]
  log("starting server command:", serverCommand, 'with args', args);
  spawnSync(which.sync("webpack-dev-server"), {
    stdio: "inherit"
  });
};
