/**
 * @file spreadsheet-controller.ts
 * @store useSpreadsheetController
 */

import { ISpreadSheetState } from "../interfaces/controller-interface";
import { IValidationRule } from "../interfaces/validation-rule-interface";
import { Cell } from "./cell";
import { create } from "zustand";
import { ICellStyle } from "../interfaces/cell-style-interface";
import { ICell } from "../interfaces/cell-interface";
import { Util } from "./util";

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

/**
 * A store (state tree) to act as a controller that manages the state of the spreadsheet
 * and passes information between the model and the client. Implemented as a custom hook through
 * Zustand keyword 'create'
 *
 * The state implements the ISpreadSheetState interface
 */
export const useSpreadsheetController = create<ISpreadSheetState>(
  // set updates the state and get retrieves the state
  (set, get) => ({
    // the 2D array/grid of ICells in the spreadsheet, instantiated as a 10x10 grid of empty ICells
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
      let newSelect: Array<ICell> = [];
      try {
        // parse the location of the cell and add the cell at that location to the new list
        // of currently selected cells
        let location: Array<number> = Util.getIndicesFromLocation(cell);
        newSelect.push(get().cells[location[1]][location[0]]);
      } catch {
        // select nothing if there was an error
        newSelect = [];
      }
      // this set is a feature of zustand - updates the state of the spreadsheet by updating the value of currentlySelected
      set({ currentlySelected: newSelect });
    },

    /**
     * Set the list of currently selected ICells in the spreadsheet to contain only
     * the ICells that fall within the range of ICells determined by the provided starting and ending points
     * @param cell1 the first ICell in the range of ICells to select, provided via its location as a string
     * @param cell2  the last ICell in the range of ICells to select, provided via its location as a string
     * @sets currentlySelected
     */
    setSelectedMany: (cell1: string, cell2: string) => {
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
        let grid: ICell[][] = get().cells;
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
      // this set is a feature of zustand - updates the state of the spreadsheet by updating the value of currentlySelected
      set({ currentlySelected: newSelect });
    },

    /**
     * Returns whether the provided ICell is contained in the list of currently
     * selected ICells
     * @param cell the ICell to be determined if it is selected
     * @returns true if the ICell is selected, else false
     */
    isSelected: (cell: ICell) => {
      try {
        return get().currentlySelected.includes(cell);
      } catch {
        // invalid cell cannot be selected, so return false
        return false;
      }
    },

    /**
     * Get the list of all currently selected ICells
     * @returns currentlySelected
     */
    getSelected: () => {
      return get().currentlySelected;
    },

    /**
     * Adds a new, empty row above the topmost currently selected ICell
     * or below the bottommost currently selected ICell
     *
     * @param aboveOrBelow a string representing whether to add the row above or below
     * @sets cells
     */
    addRow: (aboveOrBelow: string) => {
      // If no location is selected, don't add a column
      if (get().currentlySelected.length === 0) {
        return;
      }

      // Set the column to check for highlights as the first column of
      // the currently selected cells
      let colToCheck = get().currentlySelected[0].getColumn();

      // Find the top and bottom selected rows
      let belowRow: number = -1;
      let aboveRow: number = get().cells[0].length;
      for (const cell of get().currentlySelected) {
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
      for (let i = 0; i < get().cells[0].length; i++) {
        newCells.push(new Cell(insertLocation, i));
      }

      // Create a temparary grid
      let newGrid: Array<Array<ICell>> = [];
      get().cells.forEach((element) => {
        let row: Array<ICell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });

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

      // Update the display values to update any references based on the new grid
      set({ cells: newGrid });
    },

    /**
     * Adds a new, empty column left of the leftmost currently selected ICell
     * or right of the rightmost currently selected ICell
     *
     * @param leftOrRight a string representing whether to add the column to the left or right
     * @sets cells
     */
    addColumn: (leftOrRight: string) => {
      // If no location is selected, don't add a column
      if (get().currentlySelected.length === 0) {
        return;
      }

      // Set the row to check for highlights as the first row of
      // the currently selected cells
      let rowToCheck = get().currentlySelected[0].getRow();

      // Find the leftmost and rightmost selected columns
      let rightCol: number = -1;
      let leftCol: number = get().cells.length;
      for (const cell of get().currentlySelected) {
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

      // Create a temparary grid
      let newGrid: Array<Array<ICell>> = [];
      get().cells.forEach((element) => {
        let row: Array<ICell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });

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
      set({ cells: newGrid });
    },

    /**
     * Removes every row that contains a currently selected ICell, UNLESS doing so would
     * result in the spreadsheet having no rows. In that case, it does nothing
     *
     * @sets cells
     */
    deleteRow: () => {
      // Start first row to delete at the last row
      let rowToDelete: number = get().cells[0].length;

      // Start the number of rows to delete at 0
      let numRowsToDelete: number = 0;

      // Set the column to check for highlights as the first column of
      // the currently selected cells
      let colToCheck = get().currentlySelected[0].getColumn();

      // Check for how many rows have at least one cell highlighted in them
      // and increment numRowsToDelete
      for (const cell of get().currentlySelected) {
        if (colToCheck === cell.getColumn()) {
          if (cell.getRow() < rowToDelete) {
            rowToDelete = cell.getRow();
          }
          numRowsToDelete++;
        }
      }

      // Create a temparary grid
      let newGrid: Array<Array<ICell>> = [];
      get().cells.forEach((element) => {
        let row: Array<ICell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });

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
      set({ cells: newGrid });
    },

    /**
     * Removes every column that contains a currently selected ICell, UNLESS doing so would
     * result in the spreadsheet having no columns. In that case, it does nothing
     *
     * @sets cells
     */
    deleteColumn: () => {
      // Start first col to delete at the last row
      let colToDelete: number = get().cells.length;

      // Start the number of cols to delete at 0
      let numColsToDelete: number = 0;

      // Set the row to check for highlights as the first column of
      // the currently selected cells
      let rowToCheck = get().currentlySelected[0].getRow();

      // Check for how many cols have at least one cell highlighted in them
      // and increment numColsToDelete
      for (const cell of get().currentlySelected) {
        if (rowToCheck === cell.getRow()) {
          if (cell.getColumn() < colToDelete) {
            colToDelete = cell.getColumn();
          }
          numColsToDelete++;
        }
      }

      // Create a temparary grid
      let newGrid: Array<Array<ICell>> = [];
      get().cells.forEach((element) => {
        let row: Array<ICell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });

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
      set({ cells: newGrid });
    },

    /**
     * Changes the entered value of an ICell
     * @param cellId the location of the ICell to change
     * @param newValue the new value of the ICell
     * @sets cells
     */
    editCell: (cellId: string, newValue: string) => {
      let newGrid: Array<Array<ICell>> = [];
      get().cells.forEach((element) => {
        let row: Array<ICell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });
      let loc: Array<number> = Util.getIndicesFromLocation(cellId);
      let row: number = loc[1];
      let col: number = loc[0];
      let cell: ICell = newGrid[row][col];
      cell.setEnteredValue(newValue);
      cell.updateDisplayValue(get().cells);
      set({ cells: newGrid });
    },

    /**
     * Changes the entered value of all currently selected ICells to be empty
     * @sets cells
     */
    clearSelectedCells: () => {
      let newSelectedGrid: Array<ICell> = [];
      // iterate through all currently selected cells and adds them to the new list of currently selected cells
      // doing this so that we can set the state of the spreadsheet at the end of this function
      get().currentlySelected.forEach((element) => {
        newSelectedGrid.push(element);
      });
      // clear every cell in the new list of selected cells
      newSelectedGrid.forEach((cell) => cell.clearCell());
      // this set is a feature of zustand - updates the state of the spreadsheet by updating the value of currentlySelected
      set({ currentlySelected: newSelectedGrid });
    },

    /**
     * Changes the entered value of all ICells to be empty
     * @sets cells
     */
    clearAllCells: () => {
      let newGrid: Array<Array<ICell>> = [];
      // iterate through all cells and adds them to the new grid of cells
      // doing this so that we can set the state of the spreadsheet at the end of this function
      get().cells.forEach((element) => {
        let row: Array<ICell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });
      // clear every cell in the new grid of cells
      newGrid.forEach((row) => row.forEach((cell) => cell.clearCell()));
      // this set is a feature of zustand - updates the state of the spreadsheet by updating the value of cells
      set({ cells: newGrid });
    },

    /**
     * Add the provided IValidationRule to the currently selected ICells
     * @param rule the IValidationRule being added to the selected ICells that enforces restrictions on the ICells' display values
     * @sets currentlySelected
     */
    createRule: (rule: IValidationRule) => {
      let newSelectedGrid: Array<ICell> = [];
      // iterate through all currently selected cells and adds them to the new list of currently selected cells
      // doing this so that we can set the state of the spreadsheet at the end of this function
      get().currentlySelected.forEach((element) => {
        newSelectedGrid.push(element);
      });
      // add rule to every selected cell
      newSelectedGrid.forEach((element) => {
        element.addRule(rule);
        element.updateDisplayValue(get().cells);
      });
      set({ currentlySelected: newSelectedGrid });
    },

    /**
     * Remove the provided IValidationRule from the currently selected ICells, if it is applied
     * @param rule the IValidationRule being removed from the selected ICells
     * @sets currentlySelected
     */
    removeRule: (rule: IValidationRule) => {
      let newSelectedGrid: Array<ICell> = [];
      // iterate through all currently selected cells and adds them to the new list of currently selected cells
      // doing this so that we can set the state of the spreadsheet at the end of this function
      get().currentlySelected.forEach((element) => {
        newSelectedGrid.push(element);
      });
      // remove rule from every selected cell
      newSelectedGrid.forEach((element) => {
        element.removeRule(rule);
        element.updateDisplayValue(get().cells);
      });
      set({ currentlySelected: newSelectedGrid });
    },

    /**
     * Returns an array of IValidationRules that are applied to EVERY currently selected ICells
     * @returns an array of IValidationRules that are applied to the currently selected ICells
     */
    getAllRules: () => {
      let rules: Array<IValidationRule> = new Array<IValidationRule>();
      // there will only be rules if there are cells selected
      if (get().currentlySelected.length > 0) {
        // start by getting all the rules of the first selected cell
        // which cell is being used is arbitrary, but using the first works for any number of selected cells
        // we do this because if a rule is not in the first cell, it is not in EVERY selected cell, and therefore wouldn't be returned
        let firstRules: Array<IValidationRule> =
          get().currentlySelected[0].getRules();
        // go through all currently selected cells and see if they contain the rules contained in firstRules
        for (let i: number = 0; i < firstRules.length; i++) {
          let contains: boolean = true;
          // if the rule is not in every cell, contains will be false, and we will not add the rule to our final list of rules
          // if it is every cell, contains will be true, and we will add the rule to our final list of rules
          get().currentlySelected.forEach(
            (cell) => contains && cell.getRules().includes(firstRules[i])
          );
          contains && rules.push(firstRules[i]);
        }
      }
      // return our final list of rules
      return rules;
    },

    /**
     * Find all the ICells in the spreadsheet that contain the provided string in their entered value, and selects the first ICell that does
     * @param find the string that the ICells' entered value should contain
     * @sets currentlySelected
     */
    findCellsContaining: (find: string) => {
      //   find all the cells containing find and store them
      //   set currently selected to contain only the first of the cells we just stored

      let selectCells: Array<ICell> = get().currentlySelected;

      if (find !== "") {
        let findAndReplaceCellsTemp: Array<ICell> = [];

        get().cells.forEach((row) => {
          row.forEach((element) => {
            if (element.getEnteredValue().indexOf(find) !== -1) {
              findAndReplaceCellsTemp.push(element);
            }
          });
        });

        if (findAndReplaceCellsTemp.length > 0) {
          selectCells = [];
          selectCells.push(findAndReplaceCellsTemp[0]);
        }
      } else {
        selectCells = [];
      }

      set({ currentlySelected: selectCells });
    },

    /**
     * Change the content of the currently selected ICell by replacing any instance
     * of the 'find' string in the ICell's entered value with the 'replace' string
     * @param find the string that the ICells' entered value should contain and be replaced
     * @param replace the value to replace instances of the 'find' string with
     * @sets cells, currentlySelected, via findNextContaining
     */
    replaceCurrentCell: (find: string, replace: string) => {
      if (find !== "") {
        if (get().currentlySelected.length > 0) {
          get().currentlySelected[0].findReplace(find, replace);
        }

        get().findNextContaining(find);
      }
    },

    /**
     * Select the next ICell in the spreadsheet that contains the provided 'find' string in its entered value
     * @param find the string that the ICells' entered value should contain
     * @sets cells, currentlySelected
     */
    findNextContaining: (find: string) => {
      if (!(get().currentlySelected.length > 0) || find === "") {
        return;
      }

      let newGrid: Array<Array<ICell>> = [];
      get().cells.forEach((element) => {
        let row: Array<ICell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });

      const rowCurrent: number = get().currentlySelected[0].getRow();

      const colCurrent: number = get().currentlySelected[0].getColumn();

      let currentlySelectedTemp: Array<ICell> = [];

      let done = false;
      for (let i = rowCurrent; i < get().cells.length; i++) {
        for (let j = 0; j < get().cells[0].length; j++) {
          let jj = j;
          if (i === rowCurrent) {
            if (j === 0) {
              continue;
            }
            jj = j + colCurrent;

            if (jj >= get().cells[0].length) {
              continue;
            }
          }
          const currentCell = get().cells[i][jj];
          if (currentCell.getEnteredValue().indexOf(find) !== -1) {
            done = true;
            currentlySelectedTemp = [currentCell];
            break;
          }
        }
        if (done) {
          break;
        }
      }
      newGrid.forEach((row: ICell[]) =>
        row.forEach((cell: ICell) => cell.updateDisplayValue(newGrid))
      );
      set({ cells: newGrid, currentlySelected: currentlySelectedTemp });
    },

    /**
     * Find all the ICells in the spreadsheet that contain the provided string in their entered value,
     * and replaces every instance of the 'find' string with the provided 'replace' string
     * @param find the string that the ICells' entered value should contain and be replaced
     * @param replace the value to replace instances of the 'find' string with
     * @sets cells
     */
    findAndReplaceAll: (find: string, replace: string) => {
      let newGrid: Array<Array<ICell>> = [];
      get().cells.forEach((element) => {
        let row: Array<ICell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });
      if (find !== "") {
        newGrid.forEach((row) => {
          row.forEach((element) => {
            element.findReplace(find, replace);
          });
        });
        newGrid.forEach((row: ICell[]) =>
          row.forEach((cell: ICell) => cell.updateDisplayValue(newGrid))
        );
      }

      set({ cells: newGrid });
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
    setStyle: (
      isCellStyled: (style: ICellStyle) => boolean,
      setCellStyle: (style: ICellStyle, value: boolean) => void
    ) => {
      let newSelected: ICell[] = [];
      let allStyled: boolean = true;
      get().currentlySelected.forEach((cell) => {
        allStyled = allStyled && isCellStyled(cell.getStyle());
      });

      get().currentlySelected.forEach((cell) => {
        let newStyle: ICellStyle = cell.getStyle();
        setCellStyle(newStyle, !allStyled);
        cell.setStyle(newStyle);
        newSelected.push(cell);
      });

      set({ currentlySelected: newSelected });
    },

    /**
     * Update the value of the text color property for all selected ICells' ICellStyle
     * @param textColor the color the text in the ICell should be
     * @sets currentlySelected
     */
    setTextColor: (textColor: string) => {
      let newSelected: ICell[] = [];
      get().currentlySelected.forEach((cell) => {
        let newStyle: ICellStyle = cell.getStyle();
        newStyle.setTextColor(textColor);
        cell.setStyle(newStyle);
        newSelected.push(cell);
      });
      set({ currentlySelected: newSelected });
    },
  })
);
