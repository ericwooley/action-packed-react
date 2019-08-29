import { API, FileInfo } from "jscodeshift";
import processArgv from "yargs-parser";
const argv = processArgv(process.argv.slice(2));
module.exports = function(fileInfo: FileInfo, api: API, options: {name: string}) {
  options = { ...options, ...argv };
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  root.get().node.program.body.unshift(`import ${options.name} from './ducks/${options.name}'`);
  root
    .find(j.ExportDefaultDeclaration)
    .forEach((dec: any) =>
      dec.value.declaration.properties.push(
        j.property("init", j.identifier(options.name), j.identifier(options.name))
      )
    );
  return root.toSource();
};
module.exports.parser = "typescript";
