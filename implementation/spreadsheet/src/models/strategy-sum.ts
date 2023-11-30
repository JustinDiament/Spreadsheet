/**
 * @file strategy-sumy.ts
 * @class SumStrategy
 */

import { ICell } from "../interfaces/cell-interface";
import { IStrategy } from "../interfaces/strategy-interface";
import { ErrorDisplays } from "./cell-data-errors-enum";
import { AExpressionStrategy } from "./strategy-abstract-expression";

/**
 * Represents a strategy for parsing a SUM range expression
 */
export class SumStrategy extends AExpressionStrategy implements IStrategy {
  // The cells grid that the average is to be taken from
  private otherCells: ICell[][];

  /**
   * Constructs an average strategy from the provided cells grid, row and column
   * @param otherCells the cells grid that the average is to be taken from
   * @param row the row of the cell being parsed
   * @param col the column of the cell being parsed
   */
  public constructor(otherCells: ICell[][], row: number, col: number) {
    super("SUM", row, col);
    this.otherCells = otherCells;
  }

  /**
   * Replace all instances of SUM(__) with the resulting value
   * @param currentValue the display value as parsed so far
   * @returns the display value with the average range expressions replaced
   */
  public parse(currentValue: string): string {
    // Split the input on "SUM("
    let sections: string[] = this.splitInput(currentValue);

    // For every instance of "SUM(", replace it with the value of the sum
    let combinedValue = sections[0];
    sections.splice(0, 1);
    sections.forEach((element) => {
      combinedValue += this.evaluate(element);
    });

    // Return the display value with the average range expressions replaced
    return combinedValue;
  }

  /**
   * Find the result of the first SUM expression remaining and put that result in the display value
   * @param reference the portion of the display value so far beginning with this SUM expression's cells
   * @returns the display value after replacing this instance of SUM
   */
  private evaluate(reference: string): string {
    // Find the location of the close parenthesis that ends the AVERAGE
    const index = reference.indexOf(")");

    // If there isn't a close parenthesis, throw an error
    if (index === -1) {
      throw new Error(ErrorDisplays.INVALID_RANGE_EXPR);
    }

    // Split into the range expression and the rest of the
    const firstPart = reference.slice(0, index);
    const secondPart = reference.slice(index + 1);

    // Get the values of the cells in the range
    let splitSections: string[] = [firstPart, secondPart];

    // Find the average of the cells in the reange
    let values: string[] = this.resolveRange(splitSections[0], this.otherCells);

    let sum = this.addRangeValues(values);

    // If the average results in a non-numerical answer, throw an error
    if (isNaN(sum)) {
      throw new Error(ErrorDisplays.INVALID_RANGE_EXPR);
    }

    // Else, return the display value chunk with the AVERAGE value filled in
    return sum + splitSections[1];
  }
}
