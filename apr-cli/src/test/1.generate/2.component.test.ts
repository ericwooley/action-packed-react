import { snapshotPlayground } from "../utils/getAllSourceFiles";
import { runApr } from "../utils/runApr";
describe("generating", () => {
  describe("component", () => {
    it("should generate a new component", async () => {
      runApr("g component --name testComponent --route src", { snapshotOutput: true });
      await snapshotPlayground();
    });
    it("should generate a new component based on testRoutes", async () => {
      runApr("g component --name testComponent2 --route src/routes/testRoute", {
        snapshotOutput: true
      });
      await snapshotPlayground();
    });
    it("should generate a new component based on testRoutes2", async () => {
      runApr("g component --name testComponent3 --route src/routes/testRoute/routes/testRoute2", {
        snapshotOutput: true
      });
      await snapshotPlayground();
    });
    it("should throw an error on a non-existent route", () => {
      expect(() =>
        runApr("g component --name testComponent --route src/routes/nothing")
      ).toThrowErrorMatchingInlineSnapshot(
        `"Unsuccessful apr command: apr g component --name testComponent --route src/routes/nothing"`
      );
    });
  });
});
