import { ACell } from "../interfaces/cell-abstract-class";
import { IACellsIterator } from "../interfaces/cell-iterator-interface";
import { IFindAndReplace } from "../interfaces/find-and-replace-interface";
import { ACellsIterator } from "./cells-iterator";

/**
 * Represents an object that performs a find and replace operation on a representation of a group of spreadsheet cells 
 */
export class FindAndReplace implements IFindAndReplace {

    /**
     * The cells that are being looked through in the find and replace operation
     */
    //private cells: Array<Array<ACell>>; 

    /**
     * Returns an iterator over a representation of a group of spreadsheet cells 
     * @return the iterator object 
     */
    public createCellsIterator(): IACellsIterator {
        return new ACellsIterator();
    }

    /**
     * Replace a cell's value with a new value
     * @param id the id of the cell to have its value replaced
     * @param value the new value of the cell 
     */
    public replace(id: number, value: string): void {
    }
}