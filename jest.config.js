"use strict";

module.exports = {
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    "^.+\\.jsx?$": "babel-jest"
  },
  testRegex: "test/.+\\.(test|spec)\\.ts$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "html"]
};