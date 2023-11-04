import { IValidationRule } from "../interfaces/validation-rule-interface";

/**
 * Represents a data validation rule about the type the data in a cell is allowed to be 
 */
export class ValueTypeRule implements IValidationRule {

    /**
     * The type that the data in the cell needs to be in order to be valid
     */
    //private type: string;

    /**
     * Is the cell data this rule is applied to valid or invalid according to the rule?
     * @param cellData the data in a cell to be tested 
     * @return true if the data is valid, false if it is not 
     */
    public checkRule(cellData: string): boolean {
        return true;
    }
}