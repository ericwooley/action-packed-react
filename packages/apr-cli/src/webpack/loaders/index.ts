import debug from "debug";
import typescript from "./defaults/typescript";
import css from "./defaults/css";
const log = debug("apr:webpack");

export default (env: string) => {
  const result = [typescript, css]
    .map(loader => loader(env))
    .flat()
    .sort((a, b) => {
      if (a.priority < b.priority) {
        return -1;
      }
      if (a.priority > b.priority) {
        return 1;
      }
      // a must be equal to b
      return 0;
    })
    .map(({ id, priority, ...loader }) => loader)
    .reduce((allLoaders, newLoaders) => {
      return [...allLoaders, newLoaders];
    }, []);
  log("loaders: ", result);
  return result;
};
