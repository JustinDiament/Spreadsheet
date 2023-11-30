/**
 * @file cell.spec.ts
 * @testing ICell
 */

import { ICell } from "../../interfaces/cell-interface";
import { Cell } from "../cell";
import { ErrorDisplays } from "../cell-data-errors-enum";
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

		/**
		 * update display value with:
		 *
		 * =================
		 * ERRORS:
		 * =================
		 *
		 *
		 * // #REF-OUT-OF-RANGE
		 * entered references cell out of range
		 * entered sum of cell out of range
		 * entered average of cell out of range
		 *
		 * // #INVALID-INPUT
		 * entered value is string but validation rule says word
		 * entered value is number outside of range
		 * entered value is string not one of options
		 * entered value of number not one of options
		 * entered value has contradicting rules
		 *
		 * // #SELF-REF
		 * entered references itself
		 * entered references cell that references it back
		 * entered references cell that references cell that references initial cell
		 * entered references cell that contains initial cell in sum
		 * entered references cell that contains initial cell in average
		 *
		 *
		 * // #INVALID-EXPR
		 * entered sum in reverse order
		 * entered average in reverse order
		 * entered sum containing string
		 * entered average containing string
		 * entered sum missing ..
		 * entered sum missing ()
		 * entered sum missing a cell
		 * entered average missing ..
		 * entered average missing ()
		 * entered average missing a cell
		 *
		 * // #INVALID-FORMULA
		 * entered formula with number and string
		 * entered formula ending in an operator
		 * entered formula missing closing parenthesis
		 * entered formula missing opening parenthesis
		 *
		 *
		 *
		 *
		 *
		 *
		 *
		 */

		// testing updateDisplayValue(ICell[][]):void where:
		//
		it("...", (): void => {
			cell.setEnteredValue("...");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("...");
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
		// testing updateDisplayValue(ICell[][]):void where:
		//
		it("...", (): void => {
			cell.setEnteredValue("...");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual("...");
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

		// testing updateDisplayValue(ICell[][]):void where:
		// the entered value contains an average expression that includes a cell referencing this cell
		it("should display #INVALID-REF because it gets an average including a cell referring to it", (): void => {
			grid[0][0].setEnteredValue("REF(C3)");
			grid[0][0].updateDisplayValue(grid);
			cell.setEnteredValue("SUM(A1..B2)");
			cell.updateDisplayValue(grid);
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
			expect(cell.getDisplayValue()).toEqual(ErrorDisplays.REFERENCE_OUT_OF_RANGE);
		});

    // testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a sum including cells out of range
		it("should display #REF-OUT-OF-RANGE because it contains a sum including cells out of range", (): void => {
			cell.setEnteredValue("SUM(C1..D2)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(ErrorDisplays.REFERENCE_OUT_OF_RANGE);
		});

    // testing updateDisplayValue(ICell[][]):void where:
		// entered value contains a average including cells out of range
		it("should display #REF-OUT-OF-RANGE because it contains an average including cells out of range", (): void => {
			cell.setEnteredValue("AVERAGE(A1..C5)");
			cell.updateDisplayValue(grid);
			expect(cell.getDisplayValue()).toEqual(ErrorDisplays.REFERENCE_OUT_OF_RANGE);
		});

		// #INVALID-INPUT

		// #SELF-REF

		// #INVALID-EXPR

		// #INVALID-FORMULA
	});

	// describe("Clear Cell", (): void => {
	// 	beforeEach((): void => {});

	// 	it("Cell entered value should be cleared", (): void => {
	// 		let cell: Cell = new Cell(1, 1);
	// 		cell.setEnteredValue("hi");
	// 		cell.clearCell();
	// 		expect(cell.getEnteredValue()).toEqual("");
	// 	});

	// 	it("Cell display should be cleared", (): void => {
	// 		let cell: Cell = new Cell(1, 1);
	// 		cell.setEnteredValue("hi");
	// 		cell.updateDisplayValue([]);
	// 		cell.clearCell();
	// 		expect(cell.getDisplayValue()).toEqual("");
	// 	});
	// });

	// describe("Find and Replace", (): void => {
	// 	beforeEach((): void => {});

	// 	it("Should not change entered value if the value is not present", (): void => {
	// 		let cell: Cell = new Cell(1, 1);
	// 		cell.setEnteredValue("hi");
	// 		cell.updateDisplayValue([]);
	// 		cell.findReplace("find", "replace");
	// 		expect(cell.getEnteredValue()).toEqual("hi");
	// 	});

	// 	it("Should not change display value if the value is not present", (): void => {
	// 		let cell: Cell = new Cell(1, 1);
	// 		cell.setEnteredValue("hi");
	// 		cell.updateDisplayValue([]);
	// 		cell.findReplace("find", "replace");
	// 		expect(cell.getDisplayValue()).toEqual("hi");
	// 	});

	// 	it("Cell entered value should be changed", (): void => {
	// 		let cell: Cell = new Cell(1, 1);
	// 		cell.setEnteredValue("find");
	// 		cell.updateDisplayValue([]);
	// 		cell.findReplace("find", "replace");
	// 		expect(cell.getEnteredValue()).toEqual("replace");
	// 	});

	// 	it("Cell display value should be changed", (): void => {
	// 		let cell: Cell = new Cell(1, 1);
	// 		cell.setEnteredValue("find");
	// 		cell.findReplace("find", "replace");
	// 		cell.updateDisplayValue([]);
	// 		expect(cell.getDisplayValue()).toEqual("replace");
	// 	});
	// 	describe("Cell with Multiple Validation Rules", () => {
	// 		let cell: Cell;

	// 		beforeEach(() => {
	// 			cell = new Cell(1, 1);
	// 		});

	// 		it("should pass all validation rules", () => {
	// 			const valueInRangeRule = new ValueInRangeRule("=", 5);
	// 			const valueIsOneOfRule = new ValueIsOneOfRule([
	// 				"rule0",
	// 				"rule",
	// 				"rules",
	// 			]);
	// 			const valueTypeRule = new ValueTypeRule("string");

	// 			cell.addRule(valueInRangeRule);
	// 			cell.addRule(valueIsOneOfRule);
	// 			cell.addRule(valueTypeRule);

	// 			cell.setEnteredValue("rule0");

	// 			// Assuming updateDisplayValue method is working correctly
	// 			cell.updateDisplayValue([]);

	// 			// Expect the cell to have the entered value because it passed all validation rules
	// 			expect(cell.getDisplayValue()).toEqual("rule0");
	// 		});

	// 		it("should fail one validation rule", () => {
	// 			const valueInRangeRule = new ValueInRangeRule("=", 5);
	// 			const valueIsOneOfRule = new ValueIsOneOfRule([
	// 				"rule1",
	// 				"rule1",
	// 				"rule3",
	// 			]);
	// 			const valueTypeRule = new ValueTypeRule("string");

	// 			cell.addRule(valueInRangeRule);
	// 			cell.addRule(valueIsOneOfRule);
	// 			cell.addRule(valueTypeRule);

	// 			cell.setEnteredValue("rule4"); // Violates valueIsOneOfRule

	// 			// Assuming updateDisplayValue method is working correctly
	// 			cell.updateDisplayValue([]);

	// 			// Expect the cell to show the error message because it violated one validation rule
	// 			expect(cell.getDisplayValue()).toEqual("#INVALID-REF"); // or whatever error message you set
	// 		});

	// 		// Add more test cases for different combinations of passing and failing validation rules
	// 	});
	// });
});
