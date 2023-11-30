/**
 * @file cell.ts
 * @class Cell
 */

import { ICell } from "../interfaces/cell-interface";
import { ICellStyle } from "../interfaces/cell-style-interface";
import { IStrategy } from "../interfaces/strategy-interface";
import { IValidationRule } from "../interfaces/validation-rule-interface";
import { ErrorDisplays } from "./cell-data-errors-enum";
import { CellStyle } from "./cell-style";
import { AverageStrategy } from "./strategy-average";
import { CellRefStrategy } from "./strategy-cell-ref";
import { StrategyFormulas } from "./strategy-formulas";
import { PlusSignStrategy } from "./strategy-plus-sign";
import { SumStrategy } from "./strategy-sum";

/**
 * Represents a spreadsheet cell
 */
export class Cell implements ICell {
  /**
   * The data contained by this cell
   */
  private enteredValue: string;

  /**
   * The data being displayed by this cell
   */
  private displayValue: string;

  /**
   * A list of validation rules being applied to this cell
   */
  private validationRules: IValidationRule[];

  /**
   * The row that this cell occupies in the spreadsheet
   */
  private row: number;

  /**
   * The column that this cell occupies in the spreadsheet
   */
  private col: number;

  /**
   * The style to be applied to the text inside of this cell
   */
  private style: ICellStyle;

  /**
   * The list of cells observing this cell (OTHERS)
   */
  private observers: Array<ICell>;

  /**
   * The list of cells this cell is observing (MINE)
   */
  private observing: Array<ICell>;

