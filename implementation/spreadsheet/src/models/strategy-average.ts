import { IStrategy } from "../interfaces/strategy-interface";
import { Cell } from "./cell";
import { AExpressionStrategy } from "./strategy-abstract-expression";

export class AverageStrategy extends AExpressionStrategy implements IStrategy {
    private otherCells: Cell[][];

    public constructor(otherCells: Cell[][]) {
        super("AVERAGE");
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
            return "ERROR: Missing closing parenthesis"
        }
        let values: string[] = this.resolveRange(splitSections[0], this.otherCells);
        if(values.length < 1) {
            return "ERROR: Cell range must contain at least one cell"
        }
        let sum: number = this.addRangeValues(values);
        let average: number = sum / values.length;
        if(isNaN(average)) {
            return "ERROR: Connot take average of non-numbers"
        }
        return average + splitSections[1];
    }
}