import { ACell } from "./cell-abstract-class";

/**
 * Represents an iterator that iterates over a 2D array of ACells
 */
export interface IACellsIterator {
    /**
     * Resets the iterator to the first cell in the array of ACells
     */
    first(): void;

    /**
     * Advances the iterator to the next cell in the array of ACells
     */
    next(): void;

    /**
     * Returns true if the current ACell is the last cell in the array, false otherwise
     * @return true if the current ACell is the last cell in the array, false otherwise
     */
    isDone(): boolean;

    /**
     * Returns the current ACell the iterator is at
     * @return the current ACell the iterator is at
     */
    currentCell(): ACell;
}