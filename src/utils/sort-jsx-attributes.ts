import { isJSXIdentifier, isJSXSpreadAttribute, JSXAttribute, JSXSpreadAttribute } from "@babel/types";

const SPECIAL_ATTRS = ["key", "ref"];

export function sortJSXAttributes(attributes: (JSXAttribute | JSXSpreadAttribute)[]) {
  const result: (JSXAttribute | JSXSpreadAttribute)[] = [];
  let buffer: JSXAttribute[] = [];

  const flush = () => {
    const specialAttrs = buffer
      .filter((a) => isJSXIdentifier(a.name) && SPECIAL_ATTRS.includes(a.name.name))
      .sort((a, b) => {
        const nameA = isJSXIdentifier(a.name) ? a.name.name : "";
        const nameB = isJSXIdentifier(b.name) ? b.name.name : "";
        return SPECIAL_ATTRS.indexOf(nameA) - SPECIAL_ATTRS.indexOf(nameB);
      });

    const normalAttrs = buffer
      .filter((a) => isJSXIdentifier(a.name) && !SPECIAL_ATTRS.includes(a.name.name))
      .sort((a, b) => {
        const nameA = isJSXIdentifier(a.name) ? a.name.name : "";
        const nameB = isJSXIdentifier(b.name) ? b.name.name : "";
        return nameA.localeCompare(nameB);
      });

    result.push(...specialAttrs, ...normalAttrs);
    buffer = [];
  };

  for (const attr of attributes) {
    if (isJSXSpreadAttribute(attr)) {
      flush();
      result.push(attr);
    } else {
      buffer.push(attr);
    }
  }

  flush();
  return result;
}
