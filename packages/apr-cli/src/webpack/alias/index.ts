const srcPath = require("../utils/srcPath");
export default (env: string, alias: any) => ({
  ...alias,
  app: srcPath(""),
  src: srcPath(""),
  fs: 'empty'
});
