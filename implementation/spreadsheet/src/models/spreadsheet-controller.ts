/**
 * @file spreadsheet-controller.ts
 * @store useSpreadsheetController
 */

import { type StateCreator } from 'zustand'
import { ISpreadSheetState } from '../interfaces/controller-interface'
import { ICellStyle } from '../interfaces/cell-style-interface';
import { ICell } from '../interfaces/cell-interface';
import { Cell } from './cell';
import { IValidationRule } from '../interfaces/validation-rule-interface';
import { create } from "zustand";
import { SpreadsheetStateMachine } from './spreadsheet-state-machine';
/**
 * ==============================================================
 *          helper functions outside of the store
 * ==============================================================
 */

/**
 * local helper function to create an empty 10x10 grid of ICells
 * which the controller uses to instantiate the spreadsheet
 * @returns a 10x10 2d array of ICells
 */
const createCells = (): Array<Array<ICell>> => {
  // create empty 2d array of ICells
  let cells: Array<Array<ICell>> = [];
  // iterate through 10 rows and add 10 cells to each row
  for (let i: number = 0; i < 10; i++) {
    let row: Array<ICell> = new Array<ICell>();
    for (let j: number = 0; j < 10; j++) {
      row.push(new Cell(i, j));
    }
    cells.push(row);
  }
  return cells;
};

// a means of creating an ISpreadSheetState state machine, similar to a factory
export const spreadSheetCreator: StateCreator<ISpreadSheetState> = (set, get) => ({
   cells: createCells(),

    // the list of ICells in the spreadsheet that are currently selected by the user
    currentlySelected: [],

    /**
     * Set the list of currently selected ICells in the spreadsheet to contain
     * only the provided ICell, and no other
     * @param cell the ICell to set as the currently selected ICells, provided via its location as a string
     * @sets currentlySelected
     */
    setSelectedOne: (cell: string) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.setSelectedOne(get(), cell));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Set the list of currently selected ICells in the spreadsheet to contain only
     * the ICells that fall within the range of ICells determined by the provided starting and ending points
     * @param cell1 the first ICell in the range of ICells to select, provided via its location as a string
     * @param cell2  the last ICell in the range of ICells to select, provided via its location as a string
     * @sets currentlySelected
     */
    setSelectedMany: (cell1: string, cell2: string) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.setSelectedMany(get(), cell1, cell2));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Returns whether the provided ICell is contained in the list of currently
     * selected ICells
     * @param cell the ICell to be determined if it is selected
     * @returns true if the ICell is selected, else false
     */
    isSelected: (cell: ICell) => {
      return SpreadsheetStateMachine.isSelected(get(), cell);
    },

    /**
     * Get the list of all currently selected ICells
     * @returns currentlySelected
     */
    getSelected: () => {
       return SpreadsheetStateMachine.getSelected(get());
    },

    /**
     * Adds a new, empty row above the topmost currently selected ICell
     * or below the bottommost currently selected ICell
     *
     * @param aboveOrBelow a string representing whether to add the row above or below
     * @sets cells
     */
    addRow: (aboveOrBelow: string) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.addRow(get(), aboveOrBelow));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Adds a new, empty column left of the leftmost currently selected ICell
     * or right of the rightmost currently selected ICell
     *
     * @param leftOrRight a string representing whether to add the column to the left or right
     * @sets cells
     */
    addColumn: (leftOrRight: string) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.addColumn(get(), leftOrRight));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Removes every row that contains a currently selected ICell, UNLESS doing so would
     * result in the spreadsheet having no rows. In that case, it does nothing
     *
     * @sets cells
     */
    deleteRow: () => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.deleteRow(get()));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Removes every column that contains a currently selected ICell, UNLESS doing so would
     * result in the spreadsheet having no columns. In that case, it does nothing
     *
     * @sets cells
     */
    deleteColumn: () => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.deleteColumn(get()));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Changes the entered value of an ICell
     * @param cellId the location of the ICell to change
     * @param newValue the new value of the ICell
     * @sets cells
     */
    editCell: (cellId: string, newValue: string) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.editCell(get(), cellId, newValue));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Changes the entered value of all currently selected ICells to be empty
     * @sets cells
     */
    clearSelectedCells: () => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.clearSelectedCells(get()));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Changes the entered value of all ICells to be empty
     * @sets cells
     */
    clearAllCells: () => {
      // set(SpreadsheetStateMachine.clearAllCells(get()));
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.clearAllCells(get()));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Add the provided IValidationRule to the currently selected ICells
     * @param rule the IValidationRule being added to the selected ICells that enforces restrictions on the ICells' display values
     * @sets currentlySelected
     */
    createRule: (rule: IValidationRule) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.createRule(get(), rule));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Remove the provided IValidationRule from the currently selected ICells, if it is applied
     * @param rule the IValidationRule being removed from the selected ICells
     * @sets currentlySelected
     */
    removeRule: (rule: IValidationRule) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.removeRule(get(), rule));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Returns an array of IValidationRules that are applied to EVERY currently selected ICells
     * @returns an array of IValidationRules that are applied to the currently selected ICells
     */
    getAllRules: () => {
      return SpreadsheetStateMachine.getAllRules(get());
    },

    /**
     * Find all the ICells in the spreadsheet that contain the provided string in their entered value, and selects the first ICell that does
     * @param find the string that the ICells' entered value should contain
     * @sets currentlySelected
     */
    findCellsContaining: (find: string) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.findCellsContaining(get(), find));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Change the content of the currently selected ICell by replacing any instance
     * of the 'find' string in the ICell's entered value with the 'replace' string
     * @param find the string that the ICells' entered value should contain and be replaced
     * @param replace the value to replace instances of the 'find' string with
     * @sets cells, currentlySelected, via findNextContaining
     */
    replaceCurrentCell: (find: string, replace: string) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.replaceCurrentCell(get(), find, replace));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Select the next ICell in the spreadsheet that contains the provided 'find' string in its entered value
     * @param find the string that the ICells' entered value should contain
     * @sets cells, currentlySelected
     */
    findNextContaining: (find: string) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.findNextContaining(get(), find));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Find all the ICells in the spreadsheet that contain the provided string in their entered value,
     * and replaces every instance of the 'find' string with the provided 'replace' string
     * @param find the string that the ICells' entered value should contain and be replaced
     * @param replace the value to replace instances of the 'find' string with
     * @sets cells
     */
    findAndReplaceAll: (find: string, replace: string) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.findAndReplaceAll(get(), find, replace));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

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
    setStyle: (isCellStyled: (style: ICellStyle) => boolean, setCellStyle: (style: ICellStyle, value: boolean) => void) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.setStyle(get(), isCellStyled, setCellStyle));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
    },

    /**
     * Update the value of the text color property for all selected ICells' ICellStyle
     * @param textColor the color the text in the ICell should be as a string hex code
     * @sets currentlySelected
     */
    setTextColor: (textColor: string) => {
      let newState:ISpreadSheetState = (SpreadsheetStateMachine.setTextColor(get(), textColor));
      set( { cells : newState.cells, currentlySelected : newState.currentlySelected});
      set(SpreadsheetStateMachine.setTextColor(get(), textColor));
    },
  })

/**
 * A store (state tree) to act as a controller that manages the state of the spreadsheet
 * and passes information between the model and the client. Implemented as a custom hook through
 * Zustand keyword 'create'
 *
 * The state implements the ISpreadSheetState interface
 */
export const useSpreadsheetController = create<ISpreadSheetState>()(spreadSheetCreator);
