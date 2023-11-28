import { IStrategy } from "../interfaces/strategy-interface";
import { Cell } from "./cell";
import { ErrorDisplays } from "./cell-data-errors-enum";
import { AExpressionStrategy } from "./strategy-abstract-expression";

export class SumStrategy extends AExpressionStrategy implements IStrategy {
    private otherCells: Cell[][];

    public constructor(otherCells: Cell[][], row: number, col: number) {
        super("SUM", row, col);
        this.otherCells = otherCells;
    }

    parse(currentValue: string): string {
        let sections: string[] = this.splitInput(currentValue);
        let combinedValue = sections[0];
        sections.splice(0, 1);
        sections.forEach(element => {
            combinedValue += this.evaluate(element);
        });     
        return combinedValue;
    }

    private evaluate(reference: string): string {
        //split based on closing parenthesis
        // let splitSections: string[] = reference.split(")", 2);
        // //check that closed parenthesis exists
        // if (splitSections.length < 2) {
        //     //TODO: throw error that we set if there is no closing parenthesis and handle the error in the cell class
        // }

        const index = reference.indexOf(')');
        //check that closed parenthesis exists
        if (index == -1) {
            throw new Error(ErrorDisplays.INVALID_RANGE_EXPR);
        }

        const firstPart = reference.slice(0, index);
        const secondPart = reference.slice(index + 1);

        let splitSections: string[] = [firstPart, secondPart];

        let values: string[] = this.resolveRange(splitSections[0], this.otherCells);
        let sum = this.addRangeValues(values);
        return sum + splitSections[1];
    }


}