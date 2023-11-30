/**
 * @file strategy-average.ts
 * @class AverageStrategy
 */

import { ICell } from "../interfaces/cell-interface";
import { IStrategy } from "../interfaces/strategy-interface";
import { ErrorDisplays } from "./cell-data-errors-enum";
import { AExpressionStrategy } from "./strategy-abstract-expression";

/**
 * Represents a strategy for parsing an AVERAGE range expression
 */
export class AverageStrategy extends AExpressionStrategy implements IStrategy {
  // The cells grid that the average is to be taken from
  private otherCells: ICell[][];

  /**
   * Constructs an average strategy from the provided cells grid, row and column
   * @param otherCells the cells grid that the average is to be taken from
   * @param row the row of the cell being parsed
   * @param col the column of the cell being parsed
   */
  public constructor(otherCells: ICell[][], row: number, col: number) {
    // Call the super constructor to set up an AVERAGE range expression
    super("AVERAGE", row, col);

    this.otherCells = otherCells;
  }

  /**
   * Replace all instances of AVERAGE(__) with the resulting value
   * @param currentValue the display value as parsed so far
   * @returns the display value with the average range expressions replaced
   */
  public parse(currentValue: string): string {
    // Split the input on "AVERAGE("
    let sections: string[] = this.splitInput(currentValue);

    // For every instance of "AVERAGE(", replace it with the value of the average
    let combinedValue = sections[0];
    sections.splice(0, 1);
    sections.forEach((element) => {
      combinedValue += this.evaluate(element);
    });

    // Return the display value with the average range expressions replaced
    return combinedValue;
  }

  /**
   * Find the result of the first AVERAGE expression remaining and put that result in the display value
   * @param reference the portion of the display value so far beginning with this AVERAGE expression's cells
   * @returns the display value after replacing this instance of AVERAGE
   */
  private evaluate(reference: string): string {
    // Find the location of the close parenthesis that ends the AVERAGE
    const index = reference.indexOf(")");

    // If there isn't a close parenthesis, throw an error
    if (index === -1) {
      throw new Error(ErrorDisplays.INVALID_RANGE_EXPR);
    }

    // Split into the range expression and the rest of the display value
    const firstPart = reference.slice(0, index);
    const secondPart = reference.slice(index + 1);
    let splitSections: string[] = [firstPart, secondPart];

    // Get the values of the cells in the range
    let values: string[] = this.resolveRange(splitSections[0], this.otherCells);

    // Find the average of the cells in the reange
    let sum: number = this.addRangeValues(values);
    let average: number = sum / values.length;

    // If the average results in a non-numerical answer, throw an error
    if (isNaN(average)) {
      throw new Error(ErrorDisplays.INVALID_RANGE_EXPR);
    }

    // Else, return the display value chunk with the AVERAGE value filled in
    return average + splitSections[1];
  }
}
