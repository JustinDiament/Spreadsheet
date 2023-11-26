import { IStrategy } from "../interfaces/strategy-interface";
import { Cell } from "./cell";
import { AExpressionStrategy } from "./strategy-abstract-expression";

export class AverageStrategy extends AExpressionStrategy implements IStrategy {
    private otherCells: Cell[][];

    public constructor(otherCells: Cell[][], row: number, col: number) {
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
        let splitSections: string[] = reference.split(")", 2);
        //check that closed parenthesis exists
        if (splitSections.length < 2) {
            throw new Error("#RANGE");
        }
        let values: string[] = this.resolveRange(splitSections[0], this.otherCells);
        let sum: number = this.addRangeValues(values);
        let average: number = sum / values.length;
        return average + splitSections[1];
    }
}