import { Arguments } from "yargs-parser";
import { join } from "path";
import { EOL } from "os";
import { fork } from "child_process";
import which from "which";
import debug from "debug";
import { green, grey, blue, red } from "./utils/colors";

const log = debug("apr:generate");

const generatorArgs: {
  [key: string]: (
    restArgs: string[]
  ) => { args: string[]; autoLink?: (answers: any, args?: string[]) => void };
} = {
  ui: (restArgs: string[]) => ({
    autoLink: () => null,
    args: ["ui", "new", ...restArgs]
  }),
  component: (restArgs: string[]) => ({
    args: ["component", "new", ...restArgs],
    autoLink: () => null
  }),
  route: (restArgs: string[]) => ({ args: ["route", "new", ...restArgs], autoLink: () => null }),
  duck: (restArgs: string[]) => ({ args: ["duck", "new", ...restArgs], autoLink: () => null }),
  saga: (restArgs: string[]) => ({ args: ["saga", "new", ...restArgs], autoLink: () => null })
};
const helpText = grey(`       Available generators:
         * ${Object.keys(generatorArgs)
           .map(g => blue(g))
           .join(`${EOL}         * `)}`);
module.exports = async function build(options: Arguments) {
  if (options.help) {
    console.log(
      `
    -> ${green("generate")}: [ generator ]
       ${grey("Each generator has interactive prompts")}${EOL}${helpText}`.trim()
    );
    return 0;
  }
  const buildCommand = which.sync("hygen");
  process.env.HYGEN_TMPLS = join(__dirname, "../_templates/");
  const generator = options._[1];
  if (!generator) {
    console.error(red(`No generator for: ${generator}`));
    return 1;
  }
  if (!generatorArgs[generator]) {
    console.error(
      red(
        `No generator for: ${generator}
available generators:
  * ${Object.keys(generatorArgs).join(`${EOL}  * `)}`
      )
    );
    return 1;
  }
  const { args, autoLink } = generatorArgs[generator](process.argv.slice(4));
  if (args) {
    log("running generator:", buildCommand, "with args", args);
    let answersFromHygen: { route: string; name: string; autoLink: boolean } = {
      route: "",
      name: "",
      autoLink: false
    };
    let ipcCommunicated = false;
    const hygenExitCode = await new Promise(r => {
      const child = fork(buildCommand, args, {
        stdio: ["inherit", "inherit", "inherit", "ipc"]
      });
      child.on("message", async message => {
        log("ipc message", message);
        try {
          const { aprAnswers } = JSON.parse(message);
          answersFromHygen = aprAnswers;
          ipcCommunicated = true;
        } catch (e) {
          console.error(red("Could read summary: " + message));
        }
      });
      child.on("exit", r);
    });
    log("answersFromHygen", answersFromHygen);
    if (options.autoLink && !ipcCommunicated) {
      console.error(red("Cannot autoLink, ipc communication error"));
      return 1;
    }
    if (autoLink && answersFromHygen.autoLink) {
      log("codemod with ", { answersFromHygen });
      autoLink(answersFromHygen);
    }
    return hygenExitCode;
  }
  return 1;
};
