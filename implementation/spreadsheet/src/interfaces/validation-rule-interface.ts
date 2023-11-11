/**
 * Represents a data validation rule for a cell that determines if the data in 
 * that cell is valid or not
 */
export interface IValidationRule {

    /**
     * Is the cell data this rule is applied to valid or invalid according to the rule?
     * @param cellData the data in a cell to be tested 
     * @return true if the data is valid, false if it is not 
     */
    checkRule(cellData: string): boolean;

    /**
     * Returns the appropriate error mesage to display
     */
    getErrorMessage(): string;
}