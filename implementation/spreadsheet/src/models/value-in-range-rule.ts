import { IValidationRule } from "../interfaces/validation-rule-interface";

/**
 * Represents a data validation rule about if the data in the cell is in a range of numerical values
 */
export class ValueInRangeRule implements IValidationRule {

    /**
     * Determines if the data in the cell needs to be equal, greater, or less than the value to be valid
     */
    //private equalGreaterLEss: string;

    /**
     * The number that the cell data must be equal/greater/less than in order to be valid
     */
    //private value: number;

    /**
     * Is the cell data this rule is applied to valid or invalid according to the rule?
     * @param cellData the data in a cell to be tested 
     * @return true if the data is valid, false if it is not 
     */
    checkRule(cellData: string): boolean {
        return true;
    }
}