import { snapshotPlayground, PlaygroundWatcher } from "../utils/getAllSourceFiles";
import { runApr } from "../utils/runApr";
describe("generating", () => {
  describe("duck", () => {
    let watcher: PlaygroundWatcher;
    beforeEach(() => {
      watcher = new PlaygroundWatcher();
    });
    afterEach(async () => {
      await watcher.stop();
    });
    it("should generate a new duck", async () => {
      runApr("g duck --name testDuck --route src", { snapshotOutput: true });
      await snapshotPlayground(watcher);
    });
    it("should generate a new duck based on testRoutes", async () => {
      runApr("g duck --name testDuck2 --route src/routes/testRoute", {
        snapshotOutput: true
      });
      await snapshotPlayground(watcher);
    });
    it("should generate a new duck based on testRoutes2", async () => {
      runApr("g duck --name testDuck3 --route src/routes/testRoute/routes/testRoute2", {
        snapshotOutput: true
      });
      await snapshotPlayground(watcher);
    });
    it("should throw an error on a non-existent route", () => {
      expect(() =>
        runApr("g duck --name testDuck --route src/routes/nothing")
      ).toThrowErrorMatchingInlineSnapshot(
        `"Unsuccessful apr command: apr g duck --name testDuck --route src/routes/nothing --autoLink"`
      );
    });
  });
});
