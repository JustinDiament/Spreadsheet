import { IACellsIterator } from "./cell-iterator-interface";

/**
 * Represents an object that performs a find and replace operation on a representation of a group of spreadsheet cells 
 */
export interface IFindAndReplace {
    /**
     * Returns an iterator over a representation of a group of spreadsheet cells 
     * @return the iterator object 
     */
    createCellsIterator(): IACellsIterator;

    /**
     * Replace a cell's value with a new value
     * @param id the id of the cell to have its value replaced
     * @param value the new value of the cell 
     */
    replace(id: number, value: string): void;
}