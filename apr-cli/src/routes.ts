import { Arguments } from "yargs-parser";
import { EOL } from "os";
import { findRoutes, prettyRoute } from "./utils/routes";
import { green } from "./utils/colors";
const sourceFilesText = "Source Files";
const urlText = "Url";

module.exports = function routes(args: Arguments) {
  if (args.help) {
    console.log("There are no options or arguments for this command");
  }
  let routes = findRoutes("route");
  const longestRoute = Math.max(
    routes.reduce((longest, route) => (route.length > longest ? route.length : longest), 0),
    sourceFilesText.length
  );
  routes = routes.map(
    route =>
      ` ${route.padEnd(longestRoute)} │ http://${args.host}:${args.port}${prettyRoute(route, {
        newSep: "/"
      }).replace(/^src/, '')} `
  );
  const longestLine = routes.reduce(
    (longest, route) => (route.length > longest ? route.length : longest),
    0
  );
  const lineSep = EOL + "".padStart(longestLine, "─") + EOL;
  process.stdout.write(
    EOL + ` ${green(sourceFilesText.padStart(longestRoute))} │ ${green(urlText)} ` + lineSep
  );
  console.log(routes.join(lineSep) + lineSep);
};
