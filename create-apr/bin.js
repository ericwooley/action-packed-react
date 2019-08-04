const { spawn } = require("child_process");
const { join } = require("path");
process.env.HYGEN_TMPLS = join(__dirname, "./template/_templates/");
var which = require("which");
var hygen = which.sync("hygen");
const child = spawn(hygen, ["apr-init", "new"], { stdio: "inherit" });
