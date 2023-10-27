import { ACellData } from "../interfaces/cell-data-abstract-class";

/**
 * Represents a composite of different types of cell data in a cell
 */
export class CellDataComposite extends ACellData {
    /**
     * The cells that make up the composite
     */
    private data: Array<ACellData>

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

    /**
     * Add a cell to the the composite
     * @param cell the cell to add 
     */
    public addCellData(cell: ACellData): void {
    }

    /**
     * Remove a cell from the composite
     * @param cell the cell to remove 
     */
    public removeCellData(cell: ACellData): void {
    }
}