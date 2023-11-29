import { ICell } from "../interfaces/cell-interface";
import { ErrorDisplays } from "./cell-data-errors-enum";
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

    splitInput(currentValue: string): string[] {
        return currentValue.split((this.code + "(")); 
    }

    public addRangeValues(values: string[]): number {
        let combinedValue: number = 0;
        values.forEach(element => {
            combinedValue += Number(element);
        });
        return combinedValue;
    }

    public resolveRange(inputs: string, otherCells: ICell[][]): string[] {
        //split sum parameters by ...
        let splitInputs: string[] = inputs.split("..");
        //find top left row and col
        let locationStart: Array<number> = Util.getIndicesFromLocation(splitInputs[0]);

        //find bottom right row and col
        let locationEnd: Array<number> = Util.getIndicesFromLocation(splitInputs[1]);

        //TODO: handle improper inputs
        let values: string[] = [];
        //for all cells in between those positions in grid, append value and + to string
        //+ will be resolved by a later strategy

        if (locationStart[1] > locationEnd[1] || locationStart[0] > locationEnd[0]) {
            throw new Error(ErrorDisplays.INVALID_RANGE_EXPR);
        }


        if (locationEnd[1] > otherCells.length || locationEnd[0] > otherCells[0].length) {
            throw new Error(ErrorDisplays.REFERENCE_OUT_OF_RANGE);
        }

        for(let i = locationStart[1];i<=locationEnd[1];i++) {
            for(let j = locationStart[0]; j<=locationEnd[0]; j++) {
                if (this.row === i && this.col === j) {
                    throw new Error(ErrorDisplays.REFERENCE_TO_SELF);
                }
                let refCell:ICell= otherCells[i][j];
                let thisCell:ICell = otherCells[this.row][this.col];
                refCell.attachObserver(thisCell);
                values.push(refCell.getDisplayValue());
            }
         }
        return values;
    }

}