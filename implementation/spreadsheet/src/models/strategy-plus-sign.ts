/**
 * @file strategy-plus-sign.ts
 * @class PlusSignStrategy
 */

import { IStrategy } from "../interfaces/strategy-interface";

/**
 * Represents a strategy for parsing an + string concatenation
 */
export class PlusSignStrategy implements IStrategy {
  // The characters that are legal if the remaining display value is an aritmetic formula
  private formulaCharacters: Array<string> = [
    "+",
    "-",
    "*",
    "^",
    "/",
    ")",
    "(",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    " ",
    ".",
  ];

  /**
   * Perform all instances of the + operator that are string concatenations and not the 
   * @param currentValue the display value as parsed so far
   * @returns the display value with the string concat applied
   */
  public parse(currentValue: string): string {
    // Create an array with each value of the given string being seperated into an array position
    const inputArray = Array.from(currentValue);

    // Check if the given string contains any characters that are not in the formulaCharacters
    // array. If it does, that means it cannot be a formula, so remove all instances of + because
    // that is concatenating strings
    for (const char of inputArray) {
      const index = this.formulaCharacters.indexOf(char);
      if (index === -1) {
        return currentValue.replace(/\+/g, "");
      }
    }

    // Return the display value with string concatenation applied
    return currentValue;
  }
}
