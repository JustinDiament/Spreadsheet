import { IValidationRule } from "../interfaces/validation-rule-interface";
import { ErrorDisplays } from "./cell-data-errors-enum";

/**
 * Represents a data validation rule about if the data in the cell 
 * is one of a set number of options
 */
export class ValueIsOneOfRule implements IValidationRule {
    private values: Array<string | number>;

    constructor(values: Array<string | number>) {
        this.values = values;
    }

    /**
     * Is the cell data this rule is applied to valid or invalid according to the rule?
     * @param cellData the data in a cell to be tested 
     * @return true if the data is valid, false if it is not 
     */
    public checkRule(cellData: string): boolean {
        // Check if cellData is in the set of allowed values
        return this.values.includes(cellData);
    }

    public getErrorMessage(): string {
        return ErrorDisplays.INVALID_CELL_DATA;
    }

    public getValues(): Array<string | number> {
        return this.values;
    }
}