import { snapshotPlayground, PlaygroundWatcher } from "../utils/getAllSourceFiles";
import { runApr } from "../utils/runApr";
describe("generating", () => {
  describe("ui", () => {
    let watcher: PlaygroundWatcher;
    beforeEach(() => {
      watcher = new PlaygroundWatcher();
    });
    afterEach(async () => {
      await watcher.stop();
    });
    it("should generate a new ui component", async () => {
      runApr("g ui --name testUi", { snapshotOutput: true });
      await snapshotPlayground(watcher);
    });
  });
});
