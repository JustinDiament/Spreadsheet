import { ISpreadSheetState } from "../interfaces/controller-interface";
import { IGraph } from "../interfaces/graph-interface";
import { IValidationRule } from "../interfaces/validation-rule-interface";
import { Cell } from "./cell";
import { IStrategy } from "../interfaces/strategy-interface";
import { CellRefStrategy } from "./strategy-cell-ref";
import { create } from "zustand";
// todo fix errors and warnings in terminal
// todo fix comments
// todo fix imports
// todo make things depend on a cell interface not the cell class
// todo error checking
// todo delete unneeded methods and members
// todo check the key errors in inspect element console

// local helper function to allow controller to easily convert a location such
// as "A1" to a set of column/row coordinates
const getIndicesFromLocation = (location: string): Array<number> => {
  // initiate the value of column and number to return
  let col: number = 0;
  let row: number = 0;
  // are we still parsing letters, or have we moved on to numbers?
  let stillLetters = true;
  // the remaining substring of the provided location
  let remainder: string = location;
  // check the provided location is not empty
  if (remainder.length !== 0) {
    // while there are characters to parse and we are still parsing letters
    while (remainder.length > 0 && stillLetters) {
      // is the first character of the remaining string an uppercase letter?
      let sub: string = remainder[0];
      if (sub.match(/[A-Z]/) !== null) {
        // get unicode value of letter and convert it to the format where A=0, B=1, ... Z=25
        // add to column because column values work as follows:
        // A = column 0, B = column 1, ... Z = column 25, AA = column 26, BB = column 27, .. etc
        col += sub.charCodeAt(0) - 65;
        // remove the value we just parsed from the remaining string
        remainder = remainder.substring(1);
      } else {
        // we are no longer parsing numbers, so convert what is left to a number
        stillLetters = false;
        row = Number(remainder.substring(0));
        if (isNaN(row)) {
          // if remaining location could not be converted to a number, it was invalid
          throw new Error("invalid location");
        }
      }
    }
  } else {
    throw new Error("invalid location");
  }
  // subtract 1 from row because the provided location started counting at 1, but we start at 0
  return [col, row - 1];
};

