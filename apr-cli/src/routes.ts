import { Arguments } from "yargs-parser";
import { EOL } from "os";
import { findRoutes, prettyRoute } from "./utils/routes";
import { green } from "./utils/colors";

module.exports = function routes(args: Arguments) {
  if (args.help) {
    console.log("There are no options or arguments for this command");
  }
  let routes = findRoutes("route");
  const longestRoute = routes.reduce(
    (longest, route) => (route.length > longest ? route.length : longest),
    0
  );
  routes = routes.map(
    route =>
      ` ${route.padEnd(longestRoute)} │ http://localhost:9000${prettyRoute(route, {
        newSep: "/"
      })} `
  );
  const longestLine = routes.reduce(
    (longest, route) => (route.length > longest ? route.length : longest),
    0
  );
  const lineSep = EOL + "".padStart(longestLine, "─") + EOL;
  process.stdout.write(
    EOL + ` ${green("Source Files".padStart(longestRoute))} │ ${green("Url")} ` + lineSep
  );
  console.log(routes.join(lineSep) + lineSep);
};
