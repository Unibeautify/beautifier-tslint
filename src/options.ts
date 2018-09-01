import { BeautifierOptions } from "unibeautify";

const options: BeautifierOptions = {
  TypeScript: {
    "arrow-parens": [
      ["arrow_parens"],
      (options): boolean | undefined => {
        switch (options.arrow_parens) {
          case "always":
            return true;
          default:
            return false;
        }
      },
    ],
    "trailing-comma": [
      ["end_with_comma"],
      (options): any => {
        switch (options.end_with_comma) {
          case true:
            return {
              ruleArguments: [{"singleline": "always", "multiline": "always"}],
            };
          default:
            return false;
        }
      },
    ],
  },
};

export default options;
