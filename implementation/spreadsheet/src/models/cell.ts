import { IGraph } from "../interfaces/graph-interface";
import { IStrategy } from "../interfaces/strategy-interface";
import { IValidationRule } from "../interfaces/validation-rule-interface";
import { ErrorCellData } from "./cell-data-errors-enum";
import { AverageStrategy } from "./strategy-average";
import {CellRefStrategy} from "./strategy-cell-ref";
import { StrategyFormulas } from "./strategy-forumals";
import { PlusSignStrategy } from "./strategy-plus-sign";
import { SumStrategy } from "./strategy-sum";

/**
 * Represents a spreadsheet cell
 */
export class Cell {
    /**
     * The data contained by this cell
     */
    private enteredValue: string; 
    
    /**
     * The data being displayed by this cell
     */
    private displayValue: string;

    /**
     * A list of validation rules being applied to this cell
     */
    private validationRules: IValidationRule[];

    private row: number;

    private col: number;

    /**
     * Create a new empty cell
     */
    public constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
        this.enteredValue = "";
        this.displayValue = "";
        this.validationRules = [];
    }

    public getRow(): number {
        return this.row;
    }

    public getColumn(): number {
        return this.col;
    }

    public setRow(row: number): void {
        this.row = row;
    }

    public setColumn(col: number): void {
        this.col = col;
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
    public updateDisplayValue(cells: Array<Array<Cell>>): void{
        let strategies: Array<IStrategy> = [new CellRefStrategy(cells, this.row, this.col), new AverageStrategy(cells, this.row, this.col), new SumStrategy(cells, this.row, this.col), new PlusSignStrategy(), new StrategyFormulas()];

        let foundError: boolean = false;
        for (const rule of this.validationRules) {
            if (!rule.checkRule(this.enteredValue)) {
              this.displayValue = rule.getErrorMessage();
              foundError = true;  
              break; // This will exit the loop when the condition is met
            }
          }
        //if an error has not been found through the validation rules, continue evaluating the value  
        if(!foundError) {

            let currentString: string = this.enteredValue;
            try {
                strategies.forEach((strategy) => {
                    currentString = strategy.parse(currentString);
                });
            }
            catch(error) {
                if (error instanceof Error) currentString = error.message;
            }


            // Need this so an update actually occurs if its empty
            if (!/\S/.test(currentString)) {
                currentString+=" ";
              }
            this.displayValue = currentString;
        }  


    }

    /**
     * Replaces the content of a cell 
     * @param newValue the new content ot the cell
     */
    public setEnteredValue(newValue: string) {
        this.enteredValue = newValue;
    }

    /**
     * Clear the content of the cell
     */
    public clearCell(): void {
        this.enteredValue = "";
        this.displayValue = "";
    }

    /**
     * Finds and replaces a string in the enterred value of the cell
     * @param find the value to find
     * @param replace the value to replace the found value in
     */
    public findReplace(find: string, replace: string): void {

        if(this.enteredValue.includes(find)) {
            console.log(find);
            console.log(replace);
            console.log("inside");
            let sections: string[] = this.enteredValue.split(new RegExp(`(${find})`));
            console.log(sections);
            
            for (let i=0; i < sections.length; i++) {
                if (sections[i] === find) {
                    sections[i] = replace;
                } 
            }

            let combinedString: string = sections.join('');
            console.log(sections)
            this.setEnteredValue(combinedString);
        }
        console.log(this.getEnteredValue());
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

    /**
     * Adds the provided rule to this Cell's list of rules
     * @param rule the rule to be added
     */
    public addRule(rule : IValidationRule): void {
        this.validationRules.push(rule);
    }

    /**
     * Removes the provided rule from this Cell's list of rules if the list contains it
     * @param rule the rule to be removed
     */
    public removeRule(rule : IValidationRule): void {
        this.validationRules = this.validationRules.filter((r) => r !== rule);
    }

    /**
     * 
     * @returns this Cell's validation rules
     */
    public getRules(): Array<IValidationRule> {
        return this.validationRules;
    }

    


}