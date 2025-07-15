import { describe, it, expect } from "vitest";
import preprocessor from "../src/preprocessor";

describe("JSX Attribute Sorting", () => {
  it("should sort attributes alphabetically while preserving spread attributes", () => {
    const input = '<div c="c" b="b" {...props1} z="z" a="a" {...props2} q="q" m="m" />';
    const expected = '<div b="b" c="c" {...props1} a="a" z="z" {...props2} m="m" q="q" />;';

    const result = preprocessor(input);
    expect(result).toBe(expected);
  });

  it("should handle key and ref attributes with priority", () => {
    const input = '<Component onClick={handler} className="test" ref={myRef} key="item-1" disabled />';
    const expected = '<Component key="item-1" ref={myRef} className="test" disabled onClick={handler} />;';

    const result = preprocessor(input);
    expect(result).toBe(expected);
  });

  it("should handle components with no attributes", () => {
    const input = "<div></div>";
    const expected = "<div></div>;";

    const result = preprocessor(input);
    expect(result).toBe(expected);
  });

  it("should handle self-closing components with mixed attributes", () => {
    const input = '<img src="test.jpg" alt="Test" className="image" width={100} height={200} />';
    const expected = '<img alt="Test" className="image" height={200} src="test.jpg" width={100} />;';

    const result = preprocessor(input);
    expect(result).toBe(expected);
  });

  it("should preserve spread attributes position and sort around them", () => {
    const input = '<div z="last" {...spread1} b="second" a="first" {...spread2} y="end" />';
    const expected = '<div z="last" {...spread1} a="first" b="second" {...spread2} y="end" />;';

    const result = preprocessor(input);
    expect(result).toBe(expected);
  });

  it("should handle complex JSX with nested components", () => {
    const input = `
      <div className="container" id="main">
        <Button onClick={handleClick} disabled={false} type="submit" className="btn">
          Click me
        </Button>
      </div>
    `;

    const result = preprocessor(input);

    // Check that div attributes are sorted
    expect(result).toContain('<div className="container" id="main">');
    // Check that Button attributes are sorted
    expect(result).toContain('<Button className="btn" disabled={false} onClick={handleClick} type="submit">');
  });

  it("should handle special attributes in correct order", () => {
    const input = '<div ref={divRef} onClick={handler} key="test-key" className="test" />';
    const expected = '<div key="test-key" ref={divRef} className="test" onClick={handler} />;';

    const result = preprocessor(input);
    expect(result).toBe(expected);
  });

  it("should handle boolean attributes", () => {
    const input = '<input disabled checked type="checkbox" name="test" />';
    const expected = '<input checked disabled name="test" type="checkbox" />;';

    const result = preprocessor(input);
    expect(result).toBe(expected);
  });
});