  /**
   * Create a new empty cell
   */
  public constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.enteredValue = "";
    this.displayValue = "";
    this.validationRules = [];
    this.style = new CellStyle();
    this.observers = [];
    this.observing = [];
  }

  /**
   * Gets the row this cell occupies
   * @returns the row this cell occupies
   */
  public getRow(): number {
    return this.row;
  }

  /**
   * Gets the column this cell occupies
   * @returns the column this cell occupies
   */
  public getColumn(): number {
    return this.col;
  }

  /**
   * Sets the row this cell occupies. This is used to check for self-references among other things.
   * @param row the row this cell occupies in the spreadsheet
   */
  public setRow(row: number): void {
    this.row = row;
  }

  /**
   * Sets the column this cell occupies. This is used to check for self-references among other things.
   * @param col the column this cell occupies in the spreadsheet
   */
  public setColumn(col: number): void {
    this.col = col;
  }

  /**
   * Returns the true content of the cell in string form
   * @returns what has been typed into the cell
   */
  public getEnteredValue(): string {
    return this.enteredValue;
  }

  /**
   * Returns what the cell displays
   * @returns the display value of the cell
   */
  public getDisplayValue(): string {
    return this.displayValue;
  }

  /**
   * Add the provided ICell to the list of ICells observing this ICell if it is not already in the list
   * And add this ICell to the other ICell's list of ICells it is observing
   * @param observer the ICell observing this ICell
   */
  public attachObserver(observer: ICell): void {
    //check if the observer is already attached
    if (!this.observers.includes(observer)) {
      this.observers.push(observer);
      observer.attachObserving(this);
    }
  }

  /**
   * Remove the provided ICell to the list of ICells observing this ICell if it is in the list
   * And removes this ICell from the other ICell's list of ICells it is observing
   * @param observer the ICell observing this ICell
   */
  public detachObserver(observer: ICell): void {

    let index: number = this.observers.indexOf(observer);
    //verify that the index exists / the observer given is one of the observers
    if (index > -1) {
      this.observers.splice(index, 1);
      observer.detachObserving(this);
    }
  }

  /**
   * Add the provided ICell to the list of ICells this ICell is observing if it is not already in the list
   * @param observing the ICell this ICell is observing
   */
  public attachObserving(observing: ICell): void {
    //check that we are not duplicating observers
    if (!this.observing.includes(observing)) {
      this.observing.push(observing);
    }
  }

  /**
   * Remove the provided ICell to the list of ICells this ICell is observing if it is in the list
   * @param observing the ICell this ICell is observing
   */
  public detachObserving(observing: ICell): void {
    let index: number = this.observing.indexOf(observing);
    //verify that the index exists / the observer given is one of the observers
    if (index > -1) {
      this.observing.splice(index, 1);
    }
  }

  /**
   * Is this ICell observing the provided ICell directly and/or indirectly through the ICells it is observing?
   * @param observing the ICell this ICell is looking for
   * @returns true if this ICell is observing the provided ICell directly or indirectly, false otherwise
   */
  public isObserving(observing: ICell): boolean {
    let isObserving = this.observing.includes(observing);
    //check for indirect observation
    if (!isObserving) {
      this.observing.forEach(
        (element: ICell) =>
          (isObserving = isObserving || element.isObserving(observing))
      );
    }
    return isObserving;
  }

  /**
   * Parses the entered value of this ICell and evaluates the display value of this ICell,
   * checking for any input errors
   * @param cells the grid of ICells this ICell is using to calculate the value of any references
   */
  public updateDisplayValue(cells: Array<Array<ICell>>): void {
    
    this.observing.forEach((observed: ICell) =>
      observed.detachObserver(this)
    );
    //the strategies represent the ways that we will parse the entered value to create the display value
    let strategies: Array<IStrategy> = [
      new CellRefStrategy(cells, this.row, this.col),
      new AverageStrategy(cells, this.row, this.col),
      new SumStrategy(cells, this.row, this.col),
      new PlusSignStrategy(),
      new StrategyFormulas(),
    ];
    let currentString: string = this.enteredValue;

    try {
      //iterate through the full list of strategies
      for (let i: number = 0; i < strategies.length; i++) {
        let strategy = strategies[i];
        currentString = strategy.parse(currentString);
        let noObservingError = true;
        //check that an error has not been encountered
        this.observing.forEach(
          (element: ICell) =>
            (noObservingError =
              noObservingError &&
              !(Object.values(ErrorDisplays) as any).includes(
                element.getDisplayValue()
              ))
        );
        if (!noObservingError) {
          currentString = ErrorDisplays.INVALID_CELL_REFERENCE;
          break;
        }
      }
    } catch (error) {
      if (error instanceof Error) currentString = error.message;
    }
    // Need this so an update actually occurs if its empty
    
    this.displayValue = currentString;
    //check the cell against each of the validation rules that has been applied to it
    for (const rule of this.validationRules) {
      if (!rule.checkRule(this.displayValue)) {
        this.displayValue = rule.getErrorMessage();
        break; // This will exit the loop when the condition is met
      }
    }
    //update the display value of each observer as any reference to this cell will need to be updated
    this.observers.forEach((observer: ICell) =>
      observer.updateDisplayValue(cells)
    );
  }

  /**
   * Replaces the content of a cell
   * @param newValue the new content ot the cell
   */
  public setEnteredValue(newValue: string) {
    this.enteredValue = newValue;
  }

  /**
   * Clear the content of the cell
   */
  public clearCell(): void {
    this.enteredValue = "";
    this.displayValue = "";
  }

  /**
   * Finds and replaces a string in the enterred value of the cell
   * @param find the value to find
   * @param replace the value to replace the found value in
   */
  public findReplace(find: string, replace: string): void {
    //check if the entered value cntains the value we are trying to find
    if (this.enteredValue.includes(find)) {
      //split the value into sections based on the string we are trying to find
      let sections: string[] = this.enteredValue.split(new RegExp(`(${find})`));
      //for each section if it is the value we are finding, replace it with the new value
      for (let i = 0; i < sections.length; i++) {
        if (sections[i] === find) {
          sections[i] = replace;
        }
      }
      //recombine the sections of the value and update the stored entered value
      let combinedString: string = sections.join("");
      this.setEnteredValue(combinedString);
    }
  }

  /**
   * Adds the provided rule to this Cell's list of rules
   * @param rule the rule to be added
   */
  public addRule(rule: IValidationRule): void {
    let contains:boolean = false;
    // check if this rule already exists for this cell
    this.validationRules.forEach((currRule:IValidationRule) => {
      contains = contains || (JSON.stringify(currRule) === JSON.stringify(rule));
    })
    // if the rule doesn't already exist, add it
    !contains && this.validationRules.push(rule);
  }

  /**
   * Removes the provided rule from this Cell's list of rules if the list contains it
   * @param rule the rule to be removed
   */
  public removeRule(rule: IValidationRule): void {
    this.validationRules = this.validationRules.filter((r) => r !== rule);
  }

  /**
   * Retrieves a list of the rules that have been applied to the cell
   * @returns this Cell's validation rules
   */
  public getRules(): Array<IValidationRule> {
    return this.validationRules;
  }

  /**
   * Returns the current styles applied to the cell
   * @returns the style applied to this cell
   */
  public getStyle(): ICellStyle {
    return this.style;
  }

  /**
   * Apply a new style to this cell
   * @param newStyle the new style to apply to this cell
   */
  public setStyle(newStyle: ICellStyle): void {
    this.style = newStyle;
  }
}
