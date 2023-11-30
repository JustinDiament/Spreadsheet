/**
 * @file cell.spec.ts
 * @testing ICell
 */

import { ICell } from "../../interfaces/cell-interface";
import { ICellStyle } from "../../interfaces/cell-style-interface";
import { IValidationRule } from "../../interfaces/validation-rule-interface";
import { Cell } from "../cell";
import { ErrorDisplays } from "../cell-data-errors-enum";
import { CellStyle } from "../cell-style";
import { ValueInRangeRule } from "../value-in-range-rule";
import { ValueIsOneOfRule } from "../value-is-one-of-rule";
import { ValueTypeRule } from "../value-type-rule";

// tests for the ICell interface
describe("Testing the ICell interface", (): void => {
	// Tests for getRow(): number, getColumn():number, setRow(number): void, and setColumn(number): void
	describe("Testing getters and setters for row and column", (): void => {
		// testing getRow(): number on initial value
		it("getRow() return the initial value of row", (): void => {
			let cell: ICell = new Cell(3, 5);
			expect(cell.getRow()).toEqual(3);
		});

		// testing getRow(): number on initial value
		it("getColumn() return the initial value of column", (): void => {
			let cell: ICell = new Cell(5, 8);
			expect(cell.getColumn()).toEqual(8);
		});

		// testing setRow(number): void with new value
		it("getRow() should return the value sent to setRow()", (): void => {
			let cell: ICell = new Cell(2, 1);
			cell.setRow(5);
			expect(cell.getRow()).toEqual(5);
		});

		// testing setColumn(number): void with new value
		it("getColumn() should return the value sent to setColumn()", (): void => {
			let cell: ICell = new Cell(2, 6);
			cell.setColumn(19);
			expect(cell.getColumn()).toEqual(19);
		});
	});

	// Tests for getEnteredValue(): string and setEnteredValue(string): void
	describe("Testing getter and setter for entered value", (): void => {
		// create a fresh cell for each test
		let cell: ICell;
		beforeEach((): void => {
			cell = new Cell(1, 1);
		});

		// testing getEnteredValue(): string on initial value
		it("getEnteredValue() should return the initial value of enteredValue", (): void => {
			expect(cell.getEnteredValue()).toEqual("");
		});

		// testing setEnteredValue(): string with new value
		it("getEnteredValue() should return the value sent to setEnteredValue()", (): void => {
			cell.setEnteredValue("hello");
			expect(cell.getEnteredValue()).toEqual("hello");
		});
	});

	// Tests for getDisplayValue(): string, updateDisplayValue(cells: Array<Array<ICell>>):string
	// where the resulting display value is NOT an error
	describe("Testing getter and update for display value - valid entered input", (): void => {
		// create a fresh cell and 3x3 grid for each test
		let cell: ICell;
		let grid: ICell[][];
		beforeEach((): void => {
			cell = new Cell(1, 1);
			grid = [];
			for (let i: number = 0; i < 3; i++) {
				let row: ICell[] = [];
				for (let j: number = 0; j < 3; j++) {
					row.push(new Cell(i, j));
				}
				grid.push(row);
			}
			cell = grid[2][2];
		});

		// testing getDisplayValue(cells: Array<Array<ICell>>): string on initial value
		it("getDisplayValue() should return the initial value of displayValue", (): void => {
			expect(cell.getDisplayValue()).toEqual("");
		});

		// BASIC VALUE ENTERING

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value is in initial state/unchanged
		it("should not change display value if entered value stays the same", (): void => {
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value has been changed to a plain string
		it("should display the plain string entered value was set to", (): void => {
			cell.setEnteredValue("hello world");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("hello world");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value has been changed from a non-empty value to an empty value
		it("should display an empty cell when the entered value is changed to empty", (): void => {
			cell.setEnteredValue("hello world");
			cell.updateDisplayValue(grid);
			cell.setEnteredValue("");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("");
		});

		// REFERENCES

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a reference to an empty cell
		it("should display an empty cell when entered value references empty cell", (): void => {
			cell.setEnteredValue("REF(B1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a reference to a cell containing a plain string
		it("should display the correct value when entered value references plain nonempty cell", (): void => {
			grid[0][0].setEnteredValue("hello");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("hello");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a reference to a cell containing a reference to a third cell
		it("should display the correct value when entered value references a cell that references a third cell", (): void => {
			grid[0][0].setEnteredValue("REF(A2)");
			grid[0][0].updateDisplayValue(grid);
			grid[1][0].setEnteredValue("hello");
			grid[1][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("hello");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a reference to a cell that has changed since it was initially referenced
		it("should display the correct value when entered value references a cell whose value has since changed", (): void => {
			grid[0][0].setEnteredValue("goodbye");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			grid[0][0].setEnteredValue("hello");
			grid[0][0].updateDisplayValue(grid);
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("hello");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a reference to a cell that has been cleared since it was initially referenced
		it("should display an empty cell when entered value references a cell whose value has since cleared", (): void => {
			grid[0][0].setEnteredValue("goodbye");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			grid[0][0].setEnteredValue("");
			grid[0][0].updateDisplayValue(grid);
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a reference to a cell that has been cleared since it was initially referenced
		it("should display the correct value when entered value references two cells in a row", (): void => {
			grid[0][0].setEnteredValue("good");
			grid[0][0].updateDisplayValue(grid);
			grid[1][0].setEnteredValue("bye");
			grid[1][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)REF(A2)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("goodbye");
		});

		// SUM

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains sum of one empty cell
		it("should contain the sum of one empty cell", (): void => {
			cell.setEnteredValue("SUM(A1..A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("0");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains sum of one non empty cell
		it("should contain the sum of one non empty cell", (): void => {
			grid[0][0].setEnteredValue("2");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("SUM(A1..A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("2");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains sum of more than one empty cell
		it("should contain the sum of multiple empty cells", (): void => {
			cell.setEnteredValue("SUM(B1..C2)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("0");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains sum of more than one non empty cell
		it("should contain the sum of multiple non empty cells", (): void => {
			for (let i: number = 0; i < grid.length; i++) {
				for (let j: number = 0; j < grid[0].length; j++) {
					grid[i][j].setEnteredValue((i * 5 + j).toString());
					grid[i][j].updateDisplayValue(grid);
				}
			}
			cell.setEnteredValue("SUM(B1..C2)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("16");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains sum of more than one non empty cell after one of the cells in the sum has changed value
		it("should contain the sum of multiple non empty cells after one has changed", (): void => {
			for (let i: number = 0; i < grid.length; i++) {
				for (let j: number = 0; j < grid[0].length; j++) {
					grid[i][j].setEnteredValue((i * 5 + j).toString());
					grid[i][j].updateDisplayValue(grid);
				}
			}
			cell.setEnteredValue("SUM(B1..C2)");
			cell.updateDisplayValue(grid);
			grid[0][1].setEnteredValue("0");
			grid[0][1].updateDisplayValue(grid);
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("15");
		});

		// AVERAGE

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains average of one empty cell
		it("should contain the average of one empty cell", (): void => {
			cell.setEnteredValue("AVERAGE(A1..A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("0");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains average of one non empty cell
		it("should contain the average of one non empty cell", (): void => {
			grid[0][0].setEnteredValue("2");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("AVERAGE(A1..A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("2");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains average of more than one empty cell
		it("should contain the average of multiple empty cells", (): void => {
			cell.setEnteredValue("AVERAGE(B1..C2)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("0");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains average of more than one non empty cell
		it("should contain the average of multiple non empty cells", (): void => {
			for (let i: number = 0; i < grid.length; i++) {
				for (let j: number = 0; j < grid[0].length; j++) {
					grid[i][j].setEnteredValue((i * 5 + j).toString());
					grid[i][j].updateDisplayValue(grid);
				}
			}
			cell.setEnteredValue("AVERAGE(B1..C2)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("4");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains average of more than one non empty cell after one of the cells in the average has changed value
		it("should contain the average of multiple non empty cells after one has changed", (): void => {
			for (let i: number = 0; i < grid.length; i++) {
				for (let j: number = 0; j < grid[0].length; j++) {
					grid[i][j].setEnteredValue((i * 5 + j).toString());
					grid[i][j].updateDisplayValue(grid);
				}
			}
			cell.setEnteredValue("AVERAGE(B1..C2)");
			cell.updateDisplayValue(grid);
			grid[0][1].setEnteredValue("5");
			grid[0][1].updateDisplayValue(grid);
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("5");
		});

		// FORMULAS

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a string concatenation - 2 strings
		it("should display the concatenation of two strings", (): void => {
			cell.setEnteredValue("hello + world");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("hello  world");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a string concatenation - 4 strings
		it("should display the concatenation of four strings", (): void => {
			cell.setEnteredValue("hello + world +good+bye");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("hello  world goodbye");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a negative number
		it("should display the result of a negative number", (): void => {
			cell.setEnteredValue("-3");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("-3");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a positive number with a plus
		it("should display a number when the entered number contains plus first", (): void => {
			cell.setEnteredValue("+3");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("3");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a simple formula
		it("should display the result a simple formula", (): void => {
			cell.setEnteredValue("1 + 2 - 3");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("0");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a formula that uses order of operations
		it("should display the result a formula using order of operations", (): void => {
			cell.setEnteredValue("1 + 2 * 3^(2/2)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("7");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a formula that contains a reference to another cell
		it("should display the result a formula that contains a reference to another cell", (): void => {
			grid[0][1].setEnteredValue("5");
			grid[0][1].updateDisplayValue(grid);
			grid[1][1].setEnteredValue("11");
			grid[1][1].updateDisplayValue(grid);
			cell.setEnteredValue("REF(B1)+REF(B2)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("16");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a formula that contains a SUM
		it("should display the result a formula that contains a SUM", (): void => {
			grid[0][1].setEnteredValue("5");
			grid[0][1].updateDisplayValue(grid);
			grid[1][1].setEnteredValue("11");
			grid[1][1].updateDisplayValue(grid);
			cell.setEnteredValue("SUM(B1..B2)+8");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("24");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a formula that contains a AVERAGE
		it("should display the result a formula that contains an AVERAGE", (): void => {
			grid[0][1].setEnteredValue("5");
			grid[0][1].updateDisplayValue(grid);
			grid[1][1].setEnteredValue("11");
			grid[1][1].updateDisplayValue(grid);
			cell.setEnteredValue("AVERAGE(B1..B2)+8");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("16");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered contains a formula that contains a AVERAGE, SUM, REF, and order of operations
		it("should display the result of a complex formula", (): void => {
			for (let i: number = 0; i < grid.length; i++) {
				for (let j: number = 0; j < grid[0].length; j++) {
					grid[i][j].setEnteredValue((i + j).toString());
					grid[i][j].updateDisplayValue(grid);
				}
			}
			cell.setEnteredValue("AVERAGE(B1..B2)+SUM(A1..C2)*REF(B1)^(6/3)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("10.5");
		});

		// VALIDATION RULES

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be word + it is a word
		it("should display entered value when it has a value type rule of word", (): void => {
			cell.setEnteredValue("hello");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueTypeRule("word"));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("hello");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be number + it is a number
		it("should display entered value when it has a value type rule of number and is number", (): void => {
			cell.setEnteredValue("1");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueTypeRule("num"));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("1");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be a value in a range + it is a number in the range
		it("should display entered value when it has a value in range rule and is number in range", (): void => {
			cell.setEnteredValue("4");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueInRangeRule("less", 5));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("4");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be a value in a range + it is a empty
		it("should display entered value when it has a value in range rule and is empty", (): void => {
			cell.setEnteredValue("");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueInRangeRule("less", 5));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be a value one of + it is one of the options
		it("should display entered value when it has a value one of rule and contains option", (): void => {
			cell.setEnteredValue("hello");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueIsOneOfRule(["hello", "world"]));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("hello");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be a value one of + it is empty
		it("should display entered value when it has a value one of rule and is empty", (): void => {
			cell.setEnteredValue("");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueIsOneOfRule(["hello", "world"]));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be a type, value in a range, and value one of + it is one of the options
		it("should display entered value when it has a value type, value in range, and value one of rule", (): void => {
			cell.setEnteredValue("2");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueTypeRule("num"));
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueInRangeRule("less", 5));
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueIsOneOfRule([6, 2]));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("2");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be number + it is referencing a cell containing a number
		it("should display correct value when it has a value type rule of number and references a number", (): void => {
			grid[0][0].setEnteredValue("5");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueTypeRule("num"));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("5");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be a value in a range + it is referencing a cell containing a number in the range
		it("should display correct value when it has a value in range rule and references a number in the range", (): void => {
			grid[0][0].setEnteredValue("17");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueInRangeRule("greater", 6));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("17");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be a value one of + it is referencing a cell containing one of the options
		it("should display correct value when it has a value one of rule and references one of the options", (): void => {
			grid[0][0].setEnteredValue("cookie");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueIsOneOfRule(["cookie", "monster"]));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("cookie");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be number + it contains a formula evaluating to a number
		it("should display correct value when it has a value type rule of number and contains a formula", (): void => {
			cell.setEnteredValue("1+4*9");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueTypeRule("num"));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("37");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be a value in a range + it contains a formula evaluating to a number in the range
		it("should display correct value when it has a value in range rule and contains a formula that calculates in the range", (): void => {
			cell.setEnteredValue("1+4*9");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueInRangeRule("equal", 37));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("37");
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// cell has IValidationRule forcing it to be a value one of + it contains a formula evaluating to one of the options
		it("should display correct value when it has a value one of rule and contains a formula that calculates to one of the options", (): void => {
			cell.setEnteredValue("1+4*9");
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueIsOneOfRule([1, 5, 37, 88, -1]));
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("37");
		});
	});

	// Tests for getDisplayValue(): string, updateDisplayValue(cells: Array<Array<ICell>>):string
	// where the resulting display value IS an error
	describe("Testing getter and update for display value - invalid entered input", (): void => {
		// create a fresh cell and 3x3 grid for each test
		let cell: ICell;
		let grid: ICell[][];
		beforeEach((): void => {
			cell = new Cell(1, 1);
			grid = [];
			for (let i: number = 0; i < 3; i++) {
				let row: ICell[] = [];
				for (let j: number = 0; j < 3; j++) {
					row.push(new Cell(i, j));
				}
				grid.push(row);
			}
			cell = grid[2][2];
		});

		// #INVALID-REF
		// testing updateDisplayValue(ICell[][]):void where:
		// the entered value refers to a cell containing an error
		it("should display #INVALID-REF because the entered value refers to a cell containing an error", (): void => {
			grid[0][0].setEnteredValue("REF(AA)");
			// bad ref so error
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_CELL_REFERENCE
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// the entered value contains REF(A1 - no closing paren
		it("should display #INVALID-REF because the REF is missing closing parens", (): void => {
			cell.setEnteredValue("REF(A1");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_CELL_REFERENCE
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// the entered value contains REF in bad format
		it("should display #INVALID-REF because the REF is bad format", (): void => {
			cell.setEnteredValue("REF(1a)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_CELL_REFERENCE
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// another cell directly refers to itself through this cell
		it("should display #INVALID-REF because another cell directly refers to itself through it", (): void => {
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			grid[0][0].setEnteredValue("REF(C3)");
			grid[0][0].updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_CELL_REFERENCE
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// another cell indirectly refers to itself through this cell
		it("should display #INVALID-REF because another cell indirectly refers to itself through it", (): void => {
			grid[0][0].setEnteredValue("REF(A2)");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			grid[1][0].setEnteredValue("REF(C3)");
			grid[1][0].updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_CELL_REFERENCE
			);
		});

		// #REF-OUT-OF-RANGE

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value references a cell out of range
		it("should display #REF-OUT-OF-RANGE because it references a cell out of range", (): void => {
			cell.setEnteredValue("REF(A100)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.REFERENCE_OUT_OF_RANGE
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a sum including cells out of range
		it("should display #REF-OUT-OF-RANGE because it contains a sum including cells out of range", (): void => {
			cell.setEnteredValue("SUM(C1..D2)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.REFERENCE_OUT_OF_RANGE
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a average including cells out of range
		it("should display #REF-OUT-OF-RANGE because it contains an average including cells out of range", (): void => {
			cell.setEnteredValue("AVERAGE(A1..C5)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.REFERENCE_OUT_OF_RANGE
			);
		});

		// #INVALID-INPUT

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a word, but the value type rule requires it to be a number
		it("should display #INVALID-INPUT because it contains a word and its validation rule requires number", (): void => {
			cell.addRule(new ValueTypeRule("num"));
			cell.updateDisplayValue(grid);
			cell.setEnteredValue("a2");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_CELL_DATA
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a number outside of the range allowed by its value in range rule
		it("should display #INVALID-INPUT because it contains a number outside of its rule's permitted range", (): void => {
			cell.addRule(new ValueInRangeRule("equal", 7));
			cell.updateDisplayValue(grid);
			cell.setEnteredValue("2");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_CELL_DATA
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a string that is not included in its value one of rule
		it("should display #INVALID-INPUT because it contains a string that is not one of the valid options", (): void => {
			cell.addRule(new ValueIsOneOfRule(["cat", "dog", "bird"]));
			cell.updateDisplayValue(grid);
			cell.setEnteredValue("elephant");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_CELL_DATA
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a number that is not included in its value one of rule
		it("should display #INVALID-INPUT because it contains a number that is not one of the valid options", (): void => {
			cell.addRule(new ValueIsOneOfRule([1, 2, 3]));
			cell.updateDisplayValue(grid);
			cell.setEnteredValue("4");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_CELL_DATA
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a contradicting data validation rules
		it("should display #INVALID-INPUT because it contains contradicting data validation rules", (): void => {
			cell.addRule(new ValueIsOneOfRule([1, 2, 3]));
			cell.updateDisplayValue(grid);
			cell.addRule(new ValueIsOneOfRule(["a", "b", "c"]));
			cell.updateDisplayValue(grid);
			cell.setEnteredValue("a");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_CELL_DATA
			);
		});

		// #SELF-REF

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a reference to itself
		it("should display #SELF-REF because it contains reference to itself", (): void => {
			cell.setEnteredValue("REF(C3)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.REFERENCE_TO_SELF
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a reference to a cell referencing it back
		it("should display #SELF-REF because it references a cell directly referencing it back", (): void => {
			grid[0][0].setEnteredValue("REF(C3)");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.REFERENCE_TO_SELF
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a reference to a cell that indirectly references it back
		it("should display #SELF-REF because it references a cell indirectly referencing it back", (): void => {
			grid[0][0].setEnteredValue("REF(A2)");
			grid[0][0].updateDisplayValue(grid);
			grid[1][0].setEnteredValue("REF(C3)");
			grid[1][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.REFERENCE_TO_SELF
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a reference to a cell that includes the original cell in a sum
		it("should display #SELF-REF because it references a cell that contains a sum including it", (): void => {
			grid[0][0].setEnteredValue("SUM(B2..C3)");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.REFERENCE_TO_SELF
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a reference to a cell that includes the original cell in a average
		it("should display #SELF-REF because it references a cell that contains a average including it", (): void => {
			grid[0][0].setEnteredValue("AVERAGE(B2..C3)");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("REF(A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.REFERENCE_TO_SELF
			);
		});

		// #INVALID-EXPR

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a sum with the cell range in reverse order (bottomright to topleft)
		it("should display #INVALID-EXPR because it contains a sum in reverse order", (): void => {
			cell.setEnteredValue("SUM(A3..A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_RANGE_EXPR
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a average with the cell range in reverse order (bottomright to topleft)
		it("should display #INVALID-EXPR because it contains a average in reverse order", (): void => {
			cell.setEnteredValue("AVERAGE(A3..A1)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_RANGE_EXPR
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a sum including a cell containing a stringing
		it("should display #INVALID-EXPR because it contains a sum containing a string", (): void => {
			grid[0][0].setEnteredValue("1");
			grid[0][0].updateDisplayValue(grid);
			grid[0][1].setEnteredValue("car");
			grid[0][1].updateDisplayValue(grid);
			cell.setEnteredValue("SUM(A1..B2)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_RANGE_EXPR
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a AVERAGE including a cell containing a stringing
		it("should display #INVALID-EXPR because it contains a average containing a string", (): void => {
			grid[0][0].setEnteredValue("1");
			grid[0][0].updateDisplayValue(grid);
			grid[0][1].setEnteredValue("car");
			grid[0][1].updateDisplayValue(grid);
			cell.setEnteredValue("AVERAGE(A1..B2)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_RANGE_EXPR
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a sum with improper syntax
		it("should display #INVALID-EXPR because it contains a sum with improper syntax", (): void => {
			grid[0][0].setEnteredValue("1");
			grid[0][0].updateDisplayValue(grid);
			grid[0][1].setEnteredValue("2");
			grid[0][1].updateDisplayValue(grid);
			cell.setEnteredValue("SUM(A1..B2");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_RANGE_EXPR
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a average with improper syntax
		it("should display #INVALID-EXPR because it contains a average cwith improper syntax", (): void => {
			grid[0][0].setEnteredValue("1");
			grid[0][0].updateDisplayValue(grid);
			grid[0][1].setEnteredValue("2");
			grid[0][1].updateDisplayValue(grid);
			cell.setEnteredValue("AVERAGE(A1..B2");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_RANGE_EXPR
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// the entered value contains an average expression that includes a cell referencing this cell
		it("should display #INVALID-RANGE-EXPR because it gets an average including a cell referring to it", (): void => {
			grid[0][0].setEnteredValue("REF(C3)");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("SUM(A1..B2)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_RANGE_EXPR
			);
		});

		// #INVALID-FORMULA

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a formula with a number and string
		it("should display #INVALID-FORMULA because it contains a formula with anumber and string", (): void => {
			cell.setEnteredValue("1*b");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_FORMULA
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a formula ending in an operator
		it("should display #INVALID-FORMULA because it contains a formula ending in a operator", (): void => {
			cell.setEnteredValue("1+");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_FORMULA
			);
		});

		// testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a formula missing parenthesis
		it("should display #INVALID-FORMULA because it contains a formula missing parenthesis", (): void => {
			cell.setEnteredValue("1+(2*");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(
				ErrorDisplays.INVALID_FORMULA
			);
		});
	});

	// Tests for attachObserver(ICell): void, detachObserver(ICell): void, attachObserving(ICell):void, detachObserving(ICell): void, and isObserving(ICell): boolean
	describe("Testing attach and detach observer and observing", (): void => {
		let cell1: ICell;
		let cell2: ICell;
		let cell3: ICell;
		beforeEach((): void => {
			cell1 = new Cell(0, 0);
			cell2 = new Cell(0, 1);
			cell3 = new Cell(1, 0);
		});

		// testing isObserving(ICell): boolean with initial value
		it("cell.isObserving() should return false for an ICells that have just been instantiated", (): void => {
			expect(cell1.isObserving(cell2)).toEqual(false);
		});

		// testing attachObserver(ICell): void
		it("cell1.isObserving(cell2) should return true when cell1 is set to observe cell2", (): void => {
			cell2.attachObserver(cell1);
			expect(cell1.isObserving(cell2)).toEqual(true);
		});

		// testing detachObserver(ICell): void
		it("cell1.isObserving(cell2) should return false when cell1 is detached from being an observer of cell2", (): void => {
			cell2.attachObserver(cell1);
			cell2.detachObserver(cell1);
			expect(cell1.isObserving(cell2)).toEqual(false);
		});

		// testing detachObserver(ICell): void with cell not attace=hed
		it("cell1.isObserving(cell2) should not throw an error when cell1 is detached from cell2 without ever being attached", (): void => {
			expect(() => cell2.detachObserver(cell1)).not.toThrow();
		});

		// testing attachObserving(ICell): void
		it("cell1.isObserving(cell2) should return true when cell1 added to cell2's list of cells it's observing", (): void => {
			cell1.attachObserving(cell2);
			expect(cell1.isObserving(cell2)).toEqual(true);
		});

		// testing detachObserving(ICell): void
		it("cell1.isObserving(cell2) should return false when cell1 added to then removed from cell2's list of cells it's observing", (): void => {
			cell1.attachObserving(cell2);
			cell1.detachObserving(cell2);
			expect(cell1.isObserving(cell2)).toEqual(false);
		});

		// testing detachObserving(ICell): void with cell not attace=hed
		it("cell1.isObserving(cell2) should not throw an error when cell1 is detached from observing cell2 without ever being attached", (): void => {
			expect(() => cell1.detachObserving(cell2)).not.toThrow();
		});

		// testing isObserving(ICell): boolean with a cyclical chain of observers
		it("cell1.isObserving(cell1) should return true for an ICell that has a cyclical observance", (): void => {
			cell1.attachObserver(cell2);
			cell2.attachObserver(cell3);
			cell3.attachObserver(cell1);
			expect(cell1.isObserving(cell1)).toEqual(true);
		});

		// testing isObserving(ICell): boolean with a ICell that observes itself
		it("cell1.isObserving(cell1) should return true for an ICell that directly observes itself", (): void => {
			cell1.attachObserver(cell1);
			expect(cell1.isObserving(cell1)).toEqual(true);
		});
	});

	// Tests for clearCell(): void
	describe("Testing clear Cell", (): void => {
		let cell: ICell;
		let grid: ICell[][];
		beforeEach((): void => {
			cell = new Cell(1, 1);
			grid = [];
			for (let i: number = 0; i < 3; i++) {
				let row: ICell[] = [];
				for (let j: number = 0; j < 3; j++) {
					row.push(new Cell(i, j));
				}
				grid.push(row);
			}
			cell = grid[2][2];
		});

		// test clearing an empty cell keeps entered value as empty string
		it("getEnteredValue() should return empty if clearCell is called on empty cell", (): void => {
			cell.clearCell();
			expect(cell.getEnteredValue()).toEqual("");
		});

		// test clearing an empty cell keeps display value as empty string
		it("getDisplayValue(ICell[][]) should return empty if clearCell is called on empty cell", (): void => {
			cell.clearCell();
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("");
		});

		// test clearing a non-empty cell sets entered value as empty string
		it("getEnteredValue() should return empty if clearCell is called on nonempty cell", (): void => {
			cell.setEnteredValue("hello");
			cell.updateDisplayValue(grid);
			cell.clearCell();
			cell.updateDisplayValue(grid);
			expect(cell.getEnteredValue()).toEqual("");
		});

		// test clearing a non-empty cell sets display value as empty string
		it("getDisplayValue(ICell[][]) should return empty if clearCell is called on nonempty cell", (): void => {
			cell.setEnteredValue("hello");
			cell.updateDisplayValue(grid);
			cell.clearCell();
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("");
		});

		// test clearing a non-empty cell being referred to sets display value of the reference cel to empty string
		it("getDisplayValue(ICell[][]) should return empty if clearCell is called on nonempty cell a cell is referencing", (): void => {
			cell.setEnteredValue("hello");
			cell.updateDisplayValue(grid);
			grid[0][0].setEnteredValue("REF(C3)");
			grid[0][0].updateDisplayValue(grid);
			cell.clearCell();
			cell.updateDisplayValue(grid);
			expect(grid[0][0].getDisplayValue()).toEqual("");
		});
	});

	// Tests for findReplace(string, string): void
	describe("Testin find and replace", (): void => {
		// create a fresh cell for each test
		let cell: ICell;
		beforeEach((): void => {
			cell = new Cell(0, 0);
		});

		// test findReplace(string, string) on empty cell
		it("Should not change entered value if the cell is empty", (): void => {
			cell.findReplace("find", "replace");
			expect(cell.getEnteredValue()).toEqual("");
		});

		// test findReplace(string, string) on cell that does not have find value in entered value
		it("Should not change entered value if the find is not in the entered value", (): void => {
			cell.setEnteredValue("hi");
			cell.findReplace("find", "replace");
			expect(cell.getEnteredValue()).toEqual("hi");
		});

		// test findReplace(string, string) on cell that has an entered value equal to the find value
		it("Should replace the entire entered value when it is equal to the find value", (): void => {
			cell.setEnteredValue("find");
			cell.findReplace("find", "replace");
			expect(cell.getEnteredValue()).toEqual("replace");
		});

		// test findReplace(string, string) on cell that has an one occurrence of find value in entered value
		it("Should replace a portion of the entered value when it contains the find value", (): void => {
			cell.setEnteredValue("finda");
			cell.findReplace("find", "replace");
			expect(cell.getEnteredValue()).toEqual("replacea");
		});

		// test findReplace(string, string) on cell that has multiple consecutive occurrences of find value
		it("Should replace the entire entered value when it is has multiple consecutive occurrences of find value", (): void => {
			cell.setEnteredValue("findfind");
			cell.findReplace("find", "replace");
			expect(cell.getEnteredValue()).toEqual("replacereplace");
		});

		// test findReplace(string, string) on cell that has multiple consecutive occurrences of find value
		it("Should replace parts of entered value when it is has multiple non-consecutive occurrences of find value", (): void => {
			cell.setEnteredValue("findorfind");
			cell.findReplace("find", "replace");
			expect(cell.getEnteredValue()).toEqual("replaceorreplace");
		});

		// test findReplace(string, string) on cell that has an occurrence of find value in entered value
		// with an empty string for replace value
		it("Should replace a portion of the entered value when it contains the find value with empty string", (): void => {
			cell.setEnteredValue("replacer");
			cell.findReplace("r", "");
			expect(cell.getEnteredValue()).toEqual("eplace");
		});
	});

	// Tests for addRule(IValidationRule):void, deleteRule(IValidationRule):void, and getRules(): Array<IValidationRule>
	describe("Testing add and delete rule and get rules", (): void => {
		// create a fresh cell for each test
		let cell: ICell;
		beforeEach((): void => {
			cell = new Cell(0, 0);
		});

		// test getRules() returns an empty array for a newly instantiated ICell
		it("getRules() should return an empty array when called on newly instantiated cell", (): void => {
			expect(cell.getRules()).toEqual([]);
		});

		// test addRule() adds a value type rule to a cell that does not have any rules applied
		it("getRules() should return an array of the value type rule applied to cell in addRule", (): void => {
			let rule: IValidationRule = new ValueTypeRule("num");
			cell.addRule(rule);
			expect(cell.getRules()).toEqual([rule]);
		});

		// test addRule() adds a value type rule to a cell that does not have any rules applied
		it("getRules() should return an array of the value in range rule applied to cell in addRule", (): void => {
			let rule: IValidationRule = new ValueInRangeRule("equal", 10);
			cell.addRule(rule);
			expect(cell.getRules()).toEqual([rule]);
		});

		// test addRule() adds a value type rule to a cell that does not have any rules applied
		it("getRules() should return an array of the value one of rule applied to cell in addRule", (): void => {
			let rule: IValidationRule = new ValueIsOneOfRule(["a", "b", "c"]);
			cell.addRule(rule);
			expect(cell.getRules()).toEqual([rule]);
		});

		// test addRule() does not add a rule to a cell that already has that rule applied
		it("getRules() should return an array of one rule applied to cell if rule object applied twice in addRule", (): void => {
			let rule: IValidationRule = new ValueTypeRule("num");
			cell.addRule(rule);
			cell.addRule(rule);
			expect(cell.getRules()).toEqual([rule]);
		});

		// test addRule() does not add a rule to a cell that already has a rule with the same value as the given rule applied
		it("getRules() should return an array of one rule applied to cell if rule value applied twice in addRule", (): void => {
			let rule1: IValidationRule = new ValueTypeRule("num");
			let rule2: IValidationRule = new ValueTypeRule("num");
			cell.addRule(rule1);
			cell.addRule(rule2);
			expect(cell.getRules()).toEqual([rule1]);
		});

		// test addRule() allows several different rules to be applied - not contradicting
		it("getRules() should return an array of all the noncontradicting rules applied to cell in addRule", (): void => {
			let rule1: IValidationRule = new ValueTypeRule("num");
			let rule2: IValidationRule = new ValueInRangeRule("equal", 5);
			let rule3: IValidationRule = new ValueIsOneOfRule([5, 10]);
			let rule4: IValidationRule = new ValueInRangeRule("greater", 2);
			cell.addRule(rule1);
			cell.addRule(rule2);
			cell.addRule(rule3);
			cell.addRule(rule4);
			expect(cell.getRules()).toEqual([rule1, rule2, rule3, rule4]);
		});

		// test addRule() allows several different rules to be applied - contradicting
		it("getRules() should return an array of all the contradicting rules applied to cell in addRule", (): void => {
			let rule1: IValidationRule = new ValueTypeRule("word");
			let rule2: IValidationRule = new ValueInRangeRule("equal", 5);
			let rule3: IValidationRule = new ValueIsOneOfRule(["cat"]);
			let rule4: IValidationRule = new ValueInRangeRule("greater", 7);
			cell.addRule(rule1);
			cell.addRule(rule2);
			cell.addRule(rule3);
			cell.addRule(rule4);
			expect(cell.getRules()).toEqual([rule1, rule2, rule3, rule4]);
		});

		// test removeRule() does nothing to a cell with no rules applied
		it("removeRules() should do nothing to a cell with no rules applied", (): void => {
			let rule: IValidationRule = new ValueTypeRule("num");
			cell.removeRule(rule);
			expect(cell.getRules()).toEqual([]);
		});

		// test removeRule() does nothing to a cell that has rules applied that are not what was passed
		it("removeRules() should do nothing to a cell with rules that aren't what was passed", (): void => {
			let rule1: IValidationRule = new ValueTypeRule("num");
			let rule2: IValidationRule = new ValueTypeRule("word");
			cell.addRule(rule1);
			cell.removeRule(rule2);
			expect(cell.getRules()).toEqual([rule1]);
		});

		// test removeRule() removes any instance of the provided rule from the cells list of rules
		// there will only be one instance, as a cell will not apply duplicate rules
		it("removeRules() should remove the provided rule from the cell's list of rules", (): void => {
			let rule1: IValidationRule = new ValueTypeRule("num");
			let rule2: IValidationRule = new ValueTypeRule("word");
			cell.addRule(rule1);
			cell.addRule(rule2);
			cell.removeRule(rule2);
			expect(cell.getRules()).toEqual([rule1]);
		});
	});
	// Tests for getStyle() :ICellStyle and setStyle(ICellStyle):void
	describe("Testing get and set style", (): void => {
		// create a fresh cell for each test
		let cell: ICell;
		let style: ICellStyle;
		beforeEach((): void => {
			cell = new Cell(0, 0);
			style = new CellStyle();
		});

		// test getStyle() returns the default style for a newly instantiated ICell
		it("getStyle() should return the default style when called on newly instantiated cell", (): void => {
			expect(cell.getStyle()).toEqual(style);
		});

    // test setStyle() sets the ICell's style to the provided ICellStyle
		it("setStyle() should set the ICell's style with the provided style", (): void => {
      style.setBold(true);
      style.setTextColor("#110011");
      cell.setStyle(style);
			expect(cell.getStyle()).toEqual(style);
		});
	});
});
