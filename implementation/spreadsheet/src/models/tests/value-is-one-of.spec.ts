/**
 * @file value-in-one-of.spec.ts
 * @testing ValueIsOneOfRule
 */

import { ErrorDisplays } from "../cell-data-errors-enum";
import { ValueIsOneOfRule } from "../value-is-one-of-rule";

// Tests for the "is one of" rule type
describe("Value is one of", (): void => {
  // Test that a value in the allowed values set is allowed by a "is one of" rule
  it("should allow values that are numbers in the specified set", () => {
    // Set up an "is one of" rule
    const rule = new ValueIsOneOfRule([5, 10, 15]);

    // Test that the rule allows the number in the set
    const isValid = rule.checkRule("5");
    expect(isValid).toBe(true);
  });

  // Test that a value not in the allowed values set is not allowed by a "is one of" rule
  it("should not allow values that are not in the specified set", () => {
    // Set up an "is one of" rule
    const rule = new ValueIsOneOfRule([
      "oneallowed",
      "twoallowed",
      "threeallowed",
    ]);

    // Test that the rule does not allow the string not in the set
    const isValid = rule.checkRule("notallowed");
    expect(isValid).toBe(false);
  });

  // Test that a set where there are no values rejects all values (as opposed to accepting everything)
  it("should handle edge case with an empty set and reject any value", () => {
    // Set up an "is one of" rule with nothing legal
    const rule = new ValueIsOneOfRule([]);

    // Test that a value is not accepted by the rule
    const isValid = rule.checkRule("anyValue");
    expect(isValid).toBe(false);
  });

  // Test that an empty cell is always allowed by an "is one of" rule
  it("should handle edge case with an empty set and reject any value", () => {
    // Set up an "is one of" rule with nothing legal
    const rule = new ValueIsOneOfRule([]);

    // Test that an empty string is still allowed
    const isValid = rule.checkRule("");
    expect(isValid).toBe(true);
  });

  // Test that the getValue getter returns the right value for this comparison
  it("should return the proper value via the getter", () => {
    // Set up a greater rule
    const allowedVals = [5, 10, 15];
    const rule = new ValueIsOneOfRule(allowedVals);

    // Test the value getter
    expect(rule.getValues()).toBe(allowedVals);
  });

  // Test that the getErrorMessage getter gets the right error message for this comparison method
  it("should handle large numbers", () => {
    // Set up a greater than rule
    const rule = new ValueIsOneOfRule([5, 10, 15]);

    // Test the error message getter
    expect(rule.getErrorMessage()).toBe(ErrorDisplays.INVALID_CELL_DATA);
  });
});
