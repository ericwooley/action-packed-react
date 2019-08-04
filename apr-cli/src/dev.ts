import { spawnSync } from "child_process";
import which from "which";
import {join} from 'path'
import debug from "debug";
const log = debug("apr:dev");
module.exports = async function dev() {
  const serverCommand = which.sync("webpack-dev-server");
  const args = ["--config", join(__dirname, "../webpack/webpack.config.js")]
  log("starting server command:", serverCommand, 'with args', args);
  spawnSync(serverCommand, args, {
    stdio: "inherit"
  });
};
