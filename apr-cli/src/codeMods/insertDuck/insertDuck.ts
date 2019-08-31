import { API, FileInfo, ExportDeclaration, Identifier } from "jscodeshift";
import processArgv from "yargs-parser";
let describe = require("jscodeshift-helper").describe;

const argv = processArgv(process.argv.slice(2));
module.exports = function(fileInfo: FileInfo, api: API, options: { name: string }) {
  options = { ...options, ...argv };
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  root
    .get()
    .node.program.body.unshift(
      `import { ${options.name}, initialState as ${options.name}InitialState } from './${options.name}/${options.name}'`
    );
  root.find(j.ExportDefaultDeclaration).forEach((dec: any) => {
    const property = j.property("init", j.identifier(options.name), j.identifier(options.name));
    property.shorthand = true;
    dec.value.declaration.properties.push(property);
  });
  root
    .find(j.VariableDeclarator)
    .filter(isInitialState)
    .forEach(d => {
      // describe(d.node);
      (d.node.init as any).properties.push(
        j.property("init", j.identifier(options.name), j.identifier(`${options.name}InitialState`))
      ); // logs helpful info to the console
      return true;
    });
  return root.toSource();
};
module.exports.parser = "typescript";

const isInitialState = (d: any) => {
  try {
    return d.node.id.name === "initialState";
  } catch (e) {
    return false;
  }
};
