import { BeautifierOptions } from "unibeautify";
const options: BeautifierOptions = {
  TypeScript: {
    // Waiting on https://github.com/palantir/tslint/issues/2814
    // indent: [
    //   ["indent_style"],
    //   (options): (string | boolean | number | undefined)[] => {
    //     switch (options.indent_style) {
    //       case "space":
    //         return [true, "spaces", 2];
    //       case "tab":
    //         return [true, "tabs", 1];
    //       default:
    //         return [];
    //     }
    //   }
    // ],
    "arrow-parens": [
      ["arrow_parens"],
      (options): boolean | undefined => {
        switch (options.arrow_parens) {
          case "always":
            return true;
          default:
            return false;
        }
      }
    ]
  }
};
export default options;