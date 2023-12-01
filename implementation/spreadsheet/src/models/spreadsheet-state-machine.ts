/**
 * @file spreadsheet-state-machine.ts
 * @class SpreadsheetStateMachine
 */

import { ISpreadSheetState } from '../interfaces/controller-interface'
import { ICellStyle } from '../interfaces/cell-style-interface';
import { ICell } from '../interfaces/cell-interface';
import { Cell } from './cell';
import { Util } from './util';
import { IValidationRule } from '../interfaces/validation-rule-interface';
/**
 * ==============================================================
 *          helper functions outside of the store
 * ==============================================================
 */

/**
 * local helper function to return a copy of the provided 2D array of ICells
 * it does not make copies of the individual ICells
 * @param grid the 2D array of ICells to copy
 * @returns the copy of the provided 2D array of ICells
 */
const copyGrid = (grid: Array<Array<ICell>>): Array<Array<ICell>> => {
  let newGrid: Array<Array<ICell>> = [];
  grid.forEach((element) => {
    let row: Array<ICell> = [];
    element.forEach((cell) => row.push(cell));
    newGrid.push(element);
  });
  return newGrid;
};

/**
 * local helper function to return a copy of the provided 1D array of ICells
 * it does not make copies of the individual ICells
 * @param row the 1D array of ICells to copy
 * @returns the copy of the provided 1D array of ICells
 */
const copyRow = (row: Array<ICell>): Array<ICell> => {
  let newGrid: Array<ICell> = [];
  row.forEach((element) => {
    newGrid.push(element);
  });
  return newGrid;
};


// a class meant to perform operations on ISpreadsheetStates given their current state
// and return either the new state or a value derived from the state (ex. is something selected?)
export class SpreadsheetStateMachine {
    /**
     * Set the list of currently selected ICells in the spreadsheet to contain
     * only the provided ICell, and no other
     * @param cell the ICell to set as the currently selected ICells, provided via its location as a string
     * @returns currentState - the new state of the spreadsheet
     */
    public static setSelectedOne(currentState: ISpreadSheetState, cell: string): ISpreadSheetState {
      // the new list of ICells that currentlySelected will be set to at the end of the function
      let newSelect: Array<ICell> = [];
      try {
        // parse the location of the cell and add the cell at that location to the new list
        // of currently selected cells
        let location: Array<number> = Util.getIndicesFromLocation(cell);
        newSelect.push(currentState.cells[location[1]][location[0]]);
      } catch {
        // select nothing if there was an error
        newSelect = [];
      }
      currentState.currentlySelected = newSelect;
      return currentState;
    };

    /**
     * Set the list of currently selected ICells in the spreadsheet to contain only
     * the ICells that fall within the range of ICells determined by the provided starting and ending points
     * @param currentState the spreadsheet state that is being changed
     * @param cell1 the first ICell in the range of ICells to select, provided via its location as a string
     * @param cell2  the last ICell in the range of ICells to select, provided via its location as a string
     * @returns currentState - the new state of the spreadsheet
     */
    public static setSelectedMany(currentState: ISpreadSheetState, cell1: string, cell2: string): ISpreadSheetState {
      // the new list of ICells that currentlySelected will be set to at the end of the function
      let newSelect: Array<ICell> = new Array<ICell>();
      try {
        // parse the location of the starting and ending cells and determine the range of values the selected cells fall within
        let location1: Array<number> = Util.getIndicesFromLocation(cell1);
        let location2: Array<number> = Util.getIndicesFromLocation(cell2);
        // using min and max so that a user could select a starting value that is below and/or to the right of the
        // ending value, and still be able to select all cells within that range
        let colStart: number = Math.min(location1[0], location2[0]);
        let colEnd: number = Math.max(location1[0], location2[0]);
        let rowStart: number = Math.min(location1[1], location2[1]);
        let rowEnd: number = Math.max(location1[1], location2[1]);
        // get our current state and retrieve the grid of cells
        let grid: ICell[][] = currentState.cells;
        // iterate through all cells in the determined range and add them to the new list of currently selected cells
        // iterate through every row with an index between the starting and ending row indices
        for (let i: number = rowStart; i <= rowEnd; i++) {
          // iterate through every column with an index between the starting and ending column indices
          for (let j: number = colStart; j <= colEnd; j++) {
            newSelect.push(grid[i][j]);
          }
        }
      } catch {
        // select nothing if there was an error
        newSelect = [];
      }
      currentState.currentlySelected = newSelect;
      // this set is a feature of zustand - updates the state of the spreadsheet by updating the value of currentlySelected
      return currentState;
    };

