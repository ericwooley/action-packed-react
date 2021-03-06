jest.autoMockOff();
import { readFile } from "../../__testUtils__/readFIle";
const transform = require("../insertDuck");
const { defineInlineTest } = require("jscodeshift/dist/testUtils");
defineInlineTest(
  transform,
  { name: "test" },
  readFile(__dirname, "../__fixtures__/importEmpty.in"),
  readFile(__dirname, "../__fixtures__/importEmpty.out"),
  "empty -> test duck"
);

defineInlineTest(
  transform,
  { name: "test2" },
  readFile(__dirname, "../__fixtures__/importNonEmpty.in"),
  readFile(__dirname, "../__fixtures__/importNonEmpty.out"),
  "test -> test2 duck"
);
