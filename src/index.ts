import babelParser from "prettier/parser-babel";
import typescriptParser from "prettier/parser-typescript";
import { parse } from "@babel/parser";
import generate from "@babel/generator";
import traverse from "@babel/traverse";
import * as t from "@babel/types";

// Fix for ESM compatibility with @babel/traverse and @babel/generator
const babelTraverse = (traverse as any).default || traverse;
const babelGenerate = (generate as any).default || generate;

const SPECIAL_ATTRS = ["key", "ref"];

function sortJSXAttributes(
  attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[]
) {
  const result: (t.JSXAttribute | t.JSXSpreadAttribute)[] = [];
  let buffer: t.JSXAttribute[] = [];

  const flush = () => {
    const specialAttrs = buffer.filter(
      (a) => t.isJSXIdentifier(a.name) && SPECIAL_ATTRS.includes(a.name.name)
    );

    const normalAttrs = buffer
      .filter(
        (a) => t.isJSXIdentifier(a.name) && !SPECIAL_ATTRS.includes(a.name.name)
      )
      .sort((a, b) => {
        const nameA = t.isJSXIdentifier(a.name) ? a.name.name : "";
        const nameB = t.isJSXIdentifier(b.name) ? b.name.name : "";
        return nameA.localeCompare(nameB);
      });

    result.push(...specialAttrs, ...normalAttrs);
    buffer = [];
  };

  for (const attr of attributes) {
    if (t.isJSXSpreadAttribute(attr)) {
      flush();
      result.push(attr);
    } else {
      buffer.push(attr);
    }
  }

  flush();
  return result;
}

function sortJSXAttributesInText(code: string): string {
  const ast = parse(code, {
    sourceType: "module",
    plugins: ["typescript", "jsx"],
  });

  babelTraverse(ast, {
    JSXOpeningElement(path: any) {
      path.node.attributes = sortJSXAttributes(path.node.attributes);
    },
  });

  const output = babelGenerate(ast, {
    retainLines: true,
    jsescOption: { minimal: true },
  }).code;
  return output;
}

function customPreprocess(code: string) {
  try {
    return sortJSXAttributesInText(code);
  } catch (err) {
    console.warn("[prettier-plugin-jsx-attr-sort] Parsing error:", err);
    return code;
  }
}

export const parsers = {
  babel: {
    ...babelParser.parsers.babel,
    preprocess: customPreprocess,
  },
  typescript: {
    ...typescriptParser.parsers.typescript,
    preprocess: customPreprocess,
  },
};
