/**
 * @file strategy-formulas.ts
 * @class StrategyFormulas
 */

import { IStrategy } from "../interfaces/strategy-interface";
import { evaluate } from "mathjs";
import { ErrorDisplays } from "./cell-data-errors-enum";

/**
 * Represents a strategy for parsing an arithmetic formula
 */
export class StrategyFormulas implements IStrategy {
  // The reserved characters that indicate that the cell is a formula cell
  private formulaCharacters: Array<string> = ["+", "-", "*", "^", "/"];

  // The characters that are legal if the remaining display value is an aritmetic formula
  private legalCharacters: Array<string> = [
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
   * Evaluates the cell as a formula if it is a formula cell
   * @param currentValue the display value as parsed so far
   * @returns the display value with formula eval applied, if it was a formula cell
   */
  public parse(currentValue: string): string {
    // If the cell contains any reserved formula characters, evaluate it as a formula
    if (this.formulaCharacters.some((char) => currentValue.includes(char))) {
      // Check to make sure the cell only contains legal formula characters 
      // (numbers, operation symbols, etc.)
      let inputSet: Set<string> = new Set(currentValue);
      let legal: boolean = true;
      inputSet.forEach(
        (char) => (legal = legal && this.legalCharacters.includes(char))
      );

      // If it doesn't, throw an error
      if (!legal) {
        throw new Error(ErrorDisplays.INVALID_FORMULA);
      }

      // Attempt to evaluate the remaining display value as a formula. 
      // If it fails, throw an error.
      try {
        return evaluate(currentValue).toString();
      } catch {
        throw new Error(ErrorDisplays.INVALID_FORMULA);
      }
    }

    // If there are no reserved formula characters, return the current display value as is
    return currentValue;
  }
}
