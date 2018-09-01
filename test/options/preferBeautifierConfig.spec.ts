import { newUnibeautify, Beautifier } from "unibeautify";
import beautifier from "../../src";
import * as fs from "fs";
import * as path from "path";
import { raw } from "../utils";
const filePath: string = path.resolve(
  __dirname,
  "../fixtures/preferBeautifierConfig/test2.ts"
);
test(`should place a comma at the end of the typescript object`, () => {
  const unibeautify = newUnibeautify();
  unibeautify.loadBeautifier(beautifier);
  const text: string = fs
    .readFileSync(
      path.resolve(__dirname, `../fixtures/preferBeautifierConfig/test2.ts`)
    )
    .toString();
  return unibeautify
    .beautify({
      filePath,
      languageName: "TypeScript",
      options: {
        TypeScript: {
          TSLint: {
            prefer_beautifier_config: true,
          },
        } as any,
      },
      text,
    })
    .then(results => {
      expect(raw(results)).toMatchSnapshot();
    });
});
