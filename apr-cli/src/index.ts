import processArgv from "yargs-parser";
import debug from "debug";
import { EOL } from "os";
const log = debug("apr")
interface color {
  (str: string): string;
}
const chalk: { green: color; grey: color } = require("chalk");
const argv = processArgv(process.argv.slice(2));
const help = {
  command: "help",
  description: "List options and arguments for any sub command.",
  examples: ["apr dev --help"],
  exec: async (args: typeof argv): Promise<void> =>
    console.log(
      Object.values(commands)
        .filter(c => c)
        .map(
          c =>
            `${chalk.green(c.command.padStart(5, " "))}: ${c.description}${EOL}${c.examples
              .map(example => `${"".padStart(5, " ")}  ${chalk.grey(example)}`)
              .join(EOL)}`
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
  }
};

(async function() {
  let command: string = argv._[0];
  if (argv._.length < 1 && argv.help) {
    command = commands.help.command;
  }
  log("running command: ", command);
  if (command && commands[command]) {
    await commands[command].exec(argv);
  }
})().catch(e => console.error("Unknown error: ", e));
