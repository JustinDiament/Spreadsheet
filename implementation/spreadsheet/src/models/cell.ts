import { IGraph } from "../interfaces/graph-interface";
import { IValidationRule } from "../interfaces/validation-rule-interface";

/**
 * Represents a spreadsheet cell
 */
export class Cell {
    /**
     * The data contained by this cell
     */
    private enteredValue: string; 

    private displayValue: string;

    public constructor() {
        this.enteredValue = "";
        this.displayValue = "";
    }

    /**
     * Clear the content of the cell
     */
    public clearCell(): void {
        this.enteredValue = "";
    }

    /**
     * Replaces the content of a cell 
     * @param newValue the new content ot the cell
     */
    public setEnteredValue(newValue: string) {
        this.enteredValue = "";
    }

    /**
     * Returns the true content of the cell in string form 
     * @returns what has been typed into the cell
     */
    public getEnteredValue(): string {
        return this.enteredValue;
    }

    /**
     * Returns what the cell displays
     * @returns the display value of the cell
     */
    public getDisplayValue(): string {
        return this.displayValue;
    }

    /**
     * Evaluates this cell against a validation rule
     * @param rule the rule to add to this cell
     */
    public evaluateRule(rule: IValidationRule): void {

    }

    /**
     * Determines whether the math in the cell is a calculation or 
     * concatenation and performs it, updating the display value accordingly
     */
    public calculateOrConcatenate(): void {}

    /**
     * Adds a graph as an observer to this Cell
     * @param graph the graph that observes this cell  
     */
    public attachGraph(graph: IGraph): void {}

    /**
     * Remotes a graph as an observer to this Cell
     * @param graph the graph that will be removed from oberserving this Cell 
     */
    public detachGraph(graph: IGraph): void {
    }

    /**
     * Notifies all overerving graphs that this cell has been updates 
     */
    public notifyGraph(): void {
    }

    public findReplace(find: string, replace: string): void {
        if(this.enteredValue.includes(find)) {
            let sections: string[] = this.enteredValue.split(new RegExp(`(${find})`));
            sections.map((element) => (element === find ? replace : element));
            let combinedString: string = sections.join('');
            this.setEnteredValue(combinedString);
        }
    }
}