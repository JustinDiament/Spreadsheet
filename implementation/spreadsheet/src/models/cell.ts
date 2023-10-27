import { ACell } from "../interfaces/cell-abstract-class";
import { ACellData } from "../interfaces/cell-data-abstract-class";
import { IValidationRule } from "../interfaces/validation-rule-interface";


/**
 * Represents a spreadsheet cell
 */
export class Cell extends ACell{
    /**
     * The unique ID number of this cell
     */
    private id: number;

    /**
     * The data contained by this cell
     */
    private cellData: ACellData; 
    
    /**
     * Clear the content of the cell
     */
    public clearCell(): void {
    }

    /**
     * Replaces the content of a cell 
     * @param newValue the new content ot the cell
     */
    public editCell(newValue: string): void {
    }

    /**
     * Returns the true content of the cell in string form 
     * @returns what has been typed into the cell
     */
    public getCellContent(): string {
        return "";
    }

    /**
     * Returns what the cell displays
     * @returns the display value of the cell
     */
    public getCellDisplay(): string {
        return "";
    }

    /**
     * Adds a validation rule to this cell 
     * @param rule the rule to add to this cell
     * @returns the display value of the cell
     */
    public createRule(rule: IValidationRule) {
        return "";
    }

    /**
     * Removes a validation rule from this cell 
     * @param rule the rule to remove from this cell
     * @returns the display value of the cell
     */
    public removeRule(rule: IValidationRule) {
    }

    /**
     * Determines whether the math in the cell is a calculation or 
     * concatenation and performs it, updating the display value accordingly
     */
    public calculateOrConcatenate(): void {
    }
}