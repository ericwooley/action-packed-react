import { spawnSync } from "child_process";
import { snapshotPlayground } from "./utils/getAllSourceFiles";
import axios from "axios";

beforeAll(() => {
  process.chdir("../");
  spawnSync("yarn", ["playground-init"], { stdio: "inherit" });
});
describe("setup", () => {
  it("should create the initial files", async () => {
    await snapshotPlayground();
  });
});
