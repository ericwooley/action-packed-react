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

let filesChanged: string[] = [];
const watcher = chokidar.watch(playGroundRoot, {
  ignored: [/(^|[\/\\])\../, /.*node_modules.*/],
  persistent: true
});
watcher
  .on("add", path => {
    log(`File ${path} has been added`);
    filesChanged.push(path);
  })
  .on("change", path => {
    log(`File ${path} has been changed`);
    filesChanged.push(path);
  })
  .on("unlink", path => {
    log(`File ${path} has been removed`);
  });

export const stopWatching = async () => {
  return watcher.close();
};
export const getAllAllPlaygroundFileSources = async () => getAllFilesSource(await getAllFiles());
export const snapshotPlayground = async () => {
  const filesWithSources = await getAllAllPlaygroundFileSources();
  expect(filesWithSources.map(({ path }) => cleanSourcePath(path))).toMatchSnapshot("file-list");
  await Promise.all(
    filesChanged.map(async path => {
      await new Promise((res, rej) =>
        fs.readFile(path, (err, data) => {
          if (err) return rej(err);
          expect(cleanSourcePath(data.toString())).toMatchSnapshot(cleanSourcePath(path));
          res();
        })
      );
    })
  );
  filesChanged = [];
};
