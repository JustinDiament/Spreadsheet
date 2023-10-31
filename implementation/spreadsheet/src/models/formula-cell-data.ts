import { ACellData } from "../interfaces/cell-data-abstract-class";

/**
 * Represents a mathematical formula in a cell
 */
export class FormulaCellData extends ACellData {

    /**
     * The mathematical formula as entered by the user
     */
    //private data: string

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