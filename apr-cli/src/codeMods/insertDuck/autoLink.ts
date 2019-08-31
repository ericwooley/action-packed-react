import { spawnSync } from "child_process";
import which = require("which");
import { promisify } from "util";
import debug from "debug";
import { join } from "path";
import { red } from "../../utils/colors";
const log = debug("apr:duck:autoLink");
const whichPromise = promisify(which);
// example route: "src/routes/testRoute/routes/testRoute2"
// example  name: "myNewDuck"
export async function autoLink({ name, route }: { name: string; route: string }) {
  const [jscodeshiftCommand, tslintCommand] = await Promise.all([
    whichPromise("jscodeshift"),
    whichPromise("tslint")
  ]);
  if (!jscodeshiftCommand) {
    throw new Error("Could not find dependency: 'jscodeshift'");
  }
  if (!tslintCommand) {
    throw new Error("Could not find dependency: 'tslint'");
  }
  const codeShiftPath = join(__dirname, "./insertDuck.js");
  const ducksIndexPath = join(route, "redux/ducks/index.ts");

  const args = ["-t", codeShiftPath, ducksIndexPath, `--name=${name}`];
  log("running: ", jscodeshiftCommand, args);
  const linkChild = spawnSync(jscodeshiftCommand, args);
  if (linkChild.status !== 0 && linkChild.status) {
    console.error(red("Error running codemod"));
    console.error(linkChild.output.toString());
    process.exitCode = linkChild.status;
    process.kill(process.pid, 'SIGTERM')
  }

}
