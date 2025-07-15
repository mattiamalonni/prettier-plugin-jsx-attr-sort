import { parse, ParserOptions } from "@babel/parser";

import traverse from "@babel/traverse";
import generate from "@babel/generator";

import { PrettierOptions } from "./types";
import { sortJSXAttributes } from "./utils/sort-jsx-attributes";

const babelTraverse = (traverse as any).default || traverse;
const babelGenerate = (generate as any).default || generate;

export default function preprocessor(code: string, _options?: PrettierOptions) {
  const parserOptions: ParserOptions = {
    sourceType: "module",
    attachComment: true,
    plugins: ["typescript", "jsx"],
  };

  let ast: ReturnType<typeof parse>;

  try {
    ast = parse(code, parserOptions);
  } catch (err) {
    console.warn(" [error] [prettier-plugin-jsx-attr-sort] Parsing error:", err);
    return code;
  }

  babelTraverse(ast, {
    JSXOpeningElement(path: any) {
      path.node.attributes = sortJSXAttributes(path.node.attributes);
    },
  });

  return babelGenerate(ast).code;
}
