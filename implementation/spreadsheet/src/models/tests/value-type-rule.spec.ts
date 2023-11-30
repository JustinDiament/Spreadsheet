/**
 * @file value-type-rule.spec.ts
 * @testing ValueTypeRule
 */

import { ErrorDisplays } from "../cell-data-errors-enum";
import { ValueTypeRule } from "../value-type-rule";

// Tests for the "value type" rule type
describe("Value type rule", (): void => {
  // Test that any text values are allowed if the type is word
  it("should allow values of the specified type (string)", () => {
    // Set up a word value type rule
    const rule = new ValueTypeRule("word");

    // Check that a string is accepted by the rule
    const isValid = rule.checkRule("hello");
    expect(isValid).toBe(true);
  });

  // Test that numerical values are allowed if the type is num
  it("should allow values of the specified type (num)", () => {
    // Set up a num value type rule
    const rule = new ValueTypeRule("num");

    // Check that a numerical value is accepted by the rule
    const isValid = rule.checkRule("15");
    expect(isValid).toBe(true);
  });

  // Test that non-numerical values are not allowed by num value type rules
  it("should not allow values of a different type", () => {
    // Set up a num value type rule
    const rule = new ValueTypeRule("num");

    // Check that a non-numerical value is not accepted by the rule
    const isValid = rule.checkRule("hello");
    expect(isValid).toBe(false);
  });

  // Test that the proper error is thrown on an invalid value type rule type
  it("should throw an error on an invalid type", () => {
    // Set up a value type rule with an invalid type
    const rule = new ValueTypeRule("numnum");

    // Check that attempting to use the rule results in throwing the proper error
    expect(() => {
      rule.checkRule("hello");
    }).toThrow(ErrorDisplays.INVALID_CELL_DATA);
  });

  // Test that empty strings (empty cells) pass as numerical cell data
  it("should handle edge case with an empty string and a number rule", () => {
    // Set up a num value type rule
    const rule = new ValueTypeRule("num");

    // Check that an empty string passes the rule even though it isn't strictly a number
    const isValid = rule.checkRule("");
    expect(isValid).toBe(true);
  });

  // Test that empty strings (empty cells) pass as word cell data
  it("should handle edge case with an empty string and a string rule", () => {
    // Set up a word value type rule
    const rule = new ValueTypeRule("word");

    // Check that an empty string passes the rule
    const isValid = rule.checkRule("");
    expect(isValid).toBe(true);
  });

  // Test that the getValue getter returns the right value for this value rule type
  it("should return the proper value via the getter", () => {
    // Set up a value type rule
    const rule = new ValueTypeRule("num");

    // Test the value getter
    expect(rule.getType()).toBe("num");
  });

  // Test that the getErrorMessage getter gets the right error message for this value type method
  it("should handle large numbers", () => {
    // Set up a value type rule
    const rule = new ValueTypeRule("word");

    // Test the error message getter
    expect(rule.getErrorMessage()).toBe(ErrorDisplays.INVALID_CELL_DATA);
  });
});