    /**
     * Returns whether the provided ICell is contained in the list of currently
     * selected ICells
     * @param currentState the spreadsheet state that is being changed
     * @param cell the ICell to be determined if it is selected
     * @returns true if the ICell is selected, else false
     */
    public static isSelected(currentState: ISpreadSheetState, cell: ICell): boolean {
      try {
        // is the given cell inside the list of selected cells?
        return currentState.currentlySelected.includes(cell);
      } catch {
        // invalid cell cannot be selected, so return false
        return false;
      }
    };

    /**
     * Get the list of all currently selected ICells
     * @param currentState the spreadsheet state that is being changed
     * @returns currentlySelected
     */
    public static getSelected(currentState: ISpreadSheetState): ICell[] {
      return currentState.currentlySelected;
    };

    /**
     * Adds a new, empty row above the topmost currently selected ICell
     * or below the bottommost currently selected ICell
     *@param currentState the spreadsheet state that is being changed
     * @param aboveOrBelow a string representing whether to add the row above or below
     * @returns currentState - the new state of the spreadsheet
     */
    public static addRow(currentState: ISpreadSheetState, aboveOrBelow: string): ISpreadSheetState {
      // If no location is selected, don't add a column
      if (currentState.currentlySelected.length === 0) {
        return currentState;
      }

      // Set the column to check for highlights as the first column of
      // the currently selected cells
      let colToCheck = currentState.currentlySelected[0].getColumn();

      // Find the top and bottom selected rows
      let belowRow: number = -1;
      let aboveRow: number = currentState.cells[0].length;
      for (const cell of currentState.currentlySelected) {
        if (colToCheck === cell.getColumn()) {
          if (cell.getRow() > belowRow) {
            belowRow = cell.getRow();
          }

          if (cell.getRow() < aboveRow) {
            aboveRow = cell.getRow();
          }
        }
      }

      // If the user chose to insert above, insert to the above of the top selected row
      let insertLocation;
      if (aboveOrBelow === "above") {
        insertLocation = aboveRow;
        // If the user chose to insert below, insert below of the bottom selected row
      } else {
        insertLocation = belowRow + 1;
      }

      // Add the new row to the temparay grid
      let newCells: Array<ICell> = new Array<ICell>();
      for (let i = 0; i < currentState.cells[0].length; i++) {
        newCells.push(new Cell(insertLocation, i));
      }

      // Create a temparary grid
      let newGrid: Array<Array<ICell>> = copyGrid(currentState.cells);

      newGrid.splice(insertLocation, 0, newCells);

      // Remove the proper number of rows from the temperary grid
      for (let i = insertLocation + 1; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[0].length; j++) {
          newGrid[i][j].setRow(i);
        }
      }

      // Reset the row and column numbers for the newly updated grid
      newGrid.forEach((row: ICell[]) =>
        row.forEach((cell: ICell) => cell.updateDisplayValue(newGrid))
      );

