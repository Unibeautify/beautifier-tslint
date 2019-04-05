import {
  Beautifier,
  Language,
  BeautifierBeautifyData,
  DependencyType,
  NodeDependency,
} from "unibeautify";
import * as readPkgUp from "read-pkg-up";
import * as tmp from "tmp";
import * as fs from "fs";
import { Configuration, IOptions } from "tslint";
import { IConfigurationFile } from "tslint/lib/configuration";

import options from "./options";

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
      return Promise.resolve({ config });
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
    const configuration =
      (beautifierConfig && beautifierConfig.config) || linterOptions;
    return tmpFile({ postfix: ".ts" }).then(filePath =>
      writeFile(filePath, text).then(() => {
        linter.lint(filePath, text, configuration);
        const result = linter.getResult();
        if (result.fixes && result.fixes.length > 0) {
          return readFile(filePath);
        } else {
          return Promise.resolve(text);
        }
      })
    );
  },
};

function tmpFile(options: tmp.FileOptions): Promise<string> {
  return new Promise<string>((resolve, reject) =>
    tmp.file(
      {
        prefix: "unibeautify-",
        ...options,
      },
      (err, path, fd) => {
        if (err) {
          return reject(err);
        }
        return resolve(path);
      }
    )
  );
}

function writeFile(filePath: string, contents: string): Promise<void> {
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, contents, error => {
      if (error) {
        return reject(error);
      }
      return resolve();
    });
  });
}

function readFile(filePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (error, data) => {
      if (error) {
        return reject(error);
      }
      return resolve(data.toString());
    });
  });
}

export default beautifier;
