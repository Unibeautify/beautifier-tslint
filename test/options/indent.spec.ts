import { newUnibeautify, Beautifier } from "unibeautify";
import beautifier from "../../src";

test.skip(`should successfully beautify JavaScript text with a space`, () => {
  const unibeautify = newUnibeautify();
  unibeautify.loadBeautifier(beautifier);
  const text = `function test(n) {\n\treturn n + 1;\n}`;
  const beautifierResult = `function test(n) {\n  return n + 1;\n}`;
  return unibeautify
    .beautify({
      languageName: "TypeScript",
      options: {
        TypeScript: {
          indent_style: "space",
        },
      },
      text,
    })
    .then(results => {
      expect(results).toBe(beautifierResult);
    });
});