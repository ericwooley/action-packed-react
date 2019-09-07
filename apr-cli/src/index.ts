#!/usr/bin/env node
import processArgv from "yargs-parser";
import debug from "debug";
import { EOL } from "os";
import { green, grey, blue, red } from "./utils/colors";
import cosmiconfig = require("cosmiconfig");
const log = debug("apr");
const explorer = cosmiconfig("apr");
const searchResult = explorer.searchSync();
log("Loaded config", searchResult);
const config = searchResult === null ? {} : searchResult.config;
const PADDING = 10;
const empty = "".padStart(PADDING, " ");
const argv = processArgv(process.argv.slice(2));

// config options are the same as all flags
const defaults = {
  port: 8080,
  host: "localhost"
};
Object.assign(argv, defaults, config, { _: argv._ });
const help = {
  command: "help",
  description: "List options and arguments for any sub command.",
  examples: ["apr dev --help"],
  exec: async (args: typeof argv): Promise<number> => {
    console.log(
      Object.values(commands)
        .filter(c => c)
        .map(c =>
          `${green(c.command.padStart(PADDING - 1, " "))} ${c.description}${EOL}${empty +
            blue("shortcut:")} ${c.command[0]}${EOL}${c.examples
            .map(example => `${empty}${grey(example)}`)
            .join(EOL)}`.trim()
        )
        .join(EOL)
    );
    return 0;
  }
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
    description: "generate routes, components, etc...",
    examples: ["apr g # interactive", "apr g component <component name>"],
    exec: require("./generate")
  },
  storybook: {
    command: "storybook",
    description: "start the storybook dev server",
    examples: ["apr s", "apr storybook"],
    exec: require("./storybook")
  },
  routes: {
    command: "routes",
    description: "list all routes",
    examples: ["apr r", "apr routes"],
    exec: require("./routes")
  }
};

async function main() {
  log("argv", JSON.stringify(argv, null, 2));
  let command: string = argv._[0];
  if (argv._.length < 1 && argv.help) {
    command = commands.help.command;
  }
  if (!command) {
    console.log(red("no matching commands"));
    command = commands.help.command;
    return 1;
  }
  log("running command: ", command);
  if (command.length === 1) {
    command = Object.keys(commands).find(key => key[0] === command) || "";
  }
  if (commands[command]) {
    const exitCode = await commands[command].exec(argv);
    return exitCode;
  } else {
    return 1;
  }
}

main()
  .then(exitCode => {
    process.exitCode = exitCode;
  })
  .catch(e => {
    console.error("Unknown error: ", e);
    process.exitCode = 1;
  });
