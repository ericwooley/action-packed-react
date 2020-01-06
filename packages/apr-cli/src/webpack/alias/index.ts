const srcPath = require("../utils/srcPath");
export default (env: string, alias: any) => ({
  ...alias,
  app: srcPath(""),
  src: srcPath(""),
  webtorrent: 'webtorrent/webtorrent.min'
});
