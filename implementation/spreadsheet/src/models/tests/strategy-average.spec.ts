import { Cell } from "../cell";
import { AverageStrategy } from "../strategy-average";
import { CellRefStrategy } from "../strategy-cell-ref";

describe('Average Strategy', (): void => {
    //define empty cell grids for testing
    let otherCells: Cell[][] = [];
    let emptyCells: Cell[][] = [];

    //set up a first row of the cell grid
    let firstRow: Cell[] = []
    for(let n = 0; n < 5; n++) {
        let cell: Cell = new Cell(0, n);
        cell.setEnteredValue(n.toString());
        cell.updateDisplayValue(otherCells);
        firstRow.push(cell);
    }
    otherCells.push(firstRow);

    //set up the second row of the cell grid
    let secondRow: Cell[] = []
    for(let n = 0; n < 5; n++) {
        let cell: Cell = new Cell(1, n);
        cell.setEnteredValue(n.toString());
        cell.updateDisplayValue(otherCells);
        secondRow.push(cell);
    }
    otherCells.push(secondRow);


    //add a third row with strings
    let thirdRow: Cell[] = []
    for(let n = 0; n < 5; n++ ) {
        let cell: Cell = new Cell(2, n);
        cell.setEnteredValue("stringValue" + n);
        cell.updateDisplayValue(otherCells);
        thirdRow.push(cell);
    }
    otherCells.push(thirdRow);

    //set up the other cell grid with all default values
    for(let row = 0; row < 5; row++) {
        let rowCells: Cell[] = [];
        for(let col = 0; col < 5; col++ ) {
            let cell: Cell = new Cell(row, col);
            rowCells.push(cell);
        }
        emptyCells.push(rowCells);
    }

    //set up strategies with the grids defined above
    let strategyWithSetValues: AverageStrategy = new AverageStrategy(otherCells)
    let strategyWithDefaultValues: AverageStrategy = new AverageStrategy(otherCells)

  
    it('should take return the value of the cell if only one defined', (): void => {
        expect(strategyWithSetValues.parse("AVERAGE(A1..A1)")).toBe("0");
    });

    it('should return the average of a row of cells with number values', (): void => {
        expect(strategyWithSetValues.parse("AVERAGE(A1..E1)")).toBe("2");
    });

    it('should return the average of a selection of cells with number values', (): void => {
        expect(strategyWithSetValues.parse("AVERAGE(A1..E2)")).toBe("2");
    });

    it('should return an error if string values are involved', (): void => {
        expect(strategyWithSetValues.parse("AVERAGE(A1..A3)")).toBe("ERROR: Connot take average of non-numbers");
    });

    it('should return an error if there are no values', (): void => {
        expect(strategyWithDefaultValues.parse("AVERAGE(A1..A3)")).toBe("ERROR: Connot take average of non-numbers");
    });

    it('should return an error if there is no closing parenthesis', (): void => {
        expect(strategyWithSetValues.parse("AVERAGE(A1..A1")).toBe("ERROR: Missing closing parenthesis");
    });

    it('should return error if range contains no cells', (): void => {
        expect(strategyWithSetValues.parse("AVERAGE(B1..A1)")).toBe("ERROR: Cell range must contain at least one cell");
    });
  });
