/**
 * @file strategy-cell-ref.spec.ts
 * @testing CellRefStrategy
 */

import { CellRefStrategy } from "../strategy-cell-ref";
import { Cell } from "../cell";
import { ErrorDisplays } from "../cell-data-errors-enum";

// Tests for the cell reference strategy
describe("Cell Reference Strategy", (): void => {
  // Cells for testing an a 2D array to hold them;
  let cell: Cell;
  let cell2: Cell;
  let cell3: Cell;
  let cell4: Cell;
  let cells: Cell[][];

  // Set up a 2x2 spreadsheet grid before every test
  beforeEach(() => {
    cells = [];
    cell = new Cell(0, 0);
    cell2 = new Cell(0, 1);
    cell3 = new Cell(1, 0);
    cell4 = new Cell(1, 1);
    cells.push([cell, cell3], [cell2, cell4]);
  });

  // Test referecing a cell with a string constant in it
  it("should return the display value of a cell with a set value", (): void => {
    // Set up a cell with a string constant
    cell.setEnteredValue("string");
    cell.updateDisplayValue(cells);

    // Set up a CellRefStrategy for another cell
    let strategy = new CellRefStrategy(cells, 1, 0);

    // Check that the reference sets the display value correctly
    expect(strategy.parse("REF(A1)")).toBe("string");
  });

  // Test that a reference can display the display value from another cell that differs from that cell's entered value
  it("should return the display value of a cell with an entered value that is different than the display value", (): void => {
    // Set up a cell with a formula
    cell3.setEnteredValue("1 + 2");
    cell3.updateDisplayValue(cells);

    // Set up a CellRefStrategy for another cell
    let strategy = new CellRefStrategy(cells, 1, 0);

    // Check that the reference sets the display value correctly
    expect(strategy.parse("REF(B1)")).toBe("3");
  });

  // Test that an empty cell cen be referred to and will display an empty string in the reference cell
  it("should return an empty string for a cell with no entered value", (): void => {
    // Set up a CellRefStrategy for another cell
    let strategy = new CellRefStrategy(cells, 1, 1);

    // Check that the reference resolves to an empty string
    expect(strategy.parse("REF(B1)")).toBe("");
  });

  // Test that more can be in the cell reference cell alongside the reference
  it("should return a simplified equation when the cell ref is not all that is present", (): void => {
    // Set up a cell with a formula
    cell.setEnteredValue("1 + 2");
    cell.updateDisplayValue(cells);

    // Set up a CellRefStrategy for another cell
    let strategy = new CellRefStrategy(cells, 1, 1);

    // Check that the reference sets the display value correctly, with the other content as well
    expect(strategy.parse("1 + REF(A1)")).toBe("1 + 3");
  });

  // Test that a the proper is thrown when there is a malformed reference with no closing parenthesis
  it("should return an error when there is no closing parenthesis", (): void => {
    // Set up a cell with a string
    cell.setEnteredValue("string");
    cell.updateDisplayValue(cells);

    // Set up a CellRefStrategy for another cell
    let strategy = new CellRefStrategy(cells, 0, 1);

    // Check that the malformed refernece throws the correct error
    expect(() => {
      strategy.parse("REF(A1");
    }).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE);
  });

  // Test that reference should throw the proper error if there is no row number
  it("should return an error when there is not a number", (): void => {
    // Set up a cell with a string
    cell.setEnteredValue("string");
    cell.updateDisplayValue(cells);

    // Set up a CellRefStrategy for another cell
    let strategy = new CellRefStrategy(cells, 0, 1);

    // Check that the malformed reference throws the correct error
    expect(() => {
      strategy.parse("REF(A)");
    }).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE);
  });

  // Test that reference should throw the proper error if there is no column letter
  it("should return an error when there is not a letter", (): void => {
    // Set up a cell with a string
    cell.setEnteredValue("string");
    cell.updateDisplayValue(cells);

    // Set up a CellRefStrategy for another cell
    let strategy = new CellRefStrategy(cells, 0, 1);

    // Check that the malformed reference throws the correct error
    expect(() => {
      strategy.parse("REF(1)");
    }).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE);
  });

  // Test that the proper error is thrown when a reference references a cell beyond the end of the grid
  it("should return an error when there is an out of range cell", (): void => {
    // Set up a cell with a string
    cell.setEnteredValue("string");
    cell.updateDisplayValue(cells);

    // Set up a CellRefStrategy for another cell
    let strategy = new CellRefStrategy(cells, 1, 1);

    // Check that the out of range reference throws the correct error
    expect(() => {
      strategy.parse("REF(A3)");
    }).toThrow(ErrorDisplays.REFERENCE_OUT_OF_RANGE);
  });

  // Check that the proper error is thrown for a cell referencing itself
  it("should return an error when there is a self reference", (): void => {
    // Set up a cell with a string
    cell.setEnteredValue("string");
    cell.updateDisplayValue(cells);

    // Set up a CellRefStrategy for a cell
    let strategy = new CellRefStrategy(cells, 0, 0);

    // Check that the self reference throws the correct error
    expect(() => {
      strategy.parse("REF(A1)");
    }).toThrow(ErrorDisplays.REFERENCE_TO_SELF);
  });

  // Check that the proper error is thrown when there is a circular reference loop across multiple cells
  it("should return an error when there is a circular reference loop", (): void => {
    // Set up a cell with a string
    cell4.setEnteredValue("REF(A1)");
    cell4.updateDisplayValue(cells);

    // Set up a CellRefStrategy for another cell
    let strategy = new CellRefStrategy(cells, 0, 0);

    // Check that the circule reference sequence throws the correct error
    expect(() => {
      strategy.parse("REF(B2)");
    }).toThrow(ErrorDisplays.REFERENCE_TO_SELF);
  });
});
