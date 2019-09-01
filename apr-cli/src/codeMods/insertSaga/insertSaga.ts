import { API, FileInfo, ExportDeclaration, Identifier, ImportDeclaration, ArrayExpression } from "jscodeshift";
import processArgv from "yargs-parser";
// let describe = require("jscodeshift-helper").describe;

const argv = processArgv(process.argv.slice(2));
module.exports = function(fileInfo: FileInfo, api: API, options: { name: string }) {
  options = { ...options, ...argv };
  const j = api.jscodeshift;
  const root = j(fileInfo.source);
  root.get().node.program.body.unshift(`import { ${options.name} } from './${options.name}'`);
  const callImports = root.find(j.ImportDeclaration).filter(findCallImports);
  const callWasImported = !!callImports.length;
  if (!callWasImported) {
    root
      .find(j.ImportDeclaration)
      .filter(isReduxSagaImporter)
      .forEach(d => d.node.specifiers.push(j.importSpecifier(j.identifier("call"))));
  }
  root
    .find(j.FunctionDeclaration)
    .filter(isRootSaga)
    .forEach(s =>
      j(s)
        .find(j.CallExpression)
        .filter((e: any) => {
          return e.node.callee.name === "all";
        })
        .forEach(e => {
          const firstArg: ArrayExpression = e.node.arguments[0] as ArrayExpression || j.arrayExpression([])
          firstArg.elements.push(`call(${options.name})` as any);
        })
    );
  return root.toSource();
};
module.exports.parser = "typescript";

const isReduxSagaImporter = (d: any) => {
  try {
    return d.node.source.value === "redux-saga/effects";
  } catch (e) {
    return false;
  }
};
const findCallImports = (d: any) => {
  try {
    if (isReduxSagaImporter(d)) {
      return d.node.specifiers.find((specifier: any) => {
        return specifier.imported.name === "call";
      });
    }
  } catch (e) {
    return false;
  }
};

const isRootSaga = (d: any) => {
  try {
    return d.node.id.name === "rootSaga";
  } catch (e) {
    return false;
  }
};

const isAll = (d: any) => {
  try {
    return d.node.id.name === "all";
  } catch (e) {
    return false;
  }
};
