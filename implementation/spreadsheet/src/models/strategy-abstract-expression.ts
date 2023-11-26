import { Cell } from "./cell";
import { Util } from "./util";

export abstract class AExpressionStrategy {
    code: string;
    row: number;
    col: number;

    constructor(code: string, row: number, col: number) {
        this.code = code;
        this.row = row;
        this.col = col;
    }

    useStrategy(currentValue: string): boolean {
        return currentValue.includes((this.code + "("));
    }

    splitInput(currentValue: string): string[] {
        return currentValue.split((this.code + "(")); 
    }

    public findCol(letters: string): number {
        let columnNumber = 0;

        for (let i = 0; i < letters.length; i++) {
          const charCode = letters.charCodeAt(i) - 65; // Convert ASCII to 0-based index
          columnNumber = columnNumber * 26 + charCode + 1;
        }
        return columnNumber;
    }
    public addRangeValues(values: string[]): number {
        let combinedValue: number = 0;
        values.forEach(element => {
            combinedValue += Number(element);
        });
        return combinedValue;
    }

    public resolveRange(inputs: string, otherCells: Cell[][]): string[] {
        //split sum parameters by ...
        let splitInputs: string[] = inputs.split("..");
        //find top left row and col
        // let firstCode: string[] = splitInputs[0].split(/(\d+)/);
        // let firstCol: number = this.findCol(firstCode[0]);
        // let firstRow: number = parseInt(firstCode[1]);
        let locationStart: Array<number> = Util.getIndicesFromLocation(splitInputs[0]);


        //find bottom right row and col
        // let secondCode: string[] = splitInputs[1].split(/(\d+)/);
        // let secondCol: number = this.findCol(secondCode[0]);
        // let secondRow: number = parseInt(secondCode[1]);
        let locationEnd: Array<number> = Util.getIndicesFromLocation(splitInputs[1]);

        //TODO: handle improper inputs
        let values: string[] = [];
        //for all cells in between those positions in grid, append value and + to string
        //+ will be resolved by a later strategy
        for(let i = locationStart[1];i<=locationEnd[1];i++) {
            for(let j = locationStart[0]; j<=locationEnd[0]; j++) {
                if (this.row == i && this.col == j) {
                    throw new Error("#SELFREF");
                }

                values.push(otherCells[i][j].getDisplayValue());
            }
         }
        return values;
    }

}