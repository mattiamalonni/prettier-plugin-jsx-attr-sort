import babelParser from "prettier/parser-babel";
import typescriptParser from "prettier/parser-typescript";
import preprocessor from "./preprocessor";

function mergePreprocess(originalPreprocess?: (code: string, options?: any) => string) {
  return (code: string, options?: any) => {
    const codeAfterOriginal = originalPreprocess ? originalPreprocess(code, options) : code;
    const codeAfterSort = preprocessor(codeAfterOriginal);
    return codeAfterSort;
  };
}

export const parsers = {
  babel: {
    ...babelParser.parsers.babel,
    preprocess: mergePreprocess(babelParser.parsers.babel.preprocess),
  },
  typescript: {
    ...typescriptParser.parsers.typescript,
    preprocess: mergePreprocess(typescriptParser.parsers.typescript.preprocess),
  },
  "babel-ts": {
    ...babelParser.parsers["babel-ts"],
    preprocess: mergePreprocess(babelParser.parsers["babel-ts"].preprocess),
  },
};
