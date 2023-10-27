/**
 * Represents a calculator that can complete mathematical operations 
 */
export interface ICalculator {
    /**
     * Parses a string into mathematical operations and determines the result of the operations
     * @param data the equation to parse and calculate the result of
     * @return the result of the operations, or an error message if the equation is malformed
     */
    performOperations(data: string): string;
}