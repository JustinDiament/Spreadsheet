import { ICellStyle } from "./cell-style-interface";
import { IValidationRule } from "./validation-rule-interface";

/**
 * Represents a spreadsheet cell
 */
export interface ICell {
    
   

    getRow(): number;
    

    getColumn(): number;

    setRow(row: number): void;

    setColumn(col: number): void;

    /**
     * Returns the true content of the cell in string form 
     * @returns what has been typed into the cell
     */
    getEnteredValue(): string;

    /**
     * Returns what the cell displays
     * @returns the display value of the cell
     */
    getDisplayValue(): string;

    attachObserver(observer:ICell) : void;

    detachObserver(observer:ICell) : void;

    attachObserving(observing:ICell):void;

    detachObserving(observing:ICell):void;

    isObserving(observing:ICell) :boolean;

    /**
     * Parses the entered value and evaluates the validation rules to update the display value
     * @param cells
     */
    updateDisplayValue(cells: Array<Array<ICell>>): void;

    /**
     * Replaces the content of a cell 
     * @param newValue the new content ot the cell
     */
    setEnteredValue(newValue: string): void;

    /**
     * Clear the content of the cell
     */
    clearCell(): void;

    /**
     * Finds and replaces a string in the enterred value of the cell
     * @param find the value to find
     * @param replace the value to replace the found value in
     */
    findReplace(find: string, replace: string): void;

    /**
     * Adds the provided rule to this Cell's list of rules
     * @param rule the rule to be added
     */
    addRule(rule : IValidationRule): void;

    /**
     * Removes the provided rule from this Cell's list of rules if the list contains it
     * @param rule the rule to be removed
     */
    removeRule(rule : IValidationRule): void;

    /**
     * 
     * @returns this Cell's validation rules
     */
    getRules(): Array<IValidationRule>;

    /**
     * 
     * @returns the style applied to this cell
     */
    getStyle(): ICellStyle;

    /**
     * Apply a new style to this cell
     * @param newStyle the new style to apply to this cell
     */
    setStyle(newStyle: ICellStyle): void;

}