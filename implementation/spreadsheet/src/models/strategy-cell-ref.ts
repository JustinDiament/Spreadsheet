/**
 * @file strategy-cell-ref.ts
 */

import { IStrategy } from "../interfaces/strategy-interface";
import { AExpressionStrategy } from "./strategy-abstract-expression";
import { Util } from "./util";
import { ErrorDisplays } from "./cell-data-errors-enum";
import { ICell } from "../interfaces/cell-interface";


export class CellRefStrategy extends AExpressionStrategy implements IStrategy {
    private otherCells: ICell[][];

    public constructor(otherCells: ICell[][], row: number, col: number) {
        super("REF", row, col);
        this.otherCells = otherCells;
        

    }

    public parse(currentValue: string): string {
        let sections: string[] = this.splitInput(currentValue);
        let combinedValue = "";
        //add first string in array because it will be whatever is before the cell reference
        combinedValue += sections[0];
        sections.splice(0, 1);
        sections.forEach(element => {
            combinedValue += this.evaluate(element);
        });     
        // combinedValue += sections[0];
        return combinedValue;
    }

    private evaluate(reference: string): string {
        //split based on closing parenthesis
        const index = reference.indexOf(')');
        //check that closed parenthesis exists
        if (index === -1) {
            throw new Error(ErrorDisplays.INVALID_CELL_REFERENCE);
        }

        const firstPart = reference.slice(0, index);
        const secondPart = reference.slice(index + 1);

        let splitSections: string[] = [firstPart, secondPart];

        //the cell we are looking for is the first section in the split string
        let resolvedReference = this.resolveReference(splitSections[0]);
        return resolvedReference + splitSections[1];
    }

    private resolveReference(cellCode: string): string {
        let referenceSections: string[] = cellCode.split(/(\d+)/);
        if(referenceSections.length < 2) {
            throw new Error(ErrorDisplays.INVALID_CELL_REFERENCE);
        }
        // let col: number = this.findCol(referenceSections[0]);
        // let row: number = parseInt(referenceSections[1]);

            let location: Array<number> = Util.getIndicesFromLocation(cellCode);

        if (location[1] === this.row && location[0] === this.col) {
            throw new Error(ErrorDisplays.REFERENCE_TO_SELF);
        }

        

        try {
            if (this.otherCells[location[1]][location[0]].isObserving(this.otherCells[this.row][this.col])) {
            throw new Error(ErrorDisplays.REFERENCE_TO_SELF);
        }
            //get display value of referenced cell
            let refCell:ICell= this.otherCells[location[1]][location[0]];
            let thisCell:ICell = this.otherCells[this.row][this.col];
            refCell.attachObserver(thisCell);
            
            return refCell.getDisplayValue();
        }
        catch {
            throw new Error(ErrorDisplays.REFERENCE_OUT_OF_RANGE);
        }
    }
}