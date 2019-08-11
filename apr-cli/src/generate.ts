import { Arguments } from "yargs-parser";
import { join } from "path";
import { EOL } from "os";
import { spawnSync } from "child_process";
import which from "which";
import debug from "debug";
import { green, grey, blue, red } from "./utils/colors";

const log = debug("apr:generate");

const generatorArgs: { [key: string]: (options: Arguments) => string[] | void } = {
  component: () => ["component", "new"],
  route: () => ["route", "new"],
  duck: () => []
};
const helpText = grey(`       Available generators:
         * ${Object.keys(generatorArgs)
           .map(g => blue(g))
           .join(`${EOL}         * `)}`);
module.exports = async function build(options: Arguments) {
  if (options.help) {
    return console.log(
      `
    -> ${green("generate")}: [ generator ]
       ${grey("Each generator has interactive prompts")}${EOL}${helpText}`.trim()
    );
  }
  const buildCommand = which.sync("hygen");
  process.env.HYGEN_TMPLS = join(__dirname, "../_templates/");
  const generator = options._[1];
  if (!generator) {
    console.error(red(`No generator for: ${generator}`));
    process.exit(1);
    return;
  }
  if (!generatorArgs[generator]) {
    console.error(
      red(
        `No generator for: ${generator}
available generators:
  * ${Object.keys(generatorArgs).join(`${EOL}  * `)}`
      )
    );
    process.exit(1);
    return;
  }

  const args = generatorArgs[generator](options);
  if (args) {
    log("running generator:", buildCommand, "with args", args);
    spawnSync(buildCommand, args, {
      stdio: "inherit"
    });
  }
};