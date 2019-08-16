import { spawnSync } from "child_process";
import which from "which";
import { join } from "path";
import debug from "debug";
import { Arguments } from "yargs-parser";
import { green, grey, blue } from "./utils/colors";
const log = debug("apr:dev");
module.exports = async function dev(options: Arguments) {
  const extraArgs = process.argv.slice(3);
  if (options.help) {
    return console.log(`
-> ${green('dev')}: [...webpack-dev-server-args]
  All arguments will be passed on to webpack-dev-server
  ${blue('apr d --hot-only')} ${grey('-> apr d --config <apr-build-config> --hot-only')}
  ${grey('see: https://webpack.js.org/configuration/dev-server/')}`.trim());
  }
  const serverCommand = which.sync("webpack-dev-server");
  const specialArgs = []
  if (options.port) {
    specialArgs.push('--port', options.port)
  }
  if (options.host) {
    specialArgs.push('--host', options.host)
  }
  log("special args from cli", )
  const args = ["--config", join(__dirname, "../webpack/webpack.config.js"), ...specialArgs, ...extraArgs];
  log("starting server command:", serverCommand, "with args", args);
  spawnSync(serverCommand, args, {
    stdio: "inherit"
  });
};
