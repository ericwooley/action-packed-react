import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import fs from "fs";
import debug from "debug";
import { snapshotPlayground } from "./utils/getAllSourceFiles";
import { red } from "../utils/colors";
const kill = require("tree-kill");
const axios = require("axios");
const log = debug("apr:initPlayground");
const originalDir = __dirname;
let child: ChildProcessWithoutNullStreams;
let webpackLog: fs.WriteStream;
const warnAboutErrorCode = (code: number | null) => {
  if (code) {
    process.stderr.write(red(`\n\ninit playground exited code ${code}\n\n`));
    process.exitCode = code;
  }
};
beforeAll(async () => {
  process.chdir("../");
  process.stdout.write("\ncleaning and launching playground. see `tail -f playground.log`\n");
  child = spawn("yarn", ["playground-init"]);
  webpackLog = fs.createWriteStream("./playground.log");
  child.stdout.pipe(webpackLog);
  child.stderr.pipe(webpackLog);
  child.once("exit", warnAboutErrorCode);
  let serverStarted = false;
  while (!serverStarted) {
    try {
      const result = await axios.get("http://localhost:8080");
      if (result.status === 200) {
        serverStarted = true;
      }
    } catch (e) {
      // nothing to do
    }
    if (!serverStarted) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}, 30000);
describe("setup", () => {
  it("should start the dev server", async () => {
    const result = await axios.get("http://localhost:8080");
    expect(result.status).toEqual(200);
  });
  it("should create the initial files", async () => {
    await snapshotPlayground();
  });
});

afterAll(async () => {
  log("closing server");
  child.removeAllListeners();
  await new Promise(r => kill(child.pid, r));
  webpackLog.close();
  process.chdir(originalDir);
});
