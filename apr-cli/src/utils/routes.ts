import debug from "debug";
import glob from "glob";
import { join, sep } from "path";
import fs from "fs";

export function findRoutes(name: string, { pretty = false } = {}) {
  const log = debug("apr:generate:" + name);
  const dir = join(process.cwd(), "/**/routes/*");

  log("scanning: ", dir);
  let routes = glob.sync(dir);
  log("unprocessed routes", routes, sep);
  routes = routes
    .filter(file => fs.statSync(file).isDirectory())
    .filter(file => file !== "." && file !== "..")
    .map(route => {
      const formatted = route
        .split(sep)

        .join(sep)
        .replace(`${process.cwd()}${sep}`, "");
      if (pretty) return formatted.replace(new RegExp(`${sep}routes${sep}`, "g"), " -> ");
      return formatted;
    });
  log("routes: ", routes);
  return ["src/", ...routes];
}

const routeStr = `${sep}routes${sep}`;
const prettySep = " -> ";
const routeSepRGX = new RegExp(routeStr, "g");

export function prettyRoute(route: string, {newSep = prettySep} = {}) {
  return route.replace(routeSepRGX, newSep).replace(/^src\//, '/');
}
export function uglyRoute(route: string, {oldSep = prettySep} = {}) {
  return route.replace(new RegExp(oldSep, "g"), routeStr).replace(/^\//, 'src\//');
}
