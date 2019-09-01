import glob from "glob";
import path, { join } from "path";
import fs from "fs";
import debug from "debug";
import { cleanSourcePath } from "./cleanSourcePath";
import md5 from "md5";

const log = debug("apr:test:files");
const playGroundSrc = path.join(__dirname, "../../../../playground/src/**/*");
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

export const getAllAllPlaygroundFileSources = async () => getAllFilesSource(await getAllFiles());
export const snapshotPlayground = async () => {
  const filesWithSources = await getAllAllPlaygroundFileSources();
  expect(filesWithSources.map(({ path }) => cleanSourcePath(path))).toMatchSnapshot("file-list");
  filesWithSources.forEach(({ path, contents }) => {
    expect(md5(contents)).toMatchSnapshot(cleanSourcePath(path));
  });
};
