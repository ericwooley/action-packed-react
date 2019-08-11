const { findRoutes, uglyRoute } = require("../../../dist/utils/routes");
const changeCase = require("change-case");
const routes = findRoutes("route", { pretty: true });
// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples

module.exports = [
  {
    type: "select",
    name: "route",
    message: "Select parent route",
    choices: routes,
    result: uglyRoute
  },
  {
    type: "input",
    name: "name",
    message: "Name your route",
    format: changeCase.camel,
    result: changeCase.camel,
  }
];
