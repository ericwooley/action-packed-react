import { snapshotPlayground, PlaygroundWatcher } from "../utils/getAllSourceFiles";
import { runApr } from "../utils/runApr";
describe("generating", () => {
  describe("saga", () => {
    let watcher: PlaygroundWatcher;
    beforeEach(() => {
      watcher = new PlaygroundWatcher();
    });
    afterEach(async () => {
      await watcher.stop();
    });
    it("should generate a new saga", async () => {
      runApr("g saga --name testSaga --route src", { snapshotOutput: true });
      await snapshotPlayground(watcher);
    });
    it("should generate a new saga based on testRoutes", async () => {
      runApr("g saga --name testSaga2 --route src/routes/testRoute", {
        snapshotOutput: true
      });
      await snapshotPlayground(watcher);
    });
    it("should generate a new saga based on testRoutes2", async () => {
      runApr("g saga --name testSaga3 --route src/routes/testRoute/routes/testRoute2", {
        snapshotOutput: true
      });
      await snapshotPlayground(watcher);
    });
    it("should throw an error on a non-existent route", () => {
      expect(() =>
        runApr("g saga --name testSaga --route src/routes/nothing")
      ).toThrowErrorMatchingInlineSnapshot(
        `"Unsuccessful apr command: apr g saga --name testSaga --route src/routes/nothing --autoLink"`
      );
    });
  });
});
