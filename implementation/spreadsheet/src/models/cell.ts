import { ACell } from "../interfaces/cell-abstract-class";
import { ACellData } from "../interfaces/cell-data-abstract-class";
import { IValidationRule } from "../interfaces/validation-rule-interface";
import { CellDataComposite } from "./cell-data-composite";
import { NumericalCellData } from "./numerical-cell-data";
import { RangeExpressionCellData } from "./range-expression-cell-data";
import { ReferenceCellData } from "./reference-cell-data";
import { StringCellData } from "./string-cell-data";


/**
 * Represents a spreadsheet cell
 */
export class Cell extends ACell{
    /**
     * The unique ID number of this cell
     */
    //private id: number;

    /**
     * The data contained by this cell
     */
    private cellData: ACellData; 

    constructor() {
        super();
        this.cellData = new StringCellData("");
    }
    
    /**
     * Clear the content of the cell
     */
    public clearCell(): void {
    }

    /**
     * Replaces the content of a cell 
     * @param newValue the new content ot the cell
     */
    public editCell(newValue: string, grid: Array<Array<ACell>>): void {
        console.log("editcell");

        let split = newValue.split(" "); 

        if (split.length == 1) {
            this.cellData = this.determineCellDataType(split[0], grid);
        }
        else {
            // TODO actually loop here
            this.cellData = this.determineCellDataType(split[0], grid);
        }
    }

    private determineCellDataType(data: string, grid: Array<Array<ACell>>): ACellData {
        if (data.slice(0, 3) == "REF") {
            // here, make a cell reference cell data
            // in the event the reference is malformed (like parenthesis are missing, the thing between the parens is not a number, etc),
            // that will be handled by the cell reference data type, which will set its display value to an error message
            return new ReferenceCellData(data, grid);
        }
        else if (data.slice(0, 3) == "SUM" || data.slice(0, 3) == "AVG") {
            // range expression cell data
            // same deal as the reference data in terms of error messages 
            return new RangeExpressionCellData(data);
        }
        else if (!isNaN(parseFloat(data))) {
            // numerical cell data
            // this one doesn't really have error conditions
            return new NumericalCellData(parseFloat(data));
        }
        else {
            // otherwise, it's just a string 
            return new StringCellData(data);
        }
    }

    /**
     * Returns the true content of the cell in string form 
     * @returns what has been typed into the cell
     */
    public getCellContent(): string {
        return this.cellData.getData();
    }

    /**
     * Returns what the cell displays
     * @returns the display value of the cell
     */
    public getCellDisplay(): string {
        return this.cellData.getDisplayValue();
    }

    /**
     * Adds a validation rule to this cell 
     * @param rule the rule to add to this cell
     * @returns the display value of the cell
     */
    public createRule(rule: IValidationRule) : string{
        return "";
    }

    /**
     * Removes a validation rule from this cell 
     * @param rule the rule to remove from this cell
     * @returns the display value of the cell
     */
    public removeRule(rule: IValidationRule):string {
        return "";
    }

    /**
     * Determines whether the math in the cell is a calculation or 
     * concatenation and performs it, updating the display value accordingly
     */
    public calculateOrConcatenate(): void {
    }
}