// local helper function to create an empty 10x10 grid of cells
// which the controller uses to instantiate the spreadsheet
const createCells = (): Array<Array<Cell>> => {
  // create empty 2d array of cells
  let cells: Array<Array<Cell>> = [];
  // iterate through 10 rows and add 10 cells to each row
  for (let i: number = 0; i < 10; i++) {
    let row: Array<Cell> = new Array<Cell>();
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

    findAndReplaceCells: new Array<Cell>(),

    // the list of cells in the spreadsheet that are currently selected by the user
    currentlySelected: [],

    /**
     * Set the list of currently selected cells in the spreadsheet to contain
     * only the provided cell, and no other
     * @param cell the cell to set as the currently selected cell, provided via its location
     */
    setSelectedOne: (cell: string) => {
      let newSelect: Array<Cell> = [];
      try {
        // parse the location of the cell and add the cell at that location to the new list
        // of currently selected cells
        let location: Array<number> = getIndicesFromLocation(cell);
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
      let newSelect: Array<Cell> = new Array<Cell>();
      try {
        // parse the location of the starting and ending cells and determine the range of values the selected cells fall within
        let location1: Array<number> = getIndicesFromLocation(cell1);
        let location2: Array<number> = getIndicesFromLocation(cell2);
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
    isSelected: (cell: Cell) => {
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

      let newCells: Array<Cell> = new Array<Cell>();
      for (let i = 0; i < get().cells[0].length; i++) {
        newCells.push(new Cell(insertLocation, i));
      }

      let newGrid: Array<Array<Cell>> = [];
      get().cells.forEach((element) => {
        let row: Array<Cell> = [];
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

      let newGrid: Array<Array<Cell>> = [];
      get().cells.forEach((element) => {
        let row: Array<Cell> = [];
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

      let newGrid: Array<Array<Cell>> = [];
      get().cells.forEach((element) => {
        let row: Array<Cell> = [];
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

      let newGrid: Array<Array<Cell>> = [];
      get().cells.forEach((element) => {
        let row: Array<Cell> = [];
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
      set({ cells: newGrid });
    },

    /**
     * Changes the value of a cell
     * @param cellId the location of the cell to change
     * @param newValue the new value of the cell
     */

    editCell: (cellId: string, newValue: any) => {
      // todo: any should be string???
      // todo: need interface for cell

      let newGrid: Array<Array<Cell>> = [];
      get().cells.forEach((element) => {
        let row: Array<Cell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });
      let loc: Array<number> = getIndicesFromLocation(cellId);
      let row: number = loc[1];
      let col: number = loc[0];
      let cell: Cell = newGrid[row][col];
      cell.setEnteredValue(newValue);
      cell.updateDisplayValue(get().cells);
      set({ cells: newGrid });
      //I think this is where we would pass in the strategies and parse the string
    },

    /**
     * Removes the value of all the currently selected cells
     */
    clearSelectedCells: () => {
      let newSelectedGrid: Array<Cell> = [];
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
      let newGrid: Array<Array<Cell>> = [];
      // iterate through all cells and adds them to the new grid of cells
      // doing this so that we can set the state of the spreadsheet at the end of this function
      get().cells.forEach((element) => {
        let row: Array<Cell> = [];
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
      // add rule to every selected cell
      get().currentlySelected.forEach((element) => element.addRule(rule));
    },

    /**
     * Removes a validation rule from a cell
     * @param rule the rule that should no longer apply
     */
    removeRule: (rule: IValidationRule) => {
      // remove rule from every selected cell
      get().currentlySelected.forEach((element) => element.removeRule(rule));
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
    //   TODO
    //   find all the cells containing find and store them /somewhere/
    //   set currently selected to contain only the first of the cells we just stored
        let findAndReplaceCellsTemp: Array<Cell> = [];
        let selectCells: Array<Cell> = get().currentlySelected;
        console.log("did this");
        get().cells.forEach((row) => {
            row.forEach((element) => {
                if (element.getEnteredValue().indexOf(find) !== -1) {
                    console.log("adding");
                    findAndReplaceCellsTemp.push(element);
                }
            })

        });
        console.log(findAndReplaceCellsTemp);

        if (findAndReplaceCellsTemp.length > 0) {
            console.log("doing this too");
            selectCells = [];
            selectCells.push(findAndReplaceCellsTemp[0]);
            // set({ currentlySelected: [findAndReplaceCellsTemp[0]] });
            findAndReplaceCellsTemp.shift();
        }
        console.log(findAndReplaceCellsTemp);
        set({ currentlySelected: selectCells, findAndReplaceCells: findAndReplaceCellsTemp });
        // set({  });
        console.log(get().findAndReplaceCells);
        if(get().currentlySelected.length > 0) {
          console.log(get().currentlySelected[0].getColumn() + " currently selected")
        }
        else {
          console.log("nothing selected");
        }
        
    },

    /**
     * Change the content of the currently selected cell by replacing any instance
     * of the 'find' string in the cell with the 'replace' string
     * @param find the value to be replaced
     * @param replace the value to replace with
     */
    replaceCurrentCell: (find: string, replace: string) => {
      console.log(get().currentlySelected[0]);
      let newGrid:Array<Array<Cell>> = [];
        // let selectCells: Array<Cell> = get().currentlySelected;
        console.log("did this");
       get().cells.forEach((element) => {
        let row: Array<Cell> = [];
        element.forEach((cell) => row.push(cell));
        newGrid.push(element);
      });


        get().currentlySelected[0].findReplace(find, replace);

        const rowCurrent: number = get().currentlySelected[0].getRow();
       const colCurrent: number = get().currentlySelected[0].getColumn();

       set({ currentlySelected: [] });

       let done = false;
       for (let i=rowCurrent; i < get().cells.length; i++) {
            for (let j=0; j < get().cells[0].length; j++) {
                if (j===0) {
                    j = j + colCurrent;
                }
                const currentCell = get().cells[i][j];
                if (currentCell.getEnteredValue().indexOf(find) !== -1) {
                    set({ currentlySelected: [currentCell] });
                    done = true;
                    break;
                }
            }  
            if (done) {
                break;
            }
       }

       set({cells: newGrid});

       console.log("got out");

        // get().cells.forEach((row) => {
        //     row.forEach((element) => {
        //         if (element.getEnteredValue().indexOf(find) !== -1 && element.getRow() >= get().currentlySelected[0].getRow() && element.getColumn() >= get().currentlySelected[0].getColumn()) {
        //             console.log("adding");
        //             findAndReplaceCellsTemp.push(element);
        //         }
        //     })

        // });

        // let findReplaceCellsTemp: Cell[] = get().findAndReplaceCells;
        // let nextCell: Cell | undefined = findReplaceCellsTemp.shift();

        // let currentlySelectedTemp: Cell[];
        // if (!nextCell) {
        //     currentlySelectedTemp = [];
        // }
        // else {
        //     currentlySelectedTemp = [nextCell];
        // }

        // set({ findAndReplaceCells: findReplaceCellsTemp, currentlySelected: currentlySelectedTemp });
              // TODO make page actually autoupdate for highlight (all else autoupdates already)
    },

    /**
     * select the next cell that is in the list of currently found cells
     * which is created in the findCellsContaining function
     */
    findNextContaining: () => {
      // TODO
      // set currently selected to contain only the next of the cells we stored in
      // findCellsContaining()
      // if the currently selected is the last cell, set next to the first
      // if there are no cells to be replaced, do nothing
    },

    /**
     * Finds where a value is present and replaces all instances of it with a new value at the selected id
     * @param find the value to find
     * @param replace the value to change to
     */
    findAndReplaceAll: (find: string, replace: string) => {
        let newGrid: Array<Array<Cell>> = [];
        get().cells.forEach((element) => {
          let row: Array<Cell> = [];
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
     * Creates a graph based on a selection of cells
     * @param cells the cells to base the graph on
     */
    createGraph: (cells: Array<Cell>) => {},

    /**
     * Deletes a graph from the spreadsheet
     * @param graphId the id of the graph to remove
     */
    deleteGraph: (graphId: number) => {},

    /**
     * Sets a graph x axis name
     * @param id the id of the graph to be renamed
     * @param name the new name
     */
    setGraphXAxisName: (id: number, name: string) => {},

    /**
     * Sets a graph y axis name
     * @param id the id of the graph to have its x axis renamed
     * @param name the new name
     */
    setGraphYAxisName: (id: number, name: string) => {},

    /**
     * Sets a graph name
     * @param id the id of the graph to have its y axis renamed
     * @param name the new name
     */
    setGraphName: (id: number, name: string) => {},
  })
);
