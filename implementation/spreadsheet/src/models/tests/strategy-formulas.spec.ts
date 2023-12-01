/**
 * @file strategy-formulas.spec.ts
 * @testing StrategyFormulas
 */

import { IStrategy } from "../../interfaces/strategy-interface";
import { ErrorDisplays } from "../cell-data-errors-enum";
import { StrategyFormulas } from "../strategy-formulas";

// Test the formula strategy
describe("Formula Strategy", (): void => {
  // A formula strategy object to use for all tests
  let strategy: IStrategy;

  // Initialize the formula object before every test
  beforeEach(() => {
    strategy = new StrategyFormulas();
  });

  // Test adding values in a formula
  it("should add two values", (): void => {
    // Set up the formula
    let originalString = "1 + 2";
    let parsedString = strategy.parse(originalString);

    // Check for the expected evaluated result
    expect(parsedString).toBe("3");
  });

  // Test subtracting values in a formula
  it("should subtract two values", (): void => {
    // Set up the formula
    let originalString = "1 - 2";
    let parsedString = strategy.parse(originalString);

    // Check for the expected evaluated result
    expect(parsedString).toBe("-1");
  });

  // Test multiplying values in a formula
  it("should multiply two values", (): void => {
    // Set up the formula
    let originalString = "5 * 2";
    let parsedString = strategy.parse(originalString);

    // Check for the expected evaluated result
    expect(parsedString).toBe("10");
  });

  // Test dividing values in a formula
  it("should divide two values", (): void => {
    // Set up the formula
    let originalString = "5 / 2";
    let parsedString = strategy.parse(originalString);

    // Check for the expected evaluated result
    expect(parsedString).toBe("2.5");
  });

  // Test exponentiation in a formula
  it("should exponentiate two values", (): void => {
    // Set up the formula
    let originalString = "5 ^ 2";
    let parsedString = strategy.parse(originalString);

    // Check for the expected evaluated result
    expect(parsedString).toBe("25");
  });

  // Test order of operations with multiple operation in a formula
  it("should perform all operations", (): void => {
    // Set up the formula
    let originalString = "5 ^ 2 + 8 * (2 - 7)";
    let parsedString = strategy.parse(originalString);

    // Check for the expected evaluated result
    expect(parsedString).toBe("-15");
  });

  // Test that a malformed formula with text in it throws the proper error
  it("should error due to text in the formula", (): void => {
    // Set up the malformed formula
    let originalString = "5 ^ 2 + 8 * (2 - hello)";

    // Check that the formula throws the proper error
    expect(() => {
      strategy.parse(originalString);
    }).toThrow(ErrorDisplays.INVALID_FORMULA);
  });

  // Test that a malformed formula with an illegal symbol order throws the proper error
  it("should error due to malformed formula with too many symbols", (): void => {
    // Set up the malformed formula
    let originalString = "5 ^^^ 2 + 8 * (2 - 5)";

    // Check that the formula throws the proper error
    expect(() => {
      strategy.parse(originalString);
    }).toThrow(ErrorDisplays.INVALID_FORMULA);
  });

  // Test that a value containing no reserved formula characters is returned as-is
  it("should not apply any formula at all", (): void => {
    // Set up the non-formula
    let originalString = "hello bye 5";
    let parsedString = strategy.parse(originalString);

    // Check for the expected evaluated result
    expect(parsedString).toBe("hello bye 5");
  });
});
