export interface color {
  (str: string): string;
}
export const {green, grey, blue}: { green: color; grey: color; blue: color } = require("chalk");

