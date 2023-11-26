import { assert } from "console";
import { PlusSignStrategy } from "../strategy-plus-sign";
import { CellRefStrategy } from "../strategy-cell-ref";
import { Cell } from "../cell";
describe('Cell Ref Strategy', (): void => {

    // TODO Add tests for errors like self ref
  
    it('should return the display value of a cell with a set value', (): void => {
        let cells: Cell[][] = [];
        let cell: Cell = new Cell(0, 0)
        cell.setEnteredValue("string");
        cell.updateDisplayValue(cells);
        cells.push([cell]);
        let strategy = new CellRefStrategy(cells, 100, 100);

        expect(strategy.parse("REF(A1)")).toBe("string");
    });

    it('should return the display value of a cell with an enterred value that is different than the display value', (): void => {
        let cells: Cell[][] = [];
        let cell: Cell = new Cell(0, 0)
        cell.setEnteredValue("1 + 2");
        cell.updateDisplayValue(cells);
        cells.push([cell]);
        let strategy = new CellRefStrategy(cells, 100, 100);

        expect(strategy.parse("REF(A1)")).toBe("3");
    });

    it('should return an empty string for a cell with no entered value', (): void => {
        let cells: Cell[][] = [];
        let cell: Cell = new Cell(0, 0);
        cells.push([cell]);
        let strategy = new CellRefStrategy(cells, 100, 100);

        expect(strategy.parse("REF(A1)")).toBe("");
    });

    it('should return a simplified equation when the cell ref is not all that is present', (): void => {
        let cells: Cell[][] = [];
        let cell: Cell = new Cell(0, 0)
        cell.setEnteredValue("1 + 2");
        cell.updateDisplayValue(cells);
        cells.push([cell]);
        let strategy = new CellRefStrategy(cells, 100, 100);

        expect(strategy.parse("1 + REF(A1)")).toBe("1 + 3");
    });
  });
