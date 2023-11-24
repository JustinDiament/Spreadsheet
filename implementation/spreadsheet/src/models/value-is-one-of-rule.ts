import { IValidationRule } from "../interfaces/validation-rule-interface";

/**
 * Represents a data validation rule about if the data in the cell is one of a set number of options
 */
export class ValueIsOneOfRule implements IValidationRule{

    /**
     * The set of values for the cell that it must be one of in order to be valid
     */
    private values: Array<string | number>;

    constructor($values:Array<string | number>) {
        this.values = $values;
    }

    /**
     * Is the cell data this rule is applied to valid or invalid according to the rule?
     * @param cellData the data in a cell to be tested 
     * @return true if the data is valid, false if it is not 
     */
    public checkRule(cellData: string): boolean {
        return true;
    }

    public getErrorMessage(): string {
        
        return "";
    }

    public getValues(): Array<string | number> {
        return this.values;
    }
}