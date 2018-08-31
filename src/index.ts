import {
  Beautifier,
  Language,
  BeautifierBeautifyData,
  DependencyType,
  NodeDependency,
} from "unibeautify";
import * as readPkgUp from "read-pkg-up";
import options from "./options";
import { Configuration, IOptions } from "tslint";
import { IConfigurationFile } from "tslint/lib/configuration";
import * as fs from "fs";

const { pkg } = readPkgUp.sync({ cwd: __dirname });
export const beautifier: Beautifier = {
  name: "TSLint",
  package: pkg,
  dependencies: [
    {
      type: DependencyType.Node,
      name: "TSLint",
      package: "tslint",
      homepageUrl: "https://palantir.github.io/tslint/",
      installationUrl: "https://github.com/palantir/tslint",
      bugsUrl: "https://github.com/palantir/tslint/issues",
      badges: [],
    },
  ],
  options: {
    TypeScript: options.TypeScript,
  },
  resolveConfig: ({ filePath }) => {
    if (!filePath) {
      return Promise.resolve({});
    }
    const config = Configuration.findConfiguration(null, filePath).results;
    try {
      return Promise.resolve({config});
    } catch (error) {
      // tslint:disable-next-line:no-console
      console.error(error);
      return Promise.resolve({});
    }
  },
  beautify({
    text,
    options,
    filePath,
    projectPath,
    dependencies,
    beautifierConfig,
  }: BeautifierBeautifyData) {
    return new Promise<string>((resolve, reject) => {
      const { Linter } = dependencies.get<NodeDependency>("TSLint").package;
      const linter = new Linter({
        fix: true,
        formatter: "prose",
      });
      const linterRules = new Map<string, Partial<IOptions>>();
      Object.keys(options).forEach(key => {
        linterRules.set(key, options[key]);
      });
      const linterOptions: IConfigurationFile = {
        rulesDirectory: [],
        extends: [],
        rules: linterRules,
        jsRules: new Map<string, Partial<IOptions>>(),
      };
      const configuration = (beautifierConfig && beautifierConfig.config) || linterOptions;
      linter.lint("temp.ts", text, configuration);
      const result = linter.getResult();
      if (result.fixes && result.fixes.length > 0) {
        const fixedText = fs.readFileSync("temp.ts", "utf8");
        fs.unlinkSync("temp.ts");
        return resolve(fixedText);
      } else {
        return resolve(text);
      }
    });
  },
};
export default beautifier;
