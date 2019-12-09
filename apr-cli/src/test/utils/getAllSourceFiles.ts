import glob from "glob";
import path from "path";
import fs from "fs";
import debug from "debug";
import { cleanSourcePath } from "./cleanSourcePath";
import chokidar from "chokidar";

const log = debug("apr:test:files");
const playGroundSrc = path.join(__dirname, "../../../../playground/src/**/*");
const playGroundRoot = path.join(__dirname, "../../../../playground/");

export const getAllFiles = () => {
  log("searching", playGroundSrc, "for files to diff");
  return new Promise<string[]>((r, rej) =>
    glob(playGroundSrc, (err, result) => {
      if (err) return rej(err);
      const resultWithoutDirectories = result.filter(file => !fs.statSync(file).isDirectory());
      log("found files", JSON.stringify(resultWithoutDirectories, null, 2));
      r(resultWithoutDirectories);
    })
  );
};

export const getAllFilesSource = (files: string[]) => {
  return Promise.all(
    files.map(
      file =>
        new Promise<{ path: string; contents: string }>((resolve, reject) => {
          fs.readFile(file, (err, data) => {
            if (err) return reject(err);
            return resolve({
              path: file,
              contents: data.toString()
            });
          });
        })
    )
  );
};

export class PlaygroundWatcher {
  watcher = chokidar.watch(playGroundRoot, {
    ignored: [/(^|[\/\\])\../, /.*node_modules.*/, /yarn.lock/],
    persistent: true
  });
  filesChanged: string[] = [];
  filesRemoved: string[] = [];
  constructor() {
    this.watcher
      .on("add", path => {
        log(`File ${path} has been added`);
        this.filesChanged.push(path);
        this.filesChanged.sort();
      })
      .on("change", path => {
        log(`File ${path} has been changed`);
        this.filesChanged.push(path);
        this.filesChanged.sort();
      })
      .on("unlink", path => {
        log(`File ${path} has been removed`);
        this.filesRemoved.push(path);
        this.filesRemoved.sort();
      });
  }
  resetList = () => {
    this.filesChanged = [];
    this.filesRemoved = [];
  };
  stop = () => this.watcher.close();
}

export const getAllAllPlaygroundFileSources = async () => getAllFilesSource(await getAllFiles());
export const snapshotPlayground = async (watcher: PlaygroundWatcher) => {
  const filesWithSources = await getAllAllPlaygroundFileSources();
  expect(filesWithSources.map(({ path }) => cleanSourcePath(path))).toMatchSnapshot("file-list");
  expect(watcher.filesChanged.map(path => cleanSourcePath(path))).toMatchSnapshot("files-changed");
  await Promise.all(
    watcher.filesChanged.map(async path => {
      await new Promise((res, rej) =>
        fs.readFile(path, (err, data) => {
          if (err) return rej(err);
          expect(cleanSourcePath(data.toString())).toMatchSnapshot(cleanSourcePath(path));
          res();
        })
      );
    })
  );
  watcher.resetList();
};
