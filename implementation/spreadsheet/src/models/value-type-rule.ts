/**
 * @file value-type-rule.ts
 * @class ValueTypeRule
 */

import { IValidationRule } from "../interfaces/validation-rule-interface";
import { ErrorDisplays } from "./cell-data-errors-enum";

/**
 * Represents a data validation rule about the type the data in a cell is allowed to be
 */
export class ValueTypeRule implements IValidationRule {
  /**
   * The type that the data in the cell needs to be in order to be valid
   */
  private type: string;

  constructor($type: string) {
    this.type = $type;
  }

  /**
   * Is the cell data this rule is applied to valid or invalid according to the rule?
   * @param cellData the data in a cell to be tested
   * @return true if the data is valid, false if it is not
   */
  public checkRule(cellData: string): boolean {
    //if type is supposed to be a number
    if (this.type === "num") {
      return !isNaN(Number(cellData));
      //if type is supposed to be a string
    } else if (this.type === "word") {
      return typeof cellData === "string";
    } 
    // If the type is not recognized, consider it invalid
    else {
      throw new Error(ErrorDisplays.INVALID_CELL_DATA);
    }
  }

  /**
   * Gets the type of validation that this rule applies
   * @returns the type of validation that this rule applies
   */
  public getType(): string {
    return this.type;
  }

  /**
   * Provides the error message to display for this rule
   * @returns the correct error message to display
   */
  public getErrorMessage(): string {
    return ErrorDisplays.INVALID_CELL_DATA;
  }
}
