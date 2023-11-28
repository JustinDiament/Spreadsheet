import { ACell } from "./cell-abstract-class";

/**
 * Represents a type of range expression
 */
export interface IExpressionType {
    /**
     * Parses the data in the cells the range expression is applied to and returns the calculated result
     * @param cells the cells the range expression should be applied to 
     * @return the result of the range expression calculation, or an error message if the data in the cells 
     *         does not fit what is required for the expression to be calculated
     */
    expressionValue(cells: Array<ACell>): string;
}