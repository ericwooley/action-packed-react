import { spawnSync } from "child_process";
import which from "which";
import { join } from "path";
import debug from "debug";
import { Arguments } from "yargs-parser";
import { green, grey, blue } from "./utils/colors";
const log = debug("apr:storybook");
module.exports = async function dev(options: Arguments) {
  const extraArgs = process.argv.slice(3);
  if (options.help) {
    return console.log(
      `
-> ${green("storybook")}:
`.trim()
    );
  }
  const serverCommand = which.sync("start-storybook");
  const specialArgs = [];
  if (options.port) {
    specialArgs.push("--port", options.port);
  }
  log("special args from cli");
  const args = [
    '-s',
    process.cwd(),
    "-c",
    join(__dirname, "../storybook"),
    ...specialArgs,
    ...extraArgs
  ];
  log("starting server command:", serverCommand, "with args", args);
  const result = spawnSync(serverCommand, args, {
    stdio: "inherit"
  });
  return result.signal;
};
