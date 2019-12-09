import { snapshotPlayground, PlaygroundWatcher } from "../utils/getAllSourceFiles";
import { runApr } from "../utils/runApr";
describe("generating", () => {
  describe("route", () => {
    let watcher: PlaygroundWatcher;
    beforeEach(() => {
      watcher = new PlaygroundWatcher();
    });
    afterEach(async () => {
      await watcher.stop();
    });
    it("should generate a new route", async () => {
      runApr("g route --name testRoute --route src", { snapshotOutput: true });
      await snapshotPlayground(watcher);
    });
    it("should generate a new route based on testRoutes", async () => {
      runApr("g route --name testRoute2 --route src/routes/testRoute", { snapshotOutput: true });
      await snapshotPlayground(watcher);
    });
    it("should generate a new route based on testRoutes2", async () => {
      runApr("g route --name testRoute3 --route src/routes/testRoute/routes/testRoute2", {
        snapshotOutput: true
      });
      await snapshotPlayground(watcher);
    });
    it("should throw an error on a non-existent route", () => {
      expect(() =>
        runApr("g route --name testRoute --route src/routes/nothing")
      ).toThrowErrorMatchingInlineSnapshot(
        `"Unsuccessful apr command: apr g route --name testRoute --route src/routes/nothing --autoLink"`
      );
    });
  });
});
