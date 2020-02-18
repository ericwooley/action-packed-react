import { join } from "path";
const projectSrc = join(process.cwd(), "src");

export default (env: string) => [
  {
    id: "typescript",
    priority: 100,
    test: /\.tsx?$/,
    loader: require.resolve("babel-loader"),
    include: [projectSrc],
    options: require("../babel.config")
  },
  {
    id: "js-source-maps",
    priority: 110,
    test: /\.js$/,
    use: [require.resolve("source-map-loader")],
    enforce: "pre"
  }
];
