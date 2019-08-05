#!/usr/bin/env node
import processArgv from "yargs-parser";
import debug from "debug";
import { EOL } from "os";
const log = debug("apr");
interface color {
  (str: string): string;
}
const PADDING = 10;
const empty = "".padStart(PADDING, " ");
const chalk: { green: color; grey: color; blue: color } = require("chalk");
const argv = processArgv(process.argv.slice(2));
const help = {
  command: "help",
  description: "List options and arguments for any sub command.",
  examples: ["apr dev --help"],
  exec: async (args: typeof argv): Promise<void> =>
    console.log(
      Object.values(commands)
        .filter(c => c)
        .map(c =>
          `${chalk.green(c.command.padStart(PADDING-1, " "))} ${c.description}${EOL}${empty + chalk.blue(
            "shortcut:"
          )} ${c.command[0]}${EOL}${c.examples
            .map(example => `${empty}${chalk.grey(example)}`)
            .join(EOL)}`.trim()
        )
        .join(EOL)
    )
};
const commands: { [key: string]: typeof help } = {
  help,
  dev: {
    command: "dev",
    description: "Run the development server",
    examples: ["apr dev"],
    exec: require("./dev")
  },
  build: {
    command: "build",
    description: "Build project into ./dist",
    examples: ["apr build"],
    exec: require("./build")
  },
  generate: {
    command: "generate",
    description: "Build project into ./dist",
    examples: ["apr build"],
    exec: require("./build")
  }
};

async function main() {
  let command: string = argv._[0];
  if (argv._.length < 1 && argv.help) {
    command = commands.help.command;
  }
  log("running command: ", command);
  if (command && commands[command]) {
    await commands[command].exec(argv);
  }
}

main().catch(e => console.error("Unknown error: ", e));
