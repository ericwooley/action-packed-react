import { snapshotPlayground } from "../utils/getAllSourceFiles";
import { runApr } from "../utils/runApr";
describe("generating", () => {
  describe("duck", () => {
    it("should generate a new duck", async () => {
      runApr("g duck --name testDuck --route src", { snapshotOutput: true });
      await snapshotPlayground();
    });
    it("should generate a new duck based on testRoutes", async () => {
      runApr("g duck --name testDuck2 --route src/routes/testRoute", {
        snapshotOutput: true
      });
      await snapshotPlayground();
    });
    it("should generate a new duck based on testRoutes2", async () => {
      runApr("g duck --name testDuck3 --route src/routes/testRoute/routes/testRoute2", {
        snapshotOutput: true
      });
      await snapshotPlayground();
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
