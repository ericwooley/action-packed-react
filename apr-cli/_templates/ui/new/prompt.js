const changeCase = require("change-case");
// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples

module.exports = [
  {
    type: "input",
    name: "name",
    message: "Name your ui component",
    format: changeCase.camel,
    result: changeCase.camel,
  }
];
