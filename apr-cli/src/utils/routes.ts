import debug from "debug";
import glob from "glob";
import { join, sep } from "path";
import fs from "fs";
const routeLog = debug("apr:foundRoutes")
export function findRoutes(name: string, { pretty = false } = {}) {
  const log = debug("apr:generate:" + name);
  const dir = join(process.cwd(), "./**/routes");

  log("scanning: ", dir);
  let routes = glob.sync(dir);
  log("unprocessed routes", routes, sep);
  routes = routes
    .filter(file => fs.statSync(file).isDirectory())
    .filter(file => file !== "." && file !== "..")
    .map(route => {
      const formatted = route
      .replace(new RegExp(`${sep}routes$`), '')
      .split(sep)
      .join(sep)
      .replace(`${process.cwd()}${sep}`, "")
      // glob bug????
        .replace(/^srcroutes/, `src${sep}routes`);
      if (pretty) return prettyRoute(formatted);
      return formatted;
    });
  log("routes: ", routes);
  return [...routes];
}

const routeStr = `${sep}routes${sep}`;
const routeSepRGX = new RegExp(routeStr, "g");
const prettySep = " -> ";
routeLog("routeStr", routeStr)

export function prettyRoute(route: string, { newSep = prettySep } = {}) {
  const pretty = route.replace(routeSepRGX, newSep);
  routeLog("pretty -", route, ': |', pretty, '| sep=', prettySep)
  return pretty
}
export function uglyRoute(route: string, { oldSep = prettySep } = {}) {
  const ugly = route.replace(new RegExp(oldSep, "g"), routeStr);
  routeLog(route, ': |', ugly, '| sep=', prettySep)
  return ugly
}
