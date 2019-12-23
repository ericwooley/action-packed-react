import debug from "debug";
const log = debug("apr:webpack");
let tailwind = false;
try {
  tailwind = require("tailwindcss");
} catch (e) {
  log("tailwindcss not installed", e);
}
export default (env: string) =>
  [
    env !== "storybook" && {
      id: "css",
      priority: 200,
      test: /\.css$/i,
      use: ["style-loader", "css-loader"]
    },
    {
      loader: "postcss-loader",
      test: /\.css$/i,
      options: {
        ident: "postcss",
        plugins: [tailwind, require("autoprefixer")].filter(loader => !!loader)
      }
    }
  ].filter(loader => !!loader);
