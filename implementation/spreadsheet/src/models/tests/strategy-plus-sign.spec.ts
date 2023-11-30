/**
 * @file strategy-plus-sign.spec.ts
 * @testing PlusSignStrategy
 */

import { IStrategy } from "../../interfaces/strategy-interface";
import { PlusSignStrategy } from "../strategy-plus-sign";

// Test the plus sign concatenation strategy
describe("Plus Sign Strategy", (): void => {
  // A plus sign strategy object to use for all tests
  let strategy: IStrategy;

  // Initialize the object before every test
  beforeEach(() => {
    strategy = new PlusSignStrategy();
  });

  // Check that two strings can be concatenated, including their trailing/leading spaces
  it("should concatenate 2 strings", (): void => {
    // Set up the concatenation
    let originalString = "one + two";
    let parsedString = strategy.parse(originalString);

    // Check for the expected result including spacing
    expect(parsedString).toBe("one  two");
  });

  // Check that a number can be concatenated with a string
  it("should concatenate 1 string with 1 number", (): void => {
    // Set up the concatenation
    let originalString = "one+2";
    let parsedString = strategy.parse(originalString);

    // Check for the expected result including lack of spacing
    expect(parsedString).toBe("one2");
  });

  // Check that a bunch of strings of varying spacing can be concatenated
  it("should add more than two strings", (): void => {
    // Set up the concatenation
    let originalString = "a + b + c +d+e";
    let parsedString = strategy.parse(originalString);

    // Check for the expected result including varying spacing
    expect(parsedString).toBe("a  b  c de");
  });

  // Check that this strategy does not concatenate numbers if they are a math/arithmetic expression
  it("should not concatenate numbers", (): void => {
    // Set up the concatenation
    let originalString = "1 + 2 + 3 + 4 + 5";
    let parsedString = strategy.parse(originalString);

    // Check that the numbers were not concatenated
    expect(parsedString).toBe("1 + 2 + 3 + 4 + 5");
  });
});
