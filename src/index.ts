import { Beautifier, Language, BeautifierBeautifyData } from "unibeautify";
import * as readPkgUp from "read-pkg-up";
import options from "./options";
import { Linter, Configuration, IOptions } from "tslint";
import { IConfigurationFile, parseConfigFile } from "tslint/lib/configuration";
import * as fs from "fs";
const { pkg } = readPkgUp.sync({ cwd: __dirname });
export const beautifier: Beautifier = {
  name: "TSLint",
  package: pkg,
  options: {
    TypeScript: options.TypeScript,
  },
  beautify(data: BeautifierBeautifyData) {
    return new Promise<string>((resolve, reject) => {
      // Create new linter
      const linter = new Linter({
        fix: true,
        formatter: "prose"
      });
      // Pass options into the rules
      const linterRules = new Map<string, Partial<IOptions>>();
      Object.keys(data.options).forEach(key => {
        linterRules.set(key, data.options[key]);
      });
      // Create configuration object for lint method
      const linterOptions: IConfigurationFile = {
        rulesDirectory: [],
        extends: [],
        rules: linterRules,
        jsRules: new Map<string, Partial<IOptions>>()
      };
      // Call lint method and get result
      linter.lint("temp.ts", data.text, linterOptions);
      const result = linter.getResult();
      // Resolve text from temp.ts (if there were fixable errors) or resolve original text
      if (result.fixes && result.fixes.length > 0) {
        const text = fs.readFileSync("temp.ts", "utf8");
        fs.unlinkSync("temp.ts");
        return resolve(text);
      } else {
        return resolve(data.text);
      }
    });
  },
};
export default beautifier;