/**
 * @file cell-interface.ts
 * @interface ICell
 */

import { ICellStyle } from "./cell-style-interface";
import { IValidationRule } from "./validation-rule-interface";

/**
 * An interface that represents a single cell of a spreadsheet
 */
export interface ICell {
	/**
	 * Return the row this ICell is in
	 * @returns the index of this ICell's row
	 */
	getRow(): number;

	/**
	 * Return the column this ICell is in
	 * @returns the index of this ICell's column
	 */
	getColumn(): number;

	/**
	 * Set the index of this ICell's row
	 * @param row the index of the row
	 */
	setRow(row: number): void;

	/**
	 * Set the index of this ICell's column
	 * @param col the index of the column
	 */
	setColumn(col: number): void;

	/**
	 * Returns the true content of the cell in string form
	 * @returns what has been typed into the cell
	 */
	getEnteredValue(): string;

	/**
	 * Returns what the cell displays in string form
	 * @returns the display value of the cell
	 */
	getDisplayValue(): string;

	/**
	 * Add the provided ICell to the list of ICells observing this ICell if it is not already in the list
	 * And add this ICell to the other ICell's list of ICells it is observing
	 * @param observer the ICell observing this ICell
	 */
	attachObserver(observer: ICell): void;

	/**
	 * Remove the provided ICell to the list of ICells observing this ICell if it is in the list
	 * And removes this ICell from the other ICell's list of ICells it is observing
	 * @param observer the ICell observing this ICell
	 */
	detachObserver(observer: ICell): void;

    /**
     * Add the provided ICell to the list of ICells this ICell is observing if it is not already in the list
     * @param observing the ICell this ICell is observing
     */
	attachObserving(observing: ICell): void;

    /**
     * Remove the provided ICell to the list of ICells this ICell is observing if it is in the list
     * @param observing the ICell this ICell is observing
     */
	detachObserving(observing: ICell): void;

    /**
     * Is this ICell observing the provided ICell directly and/or indirectly through the ICells it is observing?
     * @param observing the ICell this ICell is looking for
     * @returns true if this ICell is observing the provided ICell directly or indirectly, false otherwise
     */
	isObserving(observing: ICell): boolean;

	/**
	 * Parses the entered value of this ICell and evaluates the display value of this ICell,
     * checking for any input errors
	 * @param cells the grid of ICells this ICell is using to calculate the value of any references
	 */
	updateDisplayValue(cells: Array<Array<ICell>>): void;

	/**
	 * Replaces the entered value of this ICell with the provided data
	 * @param newValue the new entered value of this ICell
	 */
	setEnteredValue(newValue: string): void;

	/**
	 * Clear the entered value and display value of this ICell
	 */
	clearCell(): void;

	/**
	 * Finds and replaces every instance of the provided string in the entered value of this ICell
	 * @param find the string value to find and be replaced
	 * @param replace the string value to replace the found value in
	 */
	findReplace(find: string, replace: string): void;

	/**
	 * Adds the provided IValidationRule to this ICell's list of IValidationRules
	 * @param rule the IValidationRule to be added
	 */
	addRule(rule: IValidationRule): void;

	/**
	 * Removes the provided IValidationRule to this ICell's list of IValidationRules, if the list contains the rule
	 * @param rule the IValidationRule to be removed
	 */
	removeRule(rule: IValidationRule): void;

	/**
	 * Return all of the IValidationRules that are applied to this ICell
	 * @returns an array of this ICell's IValidationRules
	 */
	getRules(): Array<IValidationRule>;

	/**
	 * Return the ICellStyle that is applied to this ICell
	 * @returns the ICellStyle applied to this ICell
	 */
	getStyle(): ICellStyle;

	/**
	 * Apply the provided ICellStyle to this ICell, replacing this ICell's existing ICellStyle
	 * @param newStyle the ICellStyle to apply to this ICell
	 */
	setStyle(newStyle: ICellStyle): void;
}
