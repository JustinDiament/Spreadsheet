/**
 * @file strategy-abstract-expression.ts
 * @class AExpressionStrategy
 */

import { ICell } from "../interfaces/cell-interface";
import { IStrategy } from "../interfaces/strategy-interface";
import { ErrorDisplays } from "./cell-data-errors-enum";
import { Util } from "./util";

/**
 * Represents a strategy for parsing a portion of the cell data of the form "code(___)"
 */
export abstract class AExpressionStrategy implements IStrategy {
  // The identifier that the strategy is looking for, such as "SUM"
  private code: string;

  // The row of the cell being parsed
  protected row: number;

  // The column of the cell being parsed
  protected col: number;

  /**
   * Constructs a strategy from the provided code, row and column
   * @param code the identifier that the strategy is looking for, such as "REF"
   * @param row the row of the cell being parsed
   * @param col the column of the cell being parsed
   */
  constructor(code: string, row: number, col: number) {
    this.code = code;
    this.row = row;
    this.col = col;
  }

  /**
   * Returns an updated string with the current strategy's simplification complete
   * @param currentValue the display value so far to be modified further by this strategy
   * @returns the display value after being parsed and modified by this strategy
   */
  public abstract parse(currentValue: string): string;

  /**
   * Splits the given value on the code plus an open parenthesis to find what the cells are
   * inside the parenthesis
   * @param currentValue the value to be split
   * @returns an array of the split value
   */
  protected splitInput(currentValue: string): string[] {
    return currentValue.split(this.code + "(");
  }

  /**
   * Returns the sum of all the values in an array
   * @param values the array to be summmed
   * @returns the sume of the values in the array
   */
  protected addRangeValues(values: string[]): number {
    let combinedValue: number = 0;
    values.forEach((element) => {
      combinedValue += Number(element);
    });

    return combinedValue;
  }

  /**
   * Creates and returns an array of the values in the range for this expression
   * @param inputs the text representing the range 
   * @param otherCells the cell grid that the range represents cells from
   * @returns a string array of the display values of the cells in the range
   */
  protected resolveRange(inputs: string, otherCells: ICell[][]): string[] {
    // Split parameters inside the range on '..' to get the start and the end of the range
    let splitInputs: string[] = inputs.split("..");

    // Get the row and column of the start of the range
    let locationStart: Array<number> = Util.getIndicesFromLocation(
      splitInputs[0]
    );

    // Get the row and column of the end of the range
    let locationEnd: Array<number> = Util.getIndicesFromLocation(
      splitInputs[1]
    );

    // Create an empty array to hold the values from the range
    let values: string[] = [];

    // If the range end is before the start, throw an error
    if (
      locationStart[1] > locationEnd[1] ||
      locationStart[0] > locationEnd[0]
    ) {
      throw new Error(ErrorDisplays.INVALID_RANGE_EXPR);
    }

    // If the location is beyond the spreadsheet bounds, throw an error
    if (
      locationEnd[1] >= otherCells.length ||
      locationEnd[0] >= otherCells[0].length ||
      locationStart[1] < 0 ||
      locationStart[0] < 0
    ) {
      throw new Error(ErrorDisplays.REFERENCE_OUT_OF_RANGE);
    }

    // Loop through the values in the range
    for (let i = locationStart[1]; i <= locationEnd[1]; i++) {
      for (let j = locationStart[0]; j <= locationEnd[0]; j++) {
        // If the cell with the expression in it is included in the range, throw an 
        // error due to creating an infinate loop
        if (this.row === i && this.col === j) {
          throw new Error(ErrorDisplays.REFERENCE_TO_SELF);
        }

        // Otherwise, add the cell's display value to the array of values in the range 
        // and also denote that that cell is being observed by the original cell
        let refCell: ICell = otherCells[i][j];
        let thisCell: ICell = otherCells[this.row][this.col];
        refCell.attachObserver(thisCell);
        values.push(refCell.getDisplayValue());
      }
    }
    return values;
  }
}
