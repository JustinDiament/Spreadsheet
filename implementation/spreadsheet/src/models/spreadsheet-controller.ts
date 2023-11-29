import { ISpreadSheetState } from "../interfaces/controller-interface";
import { IValidationRule } from "../interfaces/validation-rule-interface";
import { Cell } from "./cell";
import { create } from "zustand";
import { ICellStyle } from "../interfaces/cell-style-interface";
import { ICell } from "../interfaces/cell-interface";
import { Util } from "./util";
// todo fix errors and warnings in terminal
// todo fix comments
// todo fix imports
// todo make things depend on a cell interface not the cell class
// todo error checking
// todo delete unneeded methods and members
// todo check the key errors in inspect element console


// local helper function to create an empty 10x10 grid of cells
// which the controller uses to instantiate the spreadsheet
const createCells = (): Array<Array<ICell>> => {
  // create empty 2d array of cells
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

// representation of the spreadsheet controller, which manages the current state
// of the spreadsheet
export const useSpreadsheetController = create<ISpreadSheetState>(
  (set, get) => ({
    // the 2d array/grid of cells in the spreadsheet, instantiated as an
    // empty 10x10 grid of cells
    cells: createCells(),

    // the list of graphs created inside the spreadsheet by the user
    graphs: [],

    findAndReplaceCells: new Array<ICell>(),

    // the list of cells in the spreadsheet that are currently selected by the user
    currentlySelected: [],

    /**
     * Set the list of currently selected cells in the spreadsheet to contain
     * only the provided cell, and no other
     * @param cell the cell to set as the currently selected cell, provided via its location
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
     * Set the list of currently selected cells in the spreadsheet to contain only
     * the cells that fall within the range of cells determined by the provided starting and ending points
     * @param cell1 the first cell in the range of cells to select
     * @param cell2  the last cell in the range of cells to select
     */
    setSelectedMany: (cell1: string, cell2: string) => {
      let newSelect: Array<ICell> = new Array<ICell>();
      try {
        // parse the location of the starting and ending cells and determine the range of values the selected cells fall within
        let location1: Array<number> = Util.getIndicesFromLocation(cell1);
        let location2: Array<number> = Util.getIndicesFromLocation(cell2);
        // using min and max so that a user could select a starting value that is below and to the right of the 
        // ending value, and still be able to select all cells within that range
        let colStart: number = Math.min(location1[0], location2[0]);
        let colEnd: number = Math.max(location1[0], location2[0]);
        let rowStart: number = Math.min(location1[1], location2[1]);
        let rowEnd: number = Math.max(location1[1], location2[1]);
        // iterate through all cells in the determined range and add them to the new list of currently selected cells
        for (let i: number = rowStart; i <= rowEnd; i++) {
          for (let j: number = colStart; j <= colEnd; j++) {
            newSelect.push(get().cells[i][j]);
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
     * Returns whether the provided cell is contained in the list of currently
     * selected cells
     * @param cell the cell to be determined if it is selected
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
     * Get the list of all currently selected cells
     */
    getSelected: () => {
      return get().currentlySelected;
    },

    /**
     * Adds a new row to the spreadsheet
     * @param aboveOrBelow a string value that states whether the row should be added above the topmost currently selected cell
     * or below the bottommost currently selected cell
     */
    addRow: (aboveOrBelow: string) => {
      let belowRow: number = -1;
      let aboveRow: number = get().cells[0].length;
      let numRowsToAdd: number = 0;
      let colToCheck = get().currentlySelected[0].getColumn();

      for (const cell of get().currentlySelected) {
        if (colToCheck === cell.getColumn()) {
          if (cell.getRow() > belowRow) {
            belowRow = cell.getRow();
          }

          if (cell.getRow() < aboveRow) {
            aboveRow = cell.getRow();
          }

          numRowsToAdd++;
        }
      }

      let insertLocation;
      if (aboveOrBelow === "above") {
        insertLocation = aboveRow;
      } else {
        insertLocation = belowRow + 1;
      }

      let newCells: Array<ICell> = new Array<ICell>();
      for (let i = 0; i < get().cells[0].length; i++) {
        newCells.push(new Cell(insertLocation, i));
      }

      let newGrid: Array<Array<ICell>> = [];
      get().cells.forEach((element) => {
        let row: Array<ICell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });

      for (let i = 0; i < numRowsToAdd; i++) {
        newGrid.splice(insertLocation, 0, newCells);
      }

      for (let i = insertLocation + 1; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[0].length; j++) {
          newGrid[i][j].setRow(i);
        }
      }

      newGrid.forEach((row: ICell[]) => row.forEach((cell:ICell) => (cell.updateDisplayValue(newGrid))));

      set({ cells: newGrid });
    },

    /**
     * Adds a new column to the spreadsheet
     * @param leftOrRight a string value that states whether the column should be added left of the leftmost currently selected cell
     * or right of the rightmost currently selected cell
     */
    addColumn: (leftOrRight: string) => {
      let leftCol: number = -1;
      let rightCol: number = get().cells.length;
      let numColsToAdd: number = 0;
      let rowToCheck = get().currentlySelected[0].getRow();

      for (const cell of get().currentlySelected) {
        if (rowToCheck === cell.getRow()) {
          if (cell.getColumn() > leftCol) {
            leftCol = cell.getColumn();
          }

          if (cell.getColumn() < rightCol) {
            rightCol = cell.getColumn();
          }

          numColsToAdd++;
        }
      }

      let insertLocation;
      if (leftOrRight === "left") {
        insertLocation = leftCol;
      } else {
        insertLocation = rightCol + 1;
      }

      let newGrid: Array<Array<ICell>> = [];
      get().cells.forEach((element) => {
        let row: Array<ICell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });

      for (let i = 0; i < newGrid.length; i++) {
        for (let j = 0; j < numColsToAdd; j++) {
          newGrid[i].splice(insertLocation, 0, new Cell(i, insertLocation));
        }
      }

      for (let i = 0; i < newGrid.length; i++) {
        for (let j = insertLocation + 1; j < newGrid[0].length; j++) {
          newGrid[i][j].setColumn(j);
        }
      }

      newGrid.forEach((row: ICell[]) => row.forEach((cell:ICell) => (cell.updateDisplayValue(newGrid))));
      set({ cells: newGrid });
    },

    /**
     * Removes the currently selected rows from the spreadsheet
     */
    deleteRow: () => {
      // todo check if any rows exist
      // todo check if they are deleting the last row and don't let them do that
      let rowToDelete: number = get().cells[0].length;
      let numRowsToDelete: number = 0;
      let colToCheck = get().currentlySelected[0].getColumn();

      for (const cell of get().currentlySelected) {
        if (colToCheck === cell.getColumn()) {
          if (cell.getRow() < rowToDelete) {
            rowToDelete = cell.getRow();
          }
          numRowsToDelete++;
        }
      }

      let newGrid: Array<Array<ICell>> = [];
      get().cells.forEach((element) => {
        let row: Array<ICell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });

      for (let i = 0; i < numRowsToDelete; i++) {
        newGrid.splice(rowToDelete, 1);
      }

      for (let i = rowToDelete; i < newGrid.length; i++) {
        for (let j = 0; j < newGrid[0].length; j++) {
          newGrid[i][j].setRow(newGrid[i][j].getRow() - numRowsToDelete);
        }
      }
      newGrid.forEach((row: ICell[]) => row.forEach((cell:ICell) => (cell.updateDisplayValue(newGrid))));
      set({ cells: newGrid });
    },

    /**
     * Removes the currently selected columns from the spreadsheet
     */
    deleteColumn: () => {
      // todo check if any cols exist
      // todo check if they are deleting the last col and don't let them do that
      let colToDelete: number = get().cells.length;
      let numColsToDelete: number = 0;
      let rowToCheck = get().currentlySelected[0].getRow();

      for (const cell of get().currentlySelected) {
        if (rowToCheck === cell.getRow()) {
          if (cell.getColumn() < colToDelete) {
            colToDelete = cell.getColumn();
          }
          numColsToDelete++;
        }
      }

       let newGrid: Array<Array<ICell>> = [];
      get().cells.forEach((element) => {
        let row: Array<ICell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      }); 

      for (let i = 0; i < numColsToDelete; i++) {
        for (let j = 0; j < newGrid.length; j++) {
          newGrid[j].splice(colToDelete, 1);
        }
      }

      for (let i = 0; i < newGrid.length; i++) {
        for (let j = colToDelete; j < newGrid[0].length; j++) {
          newGrid[i][j].setColumn(newGrid[i][j].getColumn() - numColsToDelete);
        }
      }
      newGrid.forEach((row: ICell[]) => row.forEach((cell:ICell) => (cell.updateDisplayValue(newGrid))));
      set({ cells: newGrid });
    },

    /**
     * Changes the value of a cell
     * @param cellId the location of the cell to change
     * @param newValue the new value of the cell
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
     * Removes the value of all the currently selected cells
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
     * Removes the value of every cell in the spreadsheet
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
     * Adds a validation rule to a cell
     * @param rule the new rule that the value must adhere to
     */
    createRule: (rule: IValidationRule) => {
      let newSelectedGrid: Array<ICell> = [];
      // iterate through all currently selected cells and adds them to the new list of currently selected cells
      // doing this so that we can set the state of the spreadsheet at the end of this function
      get().currentlySelected.forEach((element) => {
        newSelectedGrid.push(element);
      });
      // add rule to every selected cell
      newSelectedGrid.forEach((element) => {element.addRule(rule); element.updateDisplayValue(get().cells)});
      set({currentlySelected: newSelectedGrid});
    },

    /**
     * Removes a validation rule from a cell
     * @param rule the rule that should no longer apply
     */
    removeRule: (rule: IValidationRule) => {
      let newSelectedGrid: Array<ICell> = [];
      // iterate through all currently selected cells and adds them to the new list of currently selected cells
      // doing this so that we can set the state of the spreadsheet at the end of this function
      get().currentlySelected.forEach((element) => {
        newSelectedGrid.push(element);
      });
      // remove rule from every selected cell
      newSelectedGrid.forEach((element) => {element.removeRule(rule); element.updateDisplayValue(get().cells)});
      set({currentlySelected: newSelectedGrid});
      
    },

    /**
     * Get a list of every rule that applies to every cell that is currently selected
     * @returns an array containing all the validation rules that apply to EVERY selected cell
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
     * Find all the cells in the spreadsheet that contain the provided string
     * and stores the data in an array
     * @param find the string that the cells' entered value should contain
     */
    findCellsContaining: (find: string) => {
    //   find all the cells containing find and store them 
    //   set currently selected to contain only the first of the cells we just stored
        let findAndReplaceCellsTemp: Array<ICell> = [];
        let selectCells: Array<ICell> = get().currentlySelected;
        get().cells.forEach((row) => {
            row.forEach((element) => {
                if (element.getEnteredValue().indexOf(find) !== -1) {
                    findAndReplaceCellsTemp.push(element);
                }
            })

        });

        if (findAndReplaceCellsTemp.length > 0) {
            selectCells = [];
            selectCells.push(findAndReplaceCellsTemp[0]);
        }
        set({ currentlySelected: selectCells});
        
    },

    /**
     * Change the content of the currently selected cell by replacing any instance
     * of the 'find' string in the cell with the 'replace' string
     * @param find the value to be replaced
     * @param replace the value to replace with
     */
    replaceCurrentCell: (find: string, replace: string) => {
        if (get().currentlySelected.length > 0) {
            get().currentlySelected[0].findReplace(find, replace);
        }

        get().findNextContaining(find);
    },

    /**
     * select the next cell that is in the list of currently found cells
     * which is created in the findCellsContaining function
     */
    findNextContaining: (find: string) => {
        if (!(get().currentlySelected.length > 0 || find==="")) {
            return;
        }

        
        let newGrid:Array<Array<ICell>> = [];
         get().cells.forEach((element) => {
          let row: Array<ICell> = [];
          element.forEach((cell) => row.push(cell));
          newGrid.push(element);
        });

        const rowCurrent: number = get().currentlySelected[0].getRow();

        const colCurrent: number = get().currentlySelected[0].getColumn();

        let currentlySelectedTemp: Array<ICell> = []
 
 
        let done = false;
        for (let i=rowCurrent; i < get().cells.length; i++) {
             for (let j=0; j < get().cells[0].length; j++) {
                let jj = j;
                 if (i===rowCurrent) {
                    if (j===0) {
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

        set({ cells: newGrid, currentlySelected: currentlySelectedTemp });
    },

    /**
     * Finds where a value is present and replaces all instances of it with a new value at the selected id
     * @param find the value to find
     * @param replace the value to change to
     */
    findAndReplaceAll: (find: string, replace: string) => {
        let newGrid: Array<Array<ICell>> = [];
        get().cells.forEach((element) => {
          let row: Array<ICell> = [];
          element.forEach((cell) => row.push(cell));
          newGrid.push(element);
        });

        newGrid.forEach((row) => {
        row.forEach((element) => {
           element.findReplace(find, replace);
        });
      });

      set( { cells: newGrid });
    },

   

    
     /**
     * Set the style of the selected cells using the provided functions for determining
     * if a style property is active, and function to set that property's value
     * 
     * If all selected cells have the provided style property activated, it will be deactivated. 
     * Otherwise, it will be activated for all selected cells
     * @param isCellStyled the function for determining if a style property is active
     * @param setCellStyle the function to set a style property's value
     */
    setStyle:(isCellStyled:(style:ICellStyle) => boolean, setCellStyle:(style:ICellStyle, value:boolean) => void) =>{
      let newSelected:ICell[] = [];
      let allStyled:boolean = true;
      get().currentlySelected.forEach(cell => {
        allStyled = allStyled && isCellStyled(cell.getStyle());
      });
      
        get().currentlySelected.forEach(cell => {
          let newStyle: ICellStyle = cell.getStyle();
          setCellStyle(newStyle, !allStyled);
          cell.setStyle(newStyle);
          newSelected.push(cell);
      });
      
      set({currentlySelected: newSelected});
    },

    /**
     * Update the color of the text for all selected cells
     * @param textColor the color the text in the cells should be
     */
    setTextColor: (textColor:string) => {
      let newSelected:ICell[] = [];
      get().currentlySelected.forEach(cell => {
          let newStyle: ICellStyle = cell.getStyle();
          newStyle.setTextColor(textColor);
          cell.setStyle(newStyle);
          newSelected.push(cell);
      });
      set({currentlySelected: newSelected});
    },
  })

);