        currentState.cells = newGrid;
      // Update the display values to update any references based on the new grid
      return currentState;
    };

    /**
     * Adds a new, empty column left of the leftmost currently selected ICell
     * or right of the rightmost currently selected ICell
     *@param currentState the spreadsheet state that is being changed
     * @param leftOrRight a string representing whether to add the column to the left or right
     * @returns currentState - the new state of the spreadsheet
     */
    public static addColumn(currentState: ISpreadSheetState, leftOrRight: string): ISpreadSheetState {
      // If no location is selected, don't add a column
      if (currentState.currentlySelected.length === 0) {
        return currentState;
      }

      // Set the row to check for highlights as the first row of
      // the currently selected cells
      let rowToCheck = currentState.currentlySelected[0].getRow();

      // Find the leftmost and rightmost selected columns
      let rightCol: number = -1;
      let leftCol: number = currentState.cells.length;
      for (const cell of currentState.currentlySelected) {
        if (rowToCheck === cell.getRow()) {
          if (cell.getColumn() < leftCol) {
            leftCol = cell.getColumn();
          }

          if (cell.getColumn() > rightCol) {
            rightCol = cell.getColumn();
          }
        }
      }

      // If the user chose to insert left, insert to the left of the leftmost selected column
      let insertLocation;
      if (leftOrRight === "left") {
        insertLocation = leftCol;
        // If the user chose to insert right, insert to the right of the rightmost selected column
      } else {
        insertLocation = rightCol + 1;
      }

      let newGrid: Array<Array<ICell>> = copyGrid(currentState.cells);

      // Add the new column to the temparary grid
      for (let i = 0; i < newGrid.length; i++) {
        newGrid[i].splice(insertLocation, 0, new Cell(i, insertLocation));
      }

      // Reset the row and column numbers for the newly updated grid
      for (let i = 0; i < newGrid.length; i++) {
        for (let j = insertLocation + 1; j < newGrid[0].length; j++) {
          newGrid[i][j].setColumn(j);
        }
      }

      // Update the display values to update any references based on the new grid
      newGrid.forEach((row: ICell[]) =>
        row.forEach((cell: ICell) => cell.updateDisplayValue(newGrid))
      );

      currentState.cells = newGrid;
      return currentState;
    };

    /**
     * Removes every row that contains a currently selected ICell, UNLESS doing so would
     * result in the spreadsheet having no rows. In that case, it does nothing
     *
     * @param currentState the spreadsheet state that is being changed
     * @returns currentState - the new state of the spreadsheet
     */
    public static deleteRow(currentState: ISpreadSheetState): ISpreadSheetState {
      // if there are no selected cells, there is nothing to delete
      if(currentState.currentlySelected.length === 0) {
        return currentState;
      }
      // Start first row to delete at the last row
      let rowToDelete: number = currentState.cells[0].length;

      // Start the number of rows to delete at 0
      let numRowsToDelete: number = 0;

      // Set the column to check for highlights as the first column of
      // the currently selected cells
      let colToCheck = currentState.currentlySelected[0].getColumn();

      // Check for how many rows have at least one cell highlighted in them
      // and increment numRowsToDelete
      for (const cell of currentState.currentlySelected) {
        if (colToCheck === cell.getColumn()) {
          if (cell.getRow() < rowToDelete) {
            rowToDelete = cell.getRow();
          }
          numRowsToDelete++;
        }
      }
    if(numRowsToDelete >= currentState.cells.length) {
      return currentState;
    }
      let newGrid: Array<Array<ICell>> = copyGrid(currentState.cells);

      

      // Remove the proper number of rows from the temperary grid
      for (let i = 0; i < numRowsToDelete; i++) {
        newGrid.splice(rowToDelete, 1);
      }

      // Reset the row and column numbers for the newly updated grid
      for (let i = rowToDelete; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[0].length; j++) {
          newGrid[i][j].setRow(newGrid[i][j].getRow() - numRowsToDelete);
        }
      }

      // Update the display values to update any references based on the new grid
      newGrid.forEach((row: ICell[]) =>
        row.forEach((cell: ICell) => cell.updateDisplayValue(newGrid))
      );

      currentState.cells = newGrid;
      return currentState;
    };

    /**
     * Removes every column that contains a currently selected ICell, UNLESS doing so would
     * result in the spreadsheet having no columns. In that case, it does nothing
     *@param currentState the spreadsheet state that is being changed
     * @returns currentState - the new state of the spreadsheet
     */
    public static deleteColumn(currentState: ISpreadSheetState): ISpreadSheetState {
     // if there are no selected cells, there is nothing to delete
      if(currentState.currentlySelected.length === 0) {
        return currentState;
      }
      // Start first col to delete at the last row
      let colToDelete: number = currentState.cells.length;

      // Start the number of cols to delete at 0
      let numColsToDelete: number = 0;

      // Set the row to check for highlights as the first column of
      // the currently selected cells
      let rowToCheck = currentState.currentlySelected[0].getRow();

      // Check for how many cols have at least one cell highlighted in them
      // and increment numColsToDelete
      for (const cell of currentState.currentlySelected) {
        if (rowToCheck === cell.getRow()) {
          if (cell.getColumn() < colToDelete) {
            colToDelete = cell.getColumn();
          }
          numColsToDelete++;
        }
      }

      if((numColsToDelete >= currentState.cells[0].length)) {
      return currentState;
    }

      // Create a temporary grid
      let newGrid: Array<Array<ICell>> = copyGrid(currentState.cells);

      // Remove the proper number of rows from the temperary grid
      for (let i = 0; i < numColsToDelete; i++) {
        for (let j = 0; j < newGrid.length; j++) {
          newGrid[j].splice(colToDelete, 1);
        }
      }

      // Reset the row and column numbers for the newly updated grid
      for (let i = 0; i < newGrid.length; i++) {
        for (let j = colToDelete; j < newGrid[0].length; j++) {
          newGrid[i][j].setColumn(newGrid[i][j].getColumn() - numColsToDelete);
        }
      }

      // Update the display values to update any references based on the new grid
      newGrid.forEach((row: ICell[]) =>
        row.forEach((cell: ICell) => cell.updateDisplayValue(newGrid))
      );

      currentState.cells = newGrid;
      return currentState;
    };

    /**
     * Changes the entered value of an ICell
     * @param currentState the spreadsheet state that is being changed
     * @param cellId the location of the ICell to change
     * @param newValue the new value of the ICell
     *@returns currentState - the new state of the spreadsheet
     */
    public static editCell(currentState: ISpreadSheetState, cellId: string, newValue: string): ISpreadSheetState {
      // the new grid of ICells that cells will be set to at the end of the function
      // initiate it to be the same as the current state of cells
      let newGrid: Array<Array<ICell>> = copyGrid(currentState.cells);
      // get the column and row number from the passed-in cellID
      let loc: Array<number> = Util.getIndicesFromLocation(cellId);
      let row: number = loc[1];
      let col: number = loc[0];

      // make sure the provided location is valid
      if (
        row < newGrid.length &&
        row >= 0 &&
        col < newGrid[0]?.length &&
        col >= 0
      ) {
        // get cell at the provided location
        let cell: ICell = newGrid[row][col];
        // set the entered value of that cell and update its display value
        cell.setEnteredValue(newValue);
        cell.updateDisplayValue(currentState.cells);
      }
      currentState.cells = newGrid;
      return currentState;
    };

    /**
     * Changes the entered value of all currently selected ICells to be empty
     * @param currentState the spreadsheet state that is being changed
     * @returns currentState - the new state of the spreadsheet
     */
    public static clearSelectedCells(currentState: ISpreadSheetState): ISpreadSheetState {
      // the new list of ICells that currentlySelected will be set to at the end of the function
      // and make it the same as the current state of selected cells to start
      let newSelectedGrid: Array<ICell> = copyRow(currentState.currentlySelected);
      // clear every cell in the new list of selected cells
      newSelectedGrid.forEach((cell) => cell.clearCell());
      currentState.currentlySelected = newSelectedGrid;
      return currentState;
    };

    /**
     * Changes the entered value of all ICells to be empty
     * @param currentState the spreadsheet state that is being changed
     * @returns currentState - the new state of the spreadsheet
     */
    public static clearAllCells(currentState: ISpreadSheetState): ISpreadSheetState {
      // the new grid of ICells that cells will be set to at the end of the function
      // and make it the same as the current state of cells to start
      let newGrid: Array<Array<ICell>> = copyGrid(currentState.cells);
      // clear every cell in the new grid of cells
      newGrid.forEach((row) => row.forEach((cell) => cell.clearCell()));
      currentState.cells = newGrid;
      return currentState;
    };

    /**
     * Add the provided IValidationRule to the currently selected ICells
     * @param currentState the spreadsheet state that is being changed
     * @param rule the IValidationRule being added to the selected ICells that enforces restrictions on the ICells' display values
     * @returns currentState - the new state of the spreadsheet
     */
    public static createRule(currentState: ISpreadSheetState, rule: IValidationRule): ISpreadSheetState {
      // iterate through all currently selected cells and adds them to the new list of currently selected cells
      // doing this so that we can set the state of the spreadsheet at the end of this function
      let newSelectedGrid: Array<ICell> = copyRow(currentState.currentlySelected);
      // add rule to every selected cell
      newSelectedGrid.forEach((element) => {
        element.addRule(rule);
        // force cell to update its display value to show an error if it breaks the rule
        element.updateDisplayValue(currentState.cells);
      });
      currentState.currentlySelected = newSelectedGrid;
      return currentState;
    };

    /**
     * Remove the provided IValidationRule from the currently selected ICells, if it is applied
     * @param currentState the spreadsheet state that is being changed
     * @param rule the IValidationRule being removed from the selected ICells
     * @returns currentState - the new state of the spreadsheet
     */
    public static removeRule(currentState: ISpreadSheetState, rule: IValidationRule): ISpreadSheetState {
      // iterate through all currently selected cells and adds them to the new list of currently selected cells
      // doing this so that we can set the state of the spreadsheet at the end of this function
      let newSelectedGrid: Array<ICell> = copyRow(currentState.currentlySelected);
      // remove rule from every selected cell
      newSelectedGrid.forEach((element) => {
        element.removeRule(rule);
        // force cell to update its display value to clear an error if it broke the rule previously
        element.updateDisplayValue(currentState.cells);
      });

      currentState.currentlySelected = newSelectedGrid;
      return currentState;
    };

    /**
     * Returns an array of IValidationRules that are applied to EVERY currently selected ICells
     * @param currentState the spreadsheet state that is being changed
     * @returns an array of IValidationRules that are applied to the currently selected ICells
     */
    public static getAllRules(currentState: ISpreadSheetState): IValidationRule[] {
      let rules: Array<IValidationRule> = new Array<IValidationRule>();
      // there will only be rules if there are cells selected
      if (currentState.currentlySelected.length > 0) {
        // start by getting all the rules of the first selected cell
        // which cell is being used is arbitrary, but using the first works for any number of selected cells
        // we do this because if a rule is not in the first cell, it is not in EVERY selected cell, and therefore wouldn't be returned
        let firstRules: Array<IValidationRule> =
          currentState.currentlySelected[0].getRules();
        // go through all currently selected cells and see if they contain the rules contained in firstRules
        for (let i: number = 0; i < firstRules.length; i++) {
          let contains: boolean = true;
          // if the rule is not in every cell, contains will be false, and we will not add the rule to our final list of rules
          // if it is every cell, contains will be true, and we will add the rule to our final list of rules
          currentState.currentlySelected.forEach(
            (cell) => contains = contains && cell.getRules().includes(firstRules[i])
          );
          contains && rules.push(firstRules[i]);
        }
      }
      // return our final list of rules
      return rules;
    };

    /**
     * Find all the ICells in the spreadsheet that contain the provided string in their entered value, and selects the first ICell that does
     * @param currentState the spreadsheet state that is being changed
     * @param find the string that the ICells' entered value should contain
     * @returns currentState - the new state of the spreadsheet
     */
    public static findCellsContaining(currentState: ISpreadSheetState, find: string): ISpreadSheetState {
      // reset selected cells
      let selectCells: Array<ICell> = [];

      // if no value being looked for, don't try to look
      if (find !== "") {
        let findAndReplaceCellsTemp: Array<ICell> = [];
        // go through all the cells to look for the first instance of find
        currentState.cells.forEach((row) => {
          row.forEach((element) => {
            if (element.getEnteredValue().indexOf(find) !== -1) {
              findAndReplaceCellsTemp.push(element);
            }
          });
        });

        // if at least one cell contains the find string, select the first one
        if (findAndReplaceCellsTemp.length > 0) {
          selectCells = [];
          selectCells.push(findAndReplaceCellsTemp[0]);
        }
      } else {
        // if there were no cells that contained the find string, don't select any cell
        selectCells = [];
      }
      currentState.currentlySelected = selectCells;
      return currentState;    
    };

    /**
     * Change the content of the currently selected ICell by replacing any instance
     * of the 'find' string in the ICell's entered value with the 'replace' string
     * @param currentState the spreadsheet state that is being changed
     * @param find the string that the ICells' entered value should contain and be replaced
     * @param replace the value to replace instances of the 'find' string with
     * @returns currentState - the new state of the spreadsheet
     */
    public static replaceCurrentCell(currentState: ISpreadSheetState, find: string, replace: string): ISpreadSheetState {
      // if no value being looked for, don't try to replace
      if (find !== "") {
        // if no cell selected, cannot replace
        if (currentState.currentlySelected.length > 0) {
          currentState.currentlySelected[0].findReplace(find, replace);
        }
        // now that we have replaced value, move onto the next instance of the find string in the grid
        // if possible
        currentState.findNextContaining(find);
      }
      return currentState
    };

    /**
     * Select the next ICell in the spreadsheet that contains the provided 'find' string in its entered value
     * @param currentState the spreadsheet state that is being changed
     * @param find the string that the ICells' entered value should contain
     * @returns currentState - the new state of the spreadsheet
     */
    public static findNextContaining(currentState: ISpreadSheetState, find: string): ISpreadSheetState {
      // If there is nothing left selected (so no more find matches) or nothing is in the find box, return
      if (!(currentState.currentlySelected.length > 0) || find === "") {
        return currentState;
      }

      // Create a temparary grid
      let newGrid: Array<Array<ICell>> = copyGrid(currentState.cells);

      // Get the row an column of the cell we are up to in the find and replace iteration
      const rowCurrent: number = currentState.currentlySelected[0].getRow();
      const colCurrent: number = currentState.currentlySelected[0].getColumn();

      // Start the next currentlySelected as nothing
      let currentlySelectedTemp: Array<ICell> = [];

      // Loop through the rest of the cells until we find another instance of the find text
      let done = false;
      for (let i = rowCurrent; i < currentState.cells.length; i++) {
        for (let j = 0; j < currentState.cells[0].length; j++) {
          // If this is the first row being checked, make sure we jump ahead to the next space 
          // in that row, not starting from the beginning of the row
          let jj = j;
          if (i === rowCurrent) {
            if (j === 0) {
              continue;
            }
            jj = j + colCurrent;
            if (jj >= currentState.cells[0].length) {
              continue;
            }
          }

          // If the current cell in the iteration has the find text, set that is the next 
          // currentlySelected and break out of the loop
          const currentCell = currentState.cells[i][jj];
          if (currentCell.getEnteredValue().indexOf(find) !== -1) {
            done = true;
            currentlySelectedTemp = [currentCell];
            break;
          }
        }
        // If we found the text, break out of this loop too
        if (done) {
          break;
        }
      }

      // Update the cell display values to account for a potential replacement
      newGrid.forEach((row: ICell[]) =>
        row.forEach((cell: ICell) => cell.updateDisplayValue(newGrid))
      );

      // Set the temp grid as the real grid and set the next currentlySelected value to be 
      // the next isntance of the find test
      currentState.cells = newGrid;
      currentState.currentlySelected = currentlySelectedTemp;
      return currentState;
    };

    /**
     * Find all the ICells in the spreadsheet that contain the provided string in their entered value,
     * and replaces every instance of the 'find' string with the provided 'replace' string
     * @param currentState the spreadsheet state that is being changed
     * @param find the string that the ICells' entered value should contain and be replaced
     * @param replace the value to replace instances of the 'find' string with
     * @returns currentState - the new state of the spreadsheet
     */
    public static findAndReplaceAll(currentState: ISpreadSheetState, find: string, replace: string): ISpreadSheetState {
      // iterate through all cells and adds them to the new grid of cells
      // doing this so that we can set the state of the spreadsheet at the end of this function
      let newGrid: Array<Array<ICell>> = copyGrid(currentState.cells);
      // if no value being looked for, don't try to replace
      if (find !== "") {
        // go through every cell in the new grid and try to find+replace
        newGrid.forEach((row) => {
          row.forEach((element) => {
            element.findReplace(find, replace);
          });
        });
        // go through every cell in the new grid and update the display value
        newGrid.forEach((row: ICell[]) =>
          row.forEach((cell: ICell) => cell.updateDisplayValue(newGrid))
        );
      }
      currentState.cells = newGrid;
      return currentState;
    };

    /**
     * Set the style of the selected ICells using the provided functions for determining
     * if an ICellStyle property is active, and a function to set that ICellStyle property's value
     *
     * If all selected ICells have the provided ICellStyle property activated, it will be deactivated.
     * Otherwise, it will be activated for all selected ICells
     * @param currentState the spreadsheet state that is being changed
     * @param isCellStyled the function for determining if a ICellStyle property is active
     * @param setCellStyle the function to set an ICellStyle property's value
     * @returns currentState - the new state of the spreadsheet
     */
    public static setStyle(currentState: ISpreadSheetState,
      isCellStyled: (style: ICellStyle) => boolean,
      setCellStyle: (style: ICellStyle, value: boolean) => void
    ): ISpreadSheetState {
      // iterate through all currently selected cells and adds them to the new list of currently selected cells
      // doing this so that we can set the state of the spreadsheet at the end of this function
      let newSelected: Array<ICell> = copyRow(currentState.currentlySelected);
  
      // determine if every selected cell is styled using provided evaluation function
      let allStyled: boolean = true;
      newSelected.forEach((cell: ICell) => {
        allStyled = allStyled && isCellStyled(cell.getStyle());
      });

      // If all cells styled, unapply the style with provided style setting function
      // Else, apply the style with provided style setting function
      newSelected.forEach((cell) => {
        let newStyle: ICellStyle = cell.getStyle();
        setCellStyle(newStyle, !allStyled);
      });
        currentState.currentlySelected = newSelected;
        return currentState;   
    };

    /**
     * Update the value of the text color property for all selected ICells' ICellStyle
     * @param currentState the spreadsheet state that is being changed
     * @param textColor the color the text in the ICell should be as a string hex code
     * @returns currentState - the new state of the spreadsheet
     */
    public static setTextColor(currentState: ISpreadSheetState, textColor: string): ISpreadSheetState {
      // iterate through all currently selected cells and adds them to the new list of currently selected cells
      // doing this so that we can set the state of the spreadsheet at the end of this function
      let newSelected: Array<ICell> = copyRow(currentState.currentlySelected);
      // for all selected cells, update their text color to provided color
      newSelected.forEach((cell: ICell) => {
        let newStyle: ICellStyle = cell.getStyle();
        newStyle.setTextColor(textColor);
      });
      currentState.currentlySelected = newSelected;
      return currentState;
    };
}