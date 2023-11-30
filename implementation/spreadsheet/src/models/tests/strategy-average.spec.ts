/**
 * @file strategy-average.spec.ts
 * @testing AverageStrategy
 */

import { Cell } from "../cell";
import { ErrorDisplays } from "../cell-data-errors-enum";
import { AverageStrategy } from "../strategy-average";

// Tests for the average range expression strategy
describe("Average Strategy", (): void => {
  // Cells for testing an a 2D array to hold them;
  let cell: Cell;
  let cell2: Cell;
  let cell3: Cell;
  let cell4: Cell;
  let cell5: Cell;
  let cell6: Cell;
  let cell7: Cell;
  let cell8: Cell;
  let cell9: Cell;
  let cells: Cell[][];

  // Set up a 3x3 spreadsheet grid before every test
  beforeEach(() => {
    cells = [];
    cell = new Cell(0, 0);
    cell2 = new Cell(0, 1);
    cell3 = new Cell(1, 0);
    cell4 = new Cell(1, 1);
    cell5 = new Cell(2, 0);
    cell6 = new Cell(0, 2);
    cell7 = new Cell(2, 1);
    cell8 = new Cell(1, 2);
    cell9 = new Cell(2, 2);
    cells.push(
      [cell, cell2, cell6],
      [cell3, cell4, cell8],
      [cell5, cell7, cell9]
    );
  });

  // Test that a single cell's average can be calculated
  it("should sum a single cell", (): void => {
    // Set up a cell with a string
    cell.setEnteredValue("5");
    cell.updateDisplayValue(cells);

    // Set up an AverageStrategy for another cell
    let strategy = new AverageStrategy(cells, 0, 2);
    expect(strategy.parse("AVERAGE(A1..A1)")).toBe("5");
  });

  // Test that a group of cells' average can be calculated
  it("should sum a group of cells", (): void => {
    // Set up a cells with numbers
    cell.setEnteredValue("5");
    cell2.setEnteredValue("10");
    cell3.setEnteredValue("15");
    cell4.setEnteredValue("20");
    cell.updateDisplayValue(cells);
    cell2.updateDisplayValue(cells);
    cell3.updateDisplayValue(cells);
    cell4.updateDisplayValue(cells);

    // Set up a AverageStrategy for another cell
    let strategy = new AverageStrategy(cells, 0, 2);
    expect(strategy.parse("AVERAGE(A1..B2)")).toBe("12.5");
  });

  // Test that the proper error occurs when the close parenthesis is missing
  it("should error on no close parenthesis", (): void => {
    // Set up a cell with a number
    cell.setEnteredValue("5");
    cell.updateDisplayValue(cells);

    // Set up a AverageStrategy for another cell
    let strategy = new AverageStrategy(cells, 0, 2);

    // Check that the proper error was thrown due to the missing parenthesis
    expect(() => {
      strategy.parse("AVERAGE(A1..A1");
    }).toThrow(ErrorDisplays.INVALID_RANGE_EXPR);
  });

  // Test that a string in the range of cells causes the proper error
  it("should error on string in the range", (): void => {
    // Set up a cell with a number and another with a string
    cell.setEnteredValue("5");
    cell2.setEnteredValue("nope");
    cell.updateDisplayValue(cells);
    cell2.updateDisplayValue(cells);

    // Set up a AverageStrategy for another cell
    let strategy = new AverageStrategy(cells, 0, 2);

    // Check that the proper error was thrown due to the string in the range
    expect(() => {
      strategy.parse("AVERAGE(A1..B2)");
    }).toThrow(ErrorDisplays.INVALID_RANGE_EXPR);
  });

  // Test that a backwards range results in the proper error
  it("should error on backwards range", (): void => {
    // Set up a cell with a number
    cell.setEnteredValue("5");
    cell.updateDisplayValue(cells);

    // Set up a AverageStrategy for another cell
    let strategy = new AverageStrategy(cells, 0, 2);

    // Check that the proper error was thrown due to the backwards range
    expect(() => {
      strategy.parse("AVERAGE(A2..A1)");
    }).toThrow(ErrorDisplays.INVALID_RANGE_EXPR);
  });

  // Test that an out of bounds cell in the range results in the proper error
  it("should error on out of bounds cell in range", (): void => {
    // Set up a cell with a number
    cell.setEnteredValue("5");
    cell.updateDisplayValue(cells);

    // Set up a AverageStrategy for another cell
    let strategy = new AverageStrategy(cells, 0, 2);

    // Check that the proper error was thrown due to the out of bounds A4
    expect(() => {
      strategy.parse("AVERAGE(A1..A4)");
    }).toThrow(ErrorDisplays.REFERENCE_OUT_OF_RANGE);
  });

  // Test that the proper error is thrown when the range includes a self-reference
  it("should error on self-reference", (): void => {
    // Set up a cell with a string
    cell.setEnteredValue("5");
    cell.updateDisplayValue(cells);

    // Set up a AverageStrategy for another cell
    let strategy = new AverageStrategy(cells, 0, 2);

    // Check that the proper error was thrown due to the self-ref
    expect(() => {
      strategy.parse("AVERAGE(A1..C3)");
    }).toThrow(ErrorDisplays.REFERENCE_TO_SELF);
  });

  // Test that there can be other things in the cell text and they will remain intact
  it("should maintain other text in dispaly value", (): void => {
    // Set up a cell with a string
    cell.setEnteredValue("5");
    cell.updateDisplayValue(cells);
    cell2.setEnteredValue("10");
    cell2.updateDisplayValue(cells);

    // Set up a AverageStrategy for another cell
    let strategy = new AverageStrategy(cells, 0, 2);

    // Check that the average expression is replaced with the display value 
    expect(strategy.parse("hello AVERAGE(A1..B1) bye")).toBe("hello 7.5 bye");
  });

  // Test that there can be other things in the cell text and they will remain intact
  it("should allow for multiple averages", (): void => {
    // Set up a cell with a string
    cell.setEnteredValue("5");
    cell.updateDisplayValue(cells);
    cell2.setEnteredValue("10");
    cell2.updateDisplayValue(cells);

    // Set up a SumStrategy for another cell
    let strategy = new AverageStrategy(cells, 0, 2);

    // Check that the average expressions are replaced with the display value 
    expect(strategy.parse("hello AVERAGE(A1..B1) bye AVERAGE(A1..A1)")).toBe("hello 7.5 bye 5");
  });
});
