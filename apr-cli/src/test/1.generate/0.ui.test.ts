import { snapshotPlayground } from "../utils/getAllSourceFiles";
import { runApr } from "../utils/runApr";
describe("generating", () => {
  describe("ui", () => {
    it("should generate a new ui component", async () => {
      runApr("g ui --name testUi", { snapshotOutput: true });
      await snapshotPlayground();
    });
  });
});
