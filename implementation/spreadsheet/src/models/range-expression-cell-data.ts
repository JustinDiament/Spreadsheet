import { ACellData } from "../interfaces/cell-data-abstract-class";
import { IExpressionType } from "../interfaces/expression-type-interface";

/**
 * Represents a range expression contained in a cell
 */
export class RangeExpressionCellData extends ACellData {

    /**
     * The range expression as entered by the user
     */
    //private data: string

    /**
     * An object of the expression type of this range expression
     */
    //private expressionType: IExpressionType

    /**
     * Replaces the text content of this ACellData 
     * @param data the new text contained in this cell data
     */
    public setData(data: string): void {
    }

    /**
     * Returns the text contained in the cell data, as entered by the user
     * @return the text contained the cell 
     */
    public getData(): string {
        return "";
    }

    /**
     * Returns the display value of the text in the cell data (for instance, 
     * 5+3 has a dispaly value of 8)
     * @return the display value of the cell 
     */
    public getDisplayValue(): string {
        return "";
    }
}