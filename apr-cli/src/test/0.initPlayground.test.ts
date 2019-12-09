import { spawnSync } from "child_process";
import { snapshotPlayground, PlaygroundWatcher } from "./utils/getAllSourceFiles";

beforeAll(() => {
  process.chdir("../");
  spawnSync("yarn", ["playground-init", "--dev"], { stdio: "inherit" });
});
describe("setup", () => {
  let watcher: PlaygroundWatcher;
  beforeEach(() => {
    watcher = new PlaygroundWatcher();
  });
  afterEach(async () => {
    await watcher.stop();
  });
  it("should create the initial files", async () => {
    await snapshotPlayground(watcher);
  });
});
