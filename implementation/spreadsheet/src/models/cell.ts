import { IGraph } from "../interfaces/graph-interface";
import { IValidationRule } from "../interfaces/validation-rule-interface";
import { ErrorCellData } from "./cell-data-errors-enum";

/**
 * Represents a spreadsheet cell
 */
export class Cell {
    /**
     * The data contained by this cell
     */
    private enteredValue: string; 

    private displayValue: string;

    private validationRules: IValidationRule[];

    public constructor() {
        this.enteredValue = "";
        this.displayValue = "";
        this.validationRules = [];
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
     * Parses the entered value and evaluates the validation rules to update the display value
     */
    public updateDisplayValue(): void{

    }

    /**
     * Replaces the content of a cell 
     * @param newValue the new content ot the cell
     */
    public setEnteredValue(newValue: string) {
        this.enteredValue = "";
        this.updateDisplayValue();
    }

    /**
     * Clear the content of the cell
     */
    public clearCell(): void {
        this.enteredValue = "";
        this.updateDisplayValue(); //still using traditional update method in case having an empty cell violates a rule
    }

    /**
     * Finds and replaces a string in the enterred value of the cell
     * @param find the value to find
     * @param replace the value to replace the found value in
     */
    public findReplace(find: string, replace: string): void {
        if(this.enteredValue.includes(find)) {
            let sections: string[] = this.enteredValue.split(new RegExp(`(${find})`));
            sections.map((element) => (element === find ? replace : element));
            let combinedString: string = sections.join('');
            this.setEnteredValue(combinedString);
        }
    }

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


}