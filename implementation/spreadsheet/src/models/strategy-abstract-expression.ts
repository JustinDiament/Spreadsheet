import { Cell } from "./cell";

export abstract class AExpressionStrategy {
    code: string;
    
    constructor(code: string) {
        this.code = code;
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
        let splitInputs: string[] = inputs.split("...");
        //find top left row and col
        let firstCode: string[] = splitInputs[0].split(/(\d+)/);
        let firstCol: number = this.findCol(firstCode[0]);
        let firstRow: number = parseInt(firstCode[1]);

        //find bottom right row and col
        let secondCode: string[] = splitInputs[1].split(/(\d+)/);
        let secondCol: number = this.findCol(secondCode[0]);
        let secondRow: number = parseInt(secondCode[1]);
        //TODO: handle improper inputs
        let values: string[] = [];
        //for all cells in between those positions in grid, append value and + to string
        //+ will be resolved by a later strategy
        for(let i = firstCol;i<=secondCol;i++) {
            for(let j = firstRow; j<=secondRow; j++) {
                values.push(otherCells[i][j].getDisplayValue());
            }
         }
        return values;
    }

}