import { ICell } from "../interfaces/cell-interface";
import { IStrategy } from "../interfaces/strategy-interface";
import { ErrorDisplays } from "./cell-data-errors-enum";
import { AExpressionStrategy } from "./strategy-abstract-expression";

export class SumStrategy extends AExpressionStrategy implements IStrategy {
    private otherCells: ICell[][];

    public constructor(otherCells: ICell[][], row: number, col: number) {
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
        let sum = this.addRangeValues(values);
        if(isNaN(sum)) {
            return ErrorDisplays.INVALID_RANGE_EXPR;
        }
        return sum + splitSections[1];
    }


}