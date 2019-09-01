import { spawnSync } from "child_process";
import { snapshotPlayground } from "./utils/getAllSourceFiles";
import chalk from "chalk";
import axios from "axios";

const warnAboutErrorCode = (code: number | null) => {
  if (code) {
    process.stderr.write(chalk.red(`\n\ninit playground exited code ${code}\n\n`));
    process.exitCode = code;
  }
};
beforeAll(() => {
  process.chdir("../");
  spawnSync("yarn", ["playground-init"], { stdio: "inherit" });
});
describe("setup", () => {
  it("should start the dev server", async () => {
    const result = await axios.get("http://localhost:8080");
    expect(result.status).toEqual(200);
  });
  it("should create the initial files", async () => {
    await snapshotPlayground();
  });
});
