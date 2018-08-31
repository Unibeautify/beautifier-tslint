import { newUnibeautify, Beautifier } from "unibeautify";
import beautifier from "../../src";
test(`should successfully beautify TypeScript text with arrowParens`, () => {
  const unibeautify = newUnibeautify();
  unibeautify.loadBeautifier(beautifier);
  const text = `a.then(foo => {});`;
  const beautifierResult = `a.then((foo) => {});`;
  return unibeautify
    .beautify({
      languageName: "TypeScript",
      options: {
        TypeScript: {
          arrow_parens: "always",
        },
      },
      text,
    })
    .then(results => {
      expect(results).toBe(beautifierResult);
    });
});
