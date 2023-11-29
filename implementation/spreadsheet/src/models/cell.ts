import { ICell } from "../interfaces/cell-interface";
import { ICellStyle } from "../interfaces/cell-style-interface";
import { IStrategy } from "../interfaces/strategy-interface";
import { IValidationRule } from "../interfaces/validation-rule-interface";
import { ErrorDisplays } from "./cell-data-errors-enum";
import { CellStyle } from "./cell-style";
import { AverageStrategy } from "./strategy-average";
import { CellRefStrategy } from "./strategy-cell-ref";
import { StrategyFormulas } from "./strategy-formulas";
import { PlusSignStrategy } from "./strategy-plus-sign";
import { SumStrategy } from "./strategy-sum";

/**
 * Represents a spreadsheet cell
 */
export class Cell implements ICell {
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
     * The style to be applied to the text inside of this cell
     */
    private style: ICellStyle;

    /**
     * The list of cells observing this cell (OTHERS)
     */
    private observers: Array<ICell>;

    /**
     * The list of cells this cell is observing (MINE)
     */
    private observing: Array<ICell>;

    /**
     * Create a new empty cell
     */
    public constructor(row: number, col: number) {
        this.row = row;
        this.col = col;
        this.enteredValue = "";
        this.displayValue = "";
        this.validationRules = [];
        this.style = new CellStyle();
        this.observers = [];
        this.observing = [];
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

    public attachObserver(observer:ICell) : void {
        if(!this.observers.includes(observer)) {
            this.observers.push(observer);
            observer.attachObserving(this);
        }
    }

    public detachObserver(observer:ICell) : void {
        let index: number = this.observers.indexOf(observer);
        if(index > -1) {
            this.observers.splice(index, 1);
            observer.attachObserving(this);
        }
    }

    public attachObserving(observing:ICell):void {
        this.observing.push(observing);
    }

    public detachObserving(observing:ICell):void {
        let index: number = this.observing.indexOf(observing);
        if(index > -1) {
            this.observing.splice(index, 1);
        }
    }

    public isObserving(observing:ICell) :boolean {
        let isObserving = this.observing.includes(observing);
        if(!isObserving) {
            this.observing.forEach((element:ICell) => (isObserving = isObserving && element.isObserving(observing)));
        }

        return isObserving;
    }

    /**
     * Parses the entered value and evaluates the validation rules to update the display value
     */
    public updateDisplayValue(cells: Array<Array<ICell>>): void{
        this.observing.forEach((observed: ICell) => observed.detachObserver(observed));
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
                for(let i:number = 0; i<strategies.length; i++) {
                    let strategy=strategies[i];
                    currentString = strategy.parse(currentString);
                    let noObservingError = true;
                    this.observing.forEach((element:ICell) => 
                    (noObservingError = noObservingError && !(Object.values(ErrorDisplays) as any).includes(element.getDisplayValue())));
                        if(!noObservingError) {
                            currentString=ErrorDisplays.INVALID_CELL_REFERENCE;
                        break; 
                    }
                      
                }
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

        this.observers.forEach((observer: ICell) => observer.updateDisplayValue(cells)); 


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
        console.log("enum check: " + ((Object.values(ErrorDisplays) as any).includes('#INVALID-EXPR')));
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

    /**
     * 
     * @returns the style applied to this cell
     */
    public getStyle(): ICellStyle {
        return this.style;
    }

    /**
     * Apply a new style to this cell
     * @param newStyle the new style to apply to this cell
     */
    public setStyle(newStyle: ICellStyle): void {
        this.style=newStyle;
    }

}