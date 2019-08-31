import { spawnSync } from "child_process";
import which = require("which");
import { promisify } from "util";
import debug from "debug";
import { join } from "path";
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
  spawnSync(jscodeshiftCommand, args, { stdio: "inherit" });
  spawnSync(tslintCommand, [ducksIndexPath, "--fix"], { stdio: "inherit" });
}
