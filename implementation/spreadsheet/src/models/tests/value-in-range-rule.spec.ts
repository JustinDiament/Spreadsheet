/**
 * @file value-in-range-rule.spec.ts
 * @testing ValueInRangeRule
 */

import { ErrorDisplays } from "../cell-data-errors-enum";
import { ValueInRangeRule } from "../value-in-range-rule";

// Tests for Value in Range rules
describe("Value in Range Rule", (): void => {
  // Check that numerical values equal to the chosen value are allowed for equal rules
  it('should allow values that are equal to the specified value when the rule is "equal"', () => {
    // Set up an equality rule
    const rule = new ValueInRangeRule("equal", 5);

    // Test that the rule allows for the number it is set for
    const isValid = rule.checkRule("5");
    expect(isValid).toBe(true);
  });

  // Check that numerical values that are the negative version of the allowed value for equals are not accepted
  it('should handle the case where numbers being compared are negative and positive when the rule is "equal"', () => {
    // Set up an equality rule
    const rule = new ValueInRangeRule("equal", -5);

    // Test that the rule does not allow for the inverse of the number it is set for
    const isValid = rule.checkRule("5");
    expect(isValid).toBe(false);
  });

  // Check that numerical values close but not equal to the specified value for equals are not accepted
  it('should not allow values that are not equal to the specified value when the rule is "equals"', () => {
    // Set up an equality rule
    const rule = new ValueInRangeRule("equal", 5);

    // Test that the rule does not allow for close values to the number it is set for
    const isValid = rule.checkRule("5.5");
    expect(isValid).toBe(false);
  });

  // Check that numerical values less than the given number are allowed for "less" rules
  it('numbers less than the given number are allowed when the rule is "less"', () => {
    // Set up a less than rule
    const rule = new ValueInRangeRule("less", -5);

    // Test that the rule allows for a lesser value
    const isValid = rule.checkRule("-6");
    expect(isValid).toBe(true);
  });

  // Check that numerical values equal to the given number are not allowed for "less" rules
  it('numbers equal to than the given number are not allowed when the rule is "less"', () => {
    // Set up a less than rule
    const rule = new ValueInRangeRule("less", -5);

    // Test that the rule does not allow for an equal value
    const isValid = rule.checkRule("-5");
    expect(isValid).toBe(false);
  });

  // Check that numerical values greater than the given number are not allowed for "greater" rules
  it('numbers greater to than the given number are not allowed when the rule is "less"', () => {
    // Set up a less than rule
    const rule = new ValueInRangeRule("less", -5);

    // Test that the rule does not allow for an greater values
    const isValid = rule.checkRule("-4");
    expect(isValid).toBe(false);
  });

  // Check that numerical values greater than the given number are allowed for "greater" rules
  it('numbers greater than the given number are allowed when the rule is "greater"', () => {
    // Set up a greater than rule
    const rule = new ValueInRangeRule("greater", 7.7);

    // Test that the rule allows for an greater values
    const isValid = rule.checkRule("7.777");
    expect(isValid).toBe(true);
  });

  // Check that numerical values equal to the given number are not allowed for "greater" rules
  it('numbers equal to the given number are not allowed when the rule is "greater"', () => {
    // Set up a greater than rule
    const rule = new ValueInRangeRule("greater", 0);

    // Test that the rule does not allow for an equal value
    const isValid = rule.checkRule("0");
    expect(isValid).toBe(false);
  });

  // Check that numerical values less than the given number are not allowed for "greater" rules
  it("should handle large numbers", () => {
    // Set up a greater than rule
    const rule = new ValueInRangeRule("greater", 1000000);

    // Test that the rule does not allow for a lesser value
    const isValid = rule.checkRule("999999");
    expect(isValid).toBe(false);
  });

  // Check that if the cell contains non-numerical data, an error is thrown
  it("should throw an error on text cell data", () => {
    // Set up a greater than rule
    const rule = new ValueInRangeRule("greater", 10);

    // Check that the proper error is thrown when the cell contains non-numerical data
    expect(() => {
      rule.checkRule("hello");
    }).toThrow(ErrorDisplays.INVALID_CELL_DATA);
  });

  // Check that if the rule is set up with a nonexistant mode, the proper error is thrown
  it("should throw error on nonexistant rule mode", () => {
    // Set up a rule with a bad mode
    const rule = new ValueInRangeRule("greaterthanorequals", 10);

    // Check that the proper error is thrown on trying to use the rule
    expect(() => {
      rule.checkRule("10");
    }).toThrow(ErrorDisplays.INVALID_CELL_DATA);
  });

  // Test that the getComparison getter returns the right comparison method
  it("should return the proper comparison via the getter", () => {
    // Set up a greater than rule
    const rule = new ValueInRangeRule("greater", 10);

    // Test the rule type getter
    expect(rule.getComparison()).toBe("greater");
  });

  // Test that the getValue getter returns the right value for this comparison
  it("should return the proper value via the getter", () => {
    // Set up a greater rule
    const rule = new ValueInRangeRule("greater", 10);

    // Test the value getter
    expect(rule.getValue()).toBe(10);
  });

  // Test that the getErrorMessage getter gets the right error message for this comparison method
  it("should handle large numbers", () => {
    // Set up a greater than rule
    const rule = new ValueInRangeRule("greater", 10);

    // Test the error message getter
    expect(rule.getErrorMessage()).toBe(ErrorDisplays.INVALID_CELL_DATA);
  });
});