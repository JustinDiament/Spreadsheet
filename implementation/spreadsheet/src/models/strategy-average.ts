import { ICell } from "../interfaces/cell-interface";
import { IStrategy } from "../interfaces/strategy-interface";
// import { Cell } from "./cell";
import { ErrorDisplays } from "./cell-data-errors-enum";
import { AExpressionStrategy } from "./strategy-abstract-expression";

export class AverageStrategy extends AExpressionStrategy implements IStrategy {
    private otherCells: ICell[][];

    public constructor(otherCells: ICell[][], row: number, col: number) {
        super("AVERAGE", row, col);
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
        const index = reference.indexOf(')');
        //check that closed parenthesis exists
        if (index === -1) {
            throw new Error(ErrorDisplays.INVALID_RANGE_EXPR);
        }

        const firstPart = reference.slice(0, index);
        const secondPart = reference.slice(index + 1);

        let splitSections: string[] = [firstPart, secondPart];

        let values: string[] = this.resolveRange(splitSections[0], this.otherCells);
        if(values.length < 1) {
            return ErrorDisplays.INVALID_RANGE_EXPR;
        }
        let sum: number = this.addRangeValues(values);
        let average: number = sum / values.length;
        if(isNaN(average)) {
            return ErrorDisplays.INVALID_RANGE_EXPR;
        }
        return average + splitSections[1];
    }
}