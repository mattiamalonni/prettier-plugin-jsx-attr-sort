import { parsers as babelParsers } from "prettier/parser-babel";
import { parsers as typescriptParsers } from "prettier/parser-typescript";
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
    ...babelParsers.babel,
    preprocess: mergePreprocess(babelParsers.babel.preprocess),
  },
  typescript: {
    ...typescriptParsers.typescript,
    preprocess: mergePreprocess(typescriptParsers.typescript.preprocess),
  },
  "babel-ts": {
    ...babelParsers["babel-ts"],
    preprocess: mergePreprocess(babelParsers["babel-ts"].preprocess),
  },
};
