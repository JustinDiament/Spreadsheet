
/**
 * Represents a strategy for parsing the entered value nto a display value
 */
export interface IStrategy {
    /**
     * Returns an updated string with the current strategy's simplification complete
     * @param currentValue the display value so far to be modified further by this strategy
     * @returns the display value after being parsed and modified by this strategy
     */
    parse(currentValue: string): string;
}