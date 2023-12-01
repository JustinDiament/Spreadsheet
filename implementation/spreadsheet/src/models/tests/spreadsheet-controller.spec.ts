/**
 * @file spreadsheet-controller.spec.ts
 * @testing SpreadsheetStateMachine
 */

import { ICell } from "../../interfaces/cell-interface";
import { ICellStyle } from "../../interfaces/cell-style-interface";
import { ISpreadSheetState } from "../../interfaces/controller-interface";
import { IValidationRule } from "../../interfaces/validation-rule-interface";
import { Cell } from "../cell";
import { SpreadsheetStateMachine } from "../spreadsheet-state-machine";

/**
 * small class that implements ISpreadSheetState for testing purposes 
 */

export class TestSpreadsheetState implements ISpreadSheetState {
  cells: ICell[][];
  currentlySelected: ICell[];

  public constructor() {
    this.cells = [];
    this.currentlySelected = [];

  }
  
  setSelectedOne(cell: string): void {
    throw new Error("setSelectedOne not implemented.");
  }
  setSelectedMany(cell1: string, cell2: string): void {
    throw new Error("setSelectedMany not implemented.");
  }
  isSelected(cell: ICell): boolean {
    throw new Error("isSelected not implemented.");
  }
  getSelected(): ICell[] {
    throw new Error("getSelected not implemented.");
  }
  addRow(aboveOrBelow: string): void {
    throw new Error("addRow not implemented.");
  }
  addColumn(leftOrRight: string): void {
    throw new Error("addColumn not implemented.");
  }
  deleteRow(): void {
    throw new Error("deleteRow not implemented.");
  }
  deleteColumn(): void {
    throw new Error("deleteColumn not implemented.");
  }
  editCell(cellId: string, newValue: string): void {
    throw new Error("editCell not implemented.");
  }
  clearSelectedCells(): void {
    throw new Error("clearSelectedCells not implemented.");
  }
  clearAllCells(): void {
    throw new Error("clearAllCells not implemented.");
  }
  createRule(rule: IValidationRule): void {
    throw new Error("createRule not implemented.");
  }
  removeRule(rule: IValidationRule): void {
    throw new Error("removeRule not implemented.");
  }
  getAllRules(): IValidationRule[] {
    throw new Error("getAllRules not implemented.");
  }
  findCellsContaining(find: string): void {
    throw new Error("findCellsContaining not implemented.");
  }
  replaceCurrentCell(find: string, replace: string): void {
    throw new Error("replaceCurrentCell not implemented.");
  }
  findNextContaining(find: string): void {
    throw new Error("findNextContaining not implemented.");
  }
  findAndReplaceAll(find: string, replace: string): void {
    throw new Error("findAndReplaceAll not implemented.");
  }
  setStyle(isCellStyled: (style: ICellStyle) => boolean, setCellStyle: (style: ICellStyle, value: boolean) => void): void {
    throw new Error("setStyle not implemented.");
  }
  setTextColor(textColor: string): void {
    throw new Error("setTextColor not implemented.");
  }

}

