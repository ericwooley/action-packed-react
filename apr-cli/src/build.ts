import { Arguments } from "yargs-parser";
import { join } from "path";
import { spawnSync } from "child_process";
import which from "which";
import debug from "debug";
import { green, grey, blue } from "./utils/colors";

const log = debug("apr:build");
module.exports = async function build(options: Arguments) {
  const extraArgs = process.argv.slice(3);
  if (options.help) {
    return console.log(`
-> ${green("build")}: [...webpack-args]
   All arguments will be passed on to webpack cli
   ${blue("apr build --json > stats.json")} ${grey("-> webpack --config <apr-build-config> --json > stats.json")}
   ${grey('see: https://webpack.js.org/api/cli/'.trim())}`);
  }
  const buildCommand = which.sync("webpack");
  const args = [
    "--config",
    join(__dirname, "../webpack/webpack.config.js"),
    "--env.production",
    ...extraArgs
  ];
  log("running build:", buildCommand, "with args", args);
  spawnSync(buildCommand, args, {
    stdio: "inherit"
  });
};
