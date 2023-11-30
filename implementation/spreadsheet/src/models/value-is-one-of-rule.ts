/**
 * @file value-is-one-of-rule.ts
 * @class ValueIsOneOf
 */

import { IValidationRule } from "../interfaces/validation-rule-interface";
import { ErrorDisplays } from "./cell-data-errors-enum";

/**
 * Represents a data validation rule about if the data in the cell is one of a set number of options
 */
export class ValueIsOneOfRule implements IValidationRule {
  /**
   * The set of values for the cell that it must be one of in order to be valid
   */
  private values: Array<string | number>;

  constructor(values: Array<string | number>) {
    this.values = values;
  }

  /**
   * Is the cell data this rule is applied to valid or invalid according to the rule?
   * @param cellData the data in a cell to be tested
   * @return true if the data is valid, false if it is not
   */
  public checkRule(cellData: string): boolean {
    // Check if cellData is in the set of allowed values or if it is empty
    if (cellData !== "" && cellData !== " ") {
      let numericValue: number = Number(cellData);
      //if value is a number also check that the number version of the cell data
      if (!isNaN(numericValue)) {
        return (
          this.values.includes(cellData) ||
          this.values.includes(numericValue) ||
          cellData === null
        );
      } else {
        return (
          this.values.includes(cellData) || cellData === " " || cellData === ""
        );
      }
    } else {
      return true;
    }
  }

  /**
   * Provides the error message to display for this rule
   * @returns the correct error message to display
   */
  public getErrorMessage(): string {
    return ErrorDisplays.INVALID_CELL_DATA;
  }

  /**
   * Gets the values that the cell data must be in order to be valid
   * @returns the values that the cell data must be in order to be valid
   */
  public getValues(): Array<string | number> {
    return this.values;
  }
}
