import babelParser from "prettier/parser-babel";
import { parse } from "@babel/parser";
import * as t from "@babel/types";

type BabelParser = typeof babelParser.parsers.babel;

const SPECIAL_ATTRS = ["key", "ref"];

function sortJSXAttributes(
  attributes: (t.JSXAttribute | t.JSXSpreadAttribute)[]
): (t.JSXAttribute | t.JSXSpreadAttribute)[] {
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
      result.push(attr); // keep spread in place
    } else {
      buffer.push(attr);
    }
  }

  flush();
  return result;
}

function traverse(node: t.Node): void {
  if (t.isJSXOpeningElement(node)) {
    node.attributes = sortJSXAttributes(node.attributes);
  }

  for (const key in node) {
    const child = (node as any)[key];
    if (Array.isArray(child)) {
      child.forEach((c) => {
        if (c && typeof c.type === "string") traverse(c);
      });
    } else if (
      child &&
      typeof child === "object" &&
      typeof child.type === "string"
    ) {
      traverse(child);
    }
  }
}

export const parsers: Record<string, BabelParser> = {
  babel: {
    ...babelParser.parsers.babel,
    preprocess(text: string) {
      try {
        const ast = parse(text, {
          sourceType: "module",
          plugins: ["jsx", "typescript"],
        });

        traverse(ast.program);
      } catch (err) {
        console.warn("Failed to parse JSX:", err);
      }

      return text;
    },
  },
};
