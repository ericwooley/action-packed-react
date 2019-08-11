export interface color {
  (str: string): string;
}
export const {green, grey, blue, red}: { green: color; grey: color; blue: color, red: color } = require("chalk");

