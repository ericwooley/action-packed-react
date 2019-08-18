import { join } from "path";
import { spawnSync } from "child_process";
import debug from "debug";
const log = debug("apr:runApr");
export const runApr = (args: string[] | string, { snapshotOutput = false } = {}) => {
  if (typeof args === "string") {
    args = args.split(/\s/g);
  }
  const prettyCommand = ["apr", ...args].join(" ");
  process.chdir(join(__dirname, "../../../../playground"));
  log("running: ", prettyCommand);
  const result = spawnSync("apr", args);
  const output = result.output.toString();
  log("exit status for", prettyCommand, result.status);
  log("output for", prettyCommand, "\n", output);
  if (result.status !== 0) {
    throw new Error("Unsuccessful apr command: " + ["apr", ...args].join(" "));
  }
  if (snapshotOutput) {
    expect(output).toMatchSnapshot(prettyCommand);
  }
  return output;
};
