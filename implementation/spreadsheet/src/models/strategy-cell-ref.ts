import { error } from "console";
import { IStrategy } from "../interfaces/strategy-interface";
import { Cell } from "./cell";
import { AExpressionStrategy } from "./strategy-abstract-expression";
import { Util } from "./util";

export class CellRefStrategy extends AExpressionStrategy implements IStrategy {
    private otherCells: Cell[][];

    public constructor(otherCells: Cell[][], row: number, col: number) {
        super("REF", row, col);
        this.otherCells = otherCells;

    }

    parse(currentValue: string): string {
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

    private evaluate(reference: string) {
        //split based on closing parenthesis
        let splitSections: string[] = reference.split(")", 2);
        //check that closed parenthesis exists
        if (splitSections.length < 2) {
            throw new Error('#REF');
        }
        //the cell we are looking for is the first section in the split string
        let resolvedReference = this.resolveReference(splitSections[0]);
        return resolvedReference + splitSections[1];
    }

    private resolveReference(cellCode: string): string {
        let referenceSections: string[] = cellCode.split(/(\d+)/);
        if(referenceSections.length < 2) {
            throw new Error('#REF');
        }
        // let col: number = this.findCol(referenceSections[0]);
        // let row: number = parseInt(referenceSections[1]);

            let location: Array<number> = Util.getIndicesFromLocation(cellCode);

        if (location[1] == this.row && location[0] == this.col) {
            throw new Error("#SELFREF");
        }

        try {
            //get display value of referenced cell
            return this.otherCells[location[1]][location[0]].getDisplayValue();
        }
        catch {
            throw new Error('#OUTOFRANGE');
        }
    }
}