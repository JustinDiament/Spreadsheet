/**
 * @file controller-interface.ts
 * @interface ISpreadhSheetState
 */

import { ICell } from "./cell-interface";
import { ICellStyle } from "./cell-style-interface";
import { IValidationRule } from "./validation-rule-interface";

/**
 * An interface to represent the spreadsheet store, which is our state tree that acts as a controller,
 * passing data between the model and client
 */
export interface ISpreadSheetState {
    // the 2D array/grid of ICells in the spreadsheet, instantiated as a 10x10 grid of empty ICells
    cells: ICell[][];
    
    // the list of ICells in the spreadsheet that are currently selected by the user
    currentlySelected: ICell[];

    /**
     * Set the list of currently selected ICells in the spreadsheet to contain
     * only the provided ICell, and no other
     * @param cell the ICell to set as the currently selected ICells, provided via its location as a string
     * @sets currentlySelected
     */
    setSelectedOne(cell: string):void;

    /**
     * Set the list of currently selected ICells in the spreadsheet to contain only
     * the ICells that fall within the range of ICells determined by the provided starting and ending points
     * @param cell1 the first ICell in the range of ICells to select, provided via its location as a string
     * @param cell2  the last ICell in the range of ICells to select, provided via its location as a string
     * @sets currentlySelected
     */
    setSelectedMany(cell1: string, cell2: string) : void;

    /**
     * Returns whether the provided ICell is contained in the list of currently
     * selected ICells
     * @param cell the ICell to be determined if it is selected
     * @returns true if the ICell is selected, else false
     */
    isSelected(cell: ICell) : boolean;

    /**
     * Get the list of all currently selected ICells
     * @returns currentlySelected
     */
    getSelected() : Array<ICell>;

    /**
     * Adds a new, empty row above the topmost currently selected ICell
     * or below the bottommost currently selected ICell
     * 
     * @param aboveOrBelow a string representing whether to add the row above or below
     * @sets cells
     */
    addRow(aboveOrBelow: string): void;

    /**
     * Adds a new, empty column left of the leftmost currently selected ICell
     * or right of the rightmost currently selected ICell
     * 
     * @param leftOrRight a string representing whether to add the column to the left or right
     * @sets cells
     */
    addColumn(leftOrRight: string): void;

     /**
     * Removes every row that contains a currently selected ICell, UNLESS doing so would
     * result in the spreadsheet having no rows. In that case, it does nothing
     * 
     * @sets cells
     */
    deleteRow(): void;

    /**
     * Removes every column that contains a currently selected ICell, UNLESS doing so would
     * result in the spreadsheet having no columns. In that case, it does nothing
     * 
     * @sets cells
     */
    deleteColumn(): void;

    /**
     * Changes the entered value of an ICell
     * @param cellId the location of the ICell to change
     * @param newValue the new value of the ICell
     * @sets cells
     */
    editCell(cellId: string, newValue: string): void;

    /**
     * Changes the entered value of all currently selected ICells to be empty
     * @sets cells
     */
    clearSelectedCells(): void;

     /**
     * Changes the entered value of all ICells to be empty
     * @sets cells
     */
    clearAllCells(): void;

    /**
     * Add the provided IValidationRule to the currently selected ICells
     * @param rule the IValidationRule being added to the selected ICells that enforces restrictions on the ICells' display values
     * @sets currentlySelected
     */
    createRule(rule: IValidationRule): void;

    /**
     * Remove the provided IValidationRule from the currently selected ICells, if it is applied
     * @param rule the IValidationRule being removed from the selected ICells
     * @sets currentlySelected
     */
    removeRule(rule: IValidationRule): void;

    /**
     * Returns an array of IValidationRules that are applied to EVERY currently selected ICells
     * @returns an array of IValidationRules that are applied to the currently selected ICells
     */
    getAllRules(): Array<IValidationRule>;

    /**
     * Find all the ICells in the spreadsheet that contain the provided string in their entered value, and selects the first ICell that does
     * @param find the string that the ICells' entered value should contain
     * @sets currentlySelected
     */
    findCellsContaining(find:string): void;

    /**
     * Change the content of the currently selected ICell by replacing any instance
     * of the 'find' string in the ICell's entered value with the 'replace' string 
     * @param find the string that the ICells' entered value should contain and be replaced
     * @param replace the value to replace instances of the 'find' string with
     * @sets cells, currentlySelected, via findNextContaining
     */
    replaceCurrentCell(find:string, replace:string):void;
    
    /**
     * Select the next ICell in the spreadsheet that contains the provided 'find' string in its entered value
     * @param find the string that the ICells' entered value should contain
     * @sets cells, currentlySelected
     */
    findNextContaining(find: string):void;
    
    /**
     * Find all the ICells in the spreadsheet that contain the provided string in their entered value, 
     * and replaces every instance of the 'find' string with the provided 'replace' string
     * @param find the string that the ICells' entered value should contain and be replaced
     * @param replace the value to replace instances of the 'find' string with
     * @sets cells
     */
    findAndReplaceAll(find: string, replace: string): void;
  
    /**
     * Set the style of the selected ICells using the provided functions for determining
     * if an ICellStyle property is active, and a function to set that ICellStyle property's value
     * 
     * If all selected ICells have the provided ICellStyle property activated, it will be deactivated. 
     * Otherwise, it will be activated for all selected ICells
     * @param isCellStyled the function for determining if a ICellStyle property is active
     * @param setCellStyle the function to set an ICellStyle property's value
     * @sets currentlySelected
     */
    setStyle(isCellStyled:(style:ICellStyle) => boolean, setCellStyle:(style:ICellStyle, value:boolean) => void): void;

    /**
     * Update the value of the text color property for all selected ICells' ICellStyle
     * @param textColor the color the text in the ICell should be as a string hex code
     * @sets currentlySelected
     */
    setTextColor(textColor:string): void;
}