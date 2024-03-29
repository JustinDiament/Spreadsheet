import { ACell } from "../interfaces/cell-abstract-class";
import { IACellsIterator } from "../interfaces/cell-iterator-interface";
import { Cell } from "./cell";

/**
 * Represents an iterator that iterates over a 2D array of ACells
 */
export class ACellsIterator implements IACellsIterator {
    /**
     * Resets the iterator to the first cell in the array of ACells
     */
    public first(): void {
    }

    /**
     * Advances the iterator to the next cell in the array of ACells
     */
    public next(): void {
    }

    /**
     * Returns true if the current ACell is the last cell in the array, false otherwise
     * @return true if the current ACell is the last cell in the array, false otherwise
     */
    public isDone(): boolean {
        return true;
    }

    /**
     * Returns the current ACell the iterator is at
     * @return the current ACell the iterator is at
     */
    public currentCell(): ACell {
        return new Cell();
    }
}