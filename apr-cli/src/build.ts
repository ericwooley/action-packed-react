import { join } from 'path';
import { spawnSync } from "child_process";
import which from "which";
import debug from "debug";
const log = debug("apr:build");
module.exports = async function dev() {
  const buildCommand = which.sync("webpack");
  const args = ["--config", join(__dirname, "../webpack/webpack.config.js")]
  log("running build:", buildCommand, 'with args', args);
  spawnSync(buildCommand, args, {
    stdio: "inherit"
  });
};
