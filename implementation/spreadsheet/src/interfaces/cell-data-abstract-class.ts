import { IValidationRule } from "./validation-rule-interface";

/**
 * Represents the data contained inside a spreadsheet cell
 */
export abstract class ACellData {

    /**
     * An array of the custom data validation rules applied to this cell, if any
     */
    //protected rules: Array<IValidationRule>;

    /**
     * Replaces the text content of this ACellData 
     * @param data the new text contained in this cell data
     */
    public abstract setData(data: string): void;

    /**
     * Returns the text contained in the cell data, as entered by the user
     * @return the text contained the cell 
     */
    public abstract getData(): string;

    /**
     * Returns the display value of the text in the cell data (for instance, 
     * 5+3 has a dispaly value of 8)
     * @return the display value of the cell 
     */
    public abstract getDisplayValue(): string;


    /**
     * Adds a rule to the ACellData's array of data validation rules
     * @param rule the rule to be added
     */
    public addRule(rule: IValidationRule): string {
        return "";
    }


    /**
     * Removes a rule to the ACellData's array of data validation rules
     * @param rule the rule to be removed
     */
    public removeRule(rule: IValidationRule): string {
        return "";
    }
}