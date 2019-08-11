const glob = require("glob");
const { join, sep } = require("path");
const debug = require("debug");

const log = debug("apr:generate:route");
const dir = join(process.cwd(), "/**/routes/*");

log("scanning: ", dir);
let routes = glob.sync(dir);
log("unprocessed routes", routes, sep);
routes = routes.map(route =>
  route
    .split(sep)
    .join(sep)
    .replace(`${process.cwd()}${sep}`, "")
    .replace(new RegExp(`${sep}routes${sep}`, 'g'), ' -> ')
);
log("routes: ", routes);
if (!routes.length) {
  console.error("No Routes available, are you at the root?");
}
// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
module.exports = [
  {
    type: "select",
    name: "route",
    message: "Select parent route",
    choices: ["src", ...routes]
  },
  {
    type: "input",
    name: "name",
    message: "Name your route"
  }

];
