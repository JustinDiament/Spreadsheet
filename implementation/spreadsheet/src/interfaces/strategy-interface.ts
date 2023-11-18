
/**
 * Represents a strategy for parsing the entered value nto a display value
 */
export interface IStrategy {
    /**
     * Returns an updated string with the current strategy's simplification complete
     */
    parse(currentValue: string): string;
}