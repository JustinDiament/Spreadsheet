import { IGraph } from "./graph-interface";
import { IValidationRule } from "./validation-rule-interface";

/**
 * Represents a spreadsheet cell
 */
export abstract class ACell {
    /**
     * Clear the content of the cell
     */
    public abstract clearCell(): void;

    /**
     * Replaces the content of a cell 
     * @param newValue the new content ot the cell
     */
    public abstract editCell(newValue: string): void;

    /**
     * Returns the true content of the cell in string form 
     * @returns what has been typed into the cell
     */
    public abstract getCellContent(): string;

    /**
     * Returns what the cell displays
     * @returns the display value of the cell
     */
    public abstract getCellDisplay(): string;

    /**
     * Adds a validation rule to this cell 
     * @param rule the rule to add to this cell
     * @returns the display value of the cell
     */
    public abstract createRule(rule: IValidationRule);

    /**
     * Removes a validation rule from this cell 
     * @param rule the rule to remove from this cell
     * @returns the display value of the cell
     */
    public abstract removeRule(rule: IValidationRule);

    /**
     * Determines whether the math in the cell is a calculation or 
     * concatenation and performs it, updating the display value accordingly
     */
    public abstract calculateOrConcatenate(): void;

    /**
     * Adds a graph as an observer to this ACell
     * @param graph the graph that observes this cell  
     */
    public attachGraph(graph: IGraph): void {
    }

    /**
     * Remotes a graph as an observer to this ACell
     * @param graph the graph that will be removed from oberserving this ACell 
     */
    public detachGraph(graph: IGraph): void {
    }

    /**
     * Notifies all overerving graphs that this cell has been updates 
     */
    public notifyGraph(): void {
    }
}