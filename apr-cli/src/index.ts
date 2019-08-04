const padLeft = require("pad-left");
const debug = require("debug");
const argv = require("yargs-parser")(process.argv.slice(2));
const { EOL } = require("os");
const path = require("path");
const chalk = require("chalk");
const helpDebug = debug("help");
const commands = {
  help: {
    command: "help",
    description: "List options and arguments for any sub command.",
    examples: ["apr dev --help"]
  },
  dev: {
    command: "dev",
    description: "Run the development server",
    examples: ["apr dev"]
  }
};

(async function() {
  console.log("argv", argv);
  let command = argv._[0];
  if (argv._.length < 1 && argv.help) {
    command = commands.help.command;
  }
  console.log("command", command);
  if (command === commands.help.command) {
    console.log(
      Object.values(commands)
        .filter(c => c)
        .map(
          c =>
            `${chalk.green(padLeft(c.command, 5, " "))}: ${c.description}${EOL}${c.examples
              .map(example => `${padLeft("", 5, " ")}  ${chalk.grey(example)}`)
              .join(EOL)}`
        )
        .join(EOL)
    );
  }
})().catch(e => console.error("Unknown error: ", e));
