/**
 * @file strategy-cell-ref.ts
 * @class CellRefStrategy
 */

import { IStrategy } from "../interfaces/strategy-interface";
import { AExpressionStrategy } from "./strategy-abstract-expression";
import { Util } from "./util";
import { ErrorDisplays } from "./cell-data-errors-enum";
import { ICell } from "../interfaces/cell-interface";

/**
 * Represents a strategy for parsing a reference to another cell
 */
export class CellRefStrategy extends AExpressionStrategy implements IStrategy {
  // The cells grid that the average is to be taken from
  private otherCells: ICell[][];

  /**
   * Constructs a cell reference strategy from the provided cells grid, row and column
   * @param otherCells the cells grid that the average is to be taken from
   * @param row the row of the cell being parsed
   * @param col the column of the cell being parsed
   */
  public constructor(otherCells: ICell[][], row: number, col: number) {
    // Call the super constructor to set up cell reference with REF
    super("REF", row, col);
    this.otherCells = otherCells;
  }

  /**
   * Replace all instances of REF(__) with the resulting value
   * @param currentValue the display value as parsed so far
   * @returns the display value with the cell references replaced
   */
  public parse(currentValue: string): string {
    // Split the input on "REF("
    let sections: string[] = this.splitInput(currentValue);
    let combinedValue = sections[0];

    // For every instance of "REF(", replace it with the value of the average
    sections.splice(0, 1);
    sections.forEach((element) => {
      combinedValue += this.evaluate(element);
    });

    // Return the display value with the refs replaced
    return combinedValue;
  }

  /**
   * Find the result of the first REF cell reference remaining and put that result in the display value
   * @param reference the portion of the display value so far beginning with this reference
   * @returns the display value after replacing this instance of REF
   */
  private evaluate(reference: string): string {
    // Find the location of the close parenthesis that ends the AVERAGE
    const index = reference.indexOf(")");

    // If there isn't a close parenthesis, throw an error
    if (index === -1) {
      throw new Error(ErrorDisplays.INVALID_CELL_REFERENCE);
    }

    // Split into the range expression and the rest of the display value
    const firstPart = reference.slice(0, index);
    const secondPart = reference.slice(index + 1);
    let splitSections: string[] = [firstPart, secondPart];

    // Get the value of the referenced cell and put it before the rest of the display value
    let resolvedReference = this.resolveReference(splitSections[0]);
    return resolvedReference + splitSections[1];
  }

  /**
   * Determine the display value of a referenced cell
   * @param cellCode the text for what cell is being referenced
   * @returns the display value of the referenced cell
   */
  private resolveReference(cellCode: string): string {
    // Break out the cell being referenced from the user's typed text
    let referenceSections: string[] = cellCode.split(/(\d+)/);
    
    // If they did not format correctly (such as missing a closing parenthesis
    // or something besides a cell name inside it, throw an error)
    if (referenceSections.length < 2) {
      throw new Error(ErrorDisplays.INVALID_CELL_REFERENCE);
    }

    // Get the row/col location from this cell name
    let location: Array<number> = Util.getIndicesFromLocation(cellCode);

    // If the cell being referenced is the cell that REF is typed in, throw an 
    // error for self-reference
    if (location[1] === this.row && location[0] === this.col) {
      throw new Error(ErrorDisplays.REFERENCE_TO_SELF);
    }

    // If the location is beyond the spreadsheet bounds, throw an error
    if (
      location[1] >= this.otherCells.length ||
      location[0] >= this.otherCells[0].length ||
      location[1] < 0 ||
      location[0] < 0
    ) {
      throw new Error(ErrorDisplays.REFERENCE_OUT_OF_RANGE);
    }

    // If there is a reference loop resulting in a self-reference, throw an error
    if (
      this.otherCells[location[1]][location[0]].isObserving(
        this.otherCells[this.row][this.col]
      )
    ) {
      throw new Error(ErrorDisplays.REFERENCE_TO_SELF);
    }

    // Set up observation of the referenced cell to respond to any changes to it 
    let refCell: ICell = this.otherCells[location[1]][location[0]];
    let thisCell: ICell = this.otherCells[this.row][this.col];
    refCell.attachObserver(thisCell);
    
    // Return the display value of the referenced cell and 
    return refCell.getDisplayValue();
  }
}
