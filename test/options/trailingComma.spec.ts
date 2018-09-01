import { newUnibeautify, Beautifier } from "unibeautify";
import beautifier from "../../src";
import * as fs from "fs";
import * as path from "path";
import { raw } from "../utils";
const filePath: string = path.resolve(__dirname, "../fixtures/test.ts");
test(`should place a comma at the end of the typescript object`, () => {
  const unibeautify = newUnibeautify();
  unibeautify.loadBeautifier(beautifier);
  const text: string = fs
    .readFileSync(path.resolve(__dirname, `../fixtures/test1.ts`))
    .toString();
  return unibeautify
    .beautify({
      filePath,
      languageName: "TypeScript",
      options: {
        TypeScript: {
          end_with_comma: true,
        } as any,
      },
      text,
    })
    .then(results => {
      expect(raw(results)).toMatchSnapshot();
    });
});