// tests for the SpreadsheetStateMachine class
describe("Testing the SpreadsheetStateMachine class", (): void => {
	let emptyCells: ICell[][];
  let fullCells: ICell[][];
	let currentlySelected: ICell[];
	let currentState: ISpreadSheetState;
  let cell1:ICell;
  let cell2:ICell;

	// set up a new empty spreadsheet state before every test
	beforeEach((): void => {
    currentState= new TestSpreadsheetState();
    // give us an empty grid of cells and a full grid of cells to work with
		emptyCells = [];
    fullCells = [];
		for (let i: number = 0; i < 4; i++) {
			let emptyrow: ICell[] = [];
      let filledRow: ICell[] = [];
			for (let j: number = 0; j < 4; j++) {
				emptyrow.push(new Cell(i, j));
        filledRow.push(new Cell(i, j));
			}
			emptyCells.push(emptyrow);
      fullCells.push(filledRow);
		}

    let i:number = 0;
    fullCells.forEach((row:ICell[]) => row.forEach((cell:ICell) => {cell.setEnteredValue(i.toString()); i++}))

		currentlySelected = [];
		currentState.cells = emptyCells;
		currentState.currentlySelected = currentlySelected;
    cell1 = new Cell(0, 0);
    cell2 = new Cell(2,1);
	});

	// Tests for setSelectedOne(currentState: ISpreadSheetState, cell: string): ISpreadSheetState,
	// setSelectedMany(currentState: ISpreadSheetState, cell1: string, cell2: string): ISpreadSheetState,
	// isSelected(currentState: ISpreadSheetState, cell: ICell): boolean, and
	// getSelected(currentState: ISpreadSheetState): ICell[]
	describe("Testing getters and setter for selected", () => {
    // testing isSelected with empty grid
    it('isSelected should return false if the grid is empty', () => {
      let tempGrid:ICell[][] = [];
      currentState.cells = tempGrid;
      expect(SpreadsheetStateMachine.isSelected(currentState, cell1)).toBe(false);
    });

    // testing isSelected returns false if no cell is selected
    it('isSelected should return false if no cell is selected', () => {
      expect(SpreadsheetStateMachine.isSelected(currentState, cell1)).toBe(false);

    });

    // testing isSelected returns false if an unselected cell is passed
    it('isSelected should return false if an unselected cell is passed', () => {
      currentState.currentlySelected.push(cell1);
      expect(SpreadsheetStateMachine.isSelected(currentState, cell2)).toBe(false);
    });

    // testing isSelected returns true if a selected cell is passed - only one selected
    it('isSelected should return true if single cell is selected', () => {
      currentState.currentlySelected.push(cell1);
      expect(SpreadsheetStateMachine.isSelected(currentState, cell1)).toBe(true);
    });

    // testing isSelected returns true if a selected cell is passed - one of many selected
    it('isSelected should return true if cell is one of many selected', () => {
      currentState.currentlySelected.push(cell1);
      currentState.currentlySelected.push(cell2);
      expect(SpreadsheetStateMachine.isSelected(currentState, cell2)).toBe(true);
    });

    // testing isSelected does not through an error for an out-of-bounds cell location
    it('isSelected should not throw an error if given an out of bounds cell', () => {
      let outOfBounds:ICell = new Cell(5, 5);
      expect(() => SpreadsheetStateMachine.isSelected(currentState, outOfBounds)).not.toThrow();
    });

    // testing getSelected returns nothing if no cell is selected
    it('getSelected should return an empty list if no cell selected', () => {
      expect(SpreadsheetStateMachine.getSelected(currentState)).toEqual(new Array<ICell>());
    });

    // testing getSelected does not through an error if the grid has no cells
    it('getSelected should not through an error if the grid has no cells', () => {
      let tempGrid:ICell[][] = [];
      currentState.cells = tempGrid;
      expect(() => SpreadsheetStateMachine.getSelected(currentState)).not.toThrow();
    });

    // testing getSelected returns a single selected cell
    it('getSelected should return an an array containing a single selected cell', () => {
      currentState.currentlySelected.push(cell2);
      expect(SpreadsheetStateMachine.getSelected(currentState)).toEqual([cell2]);
    });

    // testing getSelected returns multiple cells
    it('getSelected should return an array of multiple selected cells', () => {
      currentState.currentlySelected.push(cell2);
      currentState.currentlySelected.push(cell1);
      expect(SpreadsheetStateMachine.getSelected(currentState)).toEqual([cell2, cell1]);

    });


    // testing setSelectedOne returns ISpreadSheetState with the right cell selected
    it('currentlySelected should contain the cell sent to set select one', () => {
      SpreadsheetStateMachine.setSelectedOne(currentState, "A1");
      expect(currentState.currentlySelected).toEqual([cell1]);
    });

    // testing setSelectOne does not throw an error for an out-of-bounds cell location
    it('set select one should not throw an error for an out of bounds cell location', () => {
      SpreadsheetStateMachine.setSelectedOne(currentState, "A1");
      expect(() => SpreadsheetStateMachine.setSelectedOne(currentState, "G1")).not.toThrow();
    });

    // testing setSelectOne does not throw an error for an invalid cell location
    it('set select one should not throw an error for an invalid cell location syntax', () => {
      expect(() => SpreadsheetStateMachine.setSelectedOne(currentState, "01")).not.toThrow();
    });

    // testing setSelectedMany returns ISpreadSheetState with the right cells selected -- many in one row
    it('currentlySelected should contain cells in one row sent to set select many', () => {
      let cell3:ICell = new Cell(0,1);
      SpreadsheetStateMachine.setSelectedMany(currentState, "A1", "B1");
      expect(currentState.currentlySelected).toEqual([cell1, cell3]);
    });

    // testing setSelectedMany returns ISpreadSheetState with the right cells selected -- many in one column
    it('currentlySelected should contain cells in one column sent to set select many', () => {
      let cell3:ICell = new Cell(1,0);
      SpreadsheetStateMachine.setSelectedMany(currentState, "A1", "A2");
      expect(currentState.currentlySelected).toEqual([cell1, cell3]);
    });

    // testing setSelectedMany returns ISpreadSheetState with the right cells selected -- many in multiple rows and columns
    it('currentlySelected should contain cells in multiple columns and rows sent to set select many', () => {
      let cell3:ICell = new Cell(0,1);
      let cell4:ICell = new Cell(1,0)
      let cell5:ICell = new Cell(1,1)
      SpreadsheetStateMachine.setSelectedMany(currentState, "A1", "B2");
      expect(currentState.currentlySelected).toEqual([cell1, cell3, cell4, cell5]);
    });

    // testing setSelectedMany returns ISpreadSheetState with the right cells selected -- first selected is below and right of last selected
    it('currentlySelected should contain cells in multiple columns and rows in reverse order sent to set select many', () => {
      let cell3:ICell = new Cell(0,1);
      let cell4:ICell = new Cell(1,0)
      let cell5:ICell = new Cell(1,1)
      SpreadsheetStateMachine.setSelectedMany(currentState, "B2", "A1");
      expect(currentState.currentlySelected).toEqual([cell1, cell3, cell4, cell5]);
    });

    // testing setSelectedMany does not throw an error for an out-of-bounds cell location
    it('set select many should not throw an error for a cell out of bounds', () => {
      expect(() => SpreadsheetStateMachine.setSelectedMany(currentState, "A1", "C6")).not.toThrow();
    });

    // testing setSelectedMany does not throw an error for an invalid cell location
    it('set select many should not throw an error for an invalid cell location syntax', () => {
      expect(() => SpreadsheetStateMachine.setSelectedMany(currentState, "B2", "01")).not.toThrow();
    });

  });

	// Tests for addRow(currentState: ISpreadSheetState, aboveOrBelow: string): ISpreadSheetState,
	// addColumn(currentState: ISpreadSheetState, leftOrRight: string): ISpreadSheetState,
	// deleteRow(currentState: ISpreadSheetState): ISpreadSheetState, and
	// deleteColumn(currentState: ISpreadSheetState): ISpreadSheetState
	describe("Testing add and delete columns and rows", () => {

    let twoByone: ICell[][];
    let twoBytwo: ICell[][];
    let threeBytwo: ICell[][];

    beforeEach((): void => {
    twoByone = [[cell1, new Cell(1, 0)]];
    twoByone = [[], [], []]
    let threeBy
    // give us an empty grid of cells and a full grid of cells to work with
		emptyCells = [];
    fullCells = [];
		for (let i: number = 0; i < 4; i++) {
			let emptyrow: ICell[] = [];
      let filledRow: ICell[] = [];
			for (let j: number = 0; j < 4; j++) {
				emptyrow.push(new Cell(i, j));
        filledRow.push(new Cell(i, j));
			}
			emptyCells.push(emptyrow);
      fullCells.push(filledRow);
		}

    let i:number = 0;
    fullCells.forEach((row:ICell[]) => row.forEach((cell:ICell) => {cell.setEnteredValue(i.toString()); i++}))

		currentlySelected = [];
		currentState.cells = emptyCells;
		currentState.currentlySelected = currentlySelected;
    cell1 = new Cell(0, 0);
    cell2 = new Cell(2,1);
	});

    // testing addRow above results in the correct value of cells
    it('addRow above with one selected cell results in the correct value of cells', () => {
      cell1.setEnteredValue("hello");
      currentState.currentlySelected = [cell1];
      SpreadsheetStateMachine.addRow(currentState, "above");
      //expect(currentState.cells).toEqual()

    });

    // testing addRow below results in the correct value of cells
    it('addRow below with one selected cell results in the correct value of cells', () => {

    });

    // testing addRow above with multiple selected results in the correct value of cells
    it('addRow above with multiple selected cells results in the correct value of cells', () => {

    });

    // testing addRow below with multiple selected results in the correct value of cells
    it('addRow below with multiple selected cells results in the correct value of cells', () => {

    });

    // testing addRow with no cells selected causes no change in the value of cells
    it('addRow with no cells selected causes no change in the value of cells', () => {

    });

    // testing addColumn left results in the correct value of cells
    it('addColumn left with one selected cell results in the correct value of cells', () => {

    });

    // testing addColumn right results in the correct value of cells
    it('addColumn right with one selected cell results in the correct value of cells', () => {

    });

    // testing addColumn left with multiple selected results in the correct value of cells
    it('addColumn left with multiple selected cells results in the correct value of cells', () => {

    });

    // testing addColumn right with multiple selected results in the correct value of cells
    it('addColumn right with multiple selected cells results in the correct value of cells', () => {

    });

    // testing addColumn with no cells selected causes no change in the value of cells

    it('addColumn with no cells selected causes no change in the value of cells', () => {

    });

    // testing delete row with one selected row and more than one row in the grd

    // testing delete row with multiple selected rows, less than the number of rows in the grid

    // testing delete row where number of selected rows equal number of cell rows

    // testing delete row with no cell selected

    // testing delete column with one selected column and more than column row in the grd

    // testing delete column with multiple selected column, less than the number of column in the grid

    // testing delete column where number of selected column equal number of cell column

    // testing delete column with no cell selected


  });

	// Tests for editCell(currentState: ISpreadSheetState, cellId: string, newValue: string): ISpreadSheetState,
	// clearSelectedCells(currentState: ISpreadSheetState): ISpreadSheetState, and
	// clearAllCells(currentState: ISpreadSheetState): ISpreadSheetState
	describe("Testing edit, clear selected, and clear all cells", () => {
    // test the entered value of a cell after editCell with valid cellID
    it('test editCell changes the entered value of a cell at the given location', () => {

    });

    // test that edit cell does not throw error if invalid cellID provided

    // test clearing one selected cell with content works

    // test clearing multiple selected cells with content works

    // test clearing multiple empty cells results in the same value of cells

    // test clearing all cells with one nonempty cell

    // test clearing all cells with multiple nonempty cells


    


  });

	// Tests for createRule(currentState: ISpreadSheetState, rule: IValidationRule): ISpreadSheetState,
	// removeRule(currentState: ISpreadSheetState, rule: IValidationRule): ISpreadSheetState, and
	// getAllRules(currentState: ISpreadSheetState): IValidationRule[]
	describe("Testing create, delete, and get all rules", () => {


  });

	// Tests for findCellsContaining(currentState: ISpreadSheetState, find: string): ISpreadSheetState,
	// replaceCurrentCell(currentState: ISpreadSheetState, find: string, replace: string): ISpreadSheetState,
	// findNextContaining(currentState: ISpreadSheetState, find: string): ISpreadSheetState, and
	// findAndReplaceAll(currentState: ISpreadSheetState, find: string, replace: string): ISpreadSheetState
	describe("Testing find cells containing, find next containing, replace current or all cells", () => {


  });

  // Tests for setStyle(currentState: ISpreadSheetState, isCellStyled: (style: ICellStyle) => boolean, 
  //                    setCellStyle: (style: ICellStyle, value: boolean) => void): ISpreadSheetState, and
  // setTextColor(currentState: ISpreadSheetState, textColor: string): ISpreadSheetState
  describe("Testing set style and set text color", () => {


  });
});


