import { Cell } from "../models/cell";
import { IACellsIterator } from "./cell-iterator-interface";
import { IValidationRule } from "./validation-rule-interface";

/**
 * Represents the main controller for the spreadsheet application 
 */
export interface IController {

    setSelectedOne(cell: string):void;

    setSelectedMany(cell1: string, cell2: string) : void;

    isSelected(cell: Cell) : boolean;

    // getSelected() : string;
    getSelected() : Array<Cell>;
    /**
     * Adds a new row to the spreadsheet
     * FIX
     */
    addRow(aboveOrBelow: string): void;

    /**
     * Adds a new column to the spreadsheet
     * FIX
     */
    addColumn(leftOrRight: string): void;

    /**
     * Removes the currently selected rows from the spreadsheet
     */
    deleteRow(): void;

    /**
     * Removes the selected columns from the spreadsheet
     */
    deleteColumn(): void;

    /**
     * Changes the value of a cell
     * @param cellId the location of the cell to change
     * @param newValue the new value of the cell
     */
    editCell(cellId: string, newValue: any): void;

    /**
     * Removes the value for the selected cells
     */
    clearSelectedCells(): void;

     /**
     * Removes the value for all cells
     */
    clearAllCells(): void;

    /**
     * Adds a validation rule to a cell
     * @param rule the new rule that the value must adhere to
     */
    createRule(rule: IValidationRule): void;

    /**
     * Removes a validation rule from a cell
     * @param rule the rule that should no longer apply
     */
    removeRule(rule: IValidationRule): void;

    /**
     * Returns an array containing all the validation rules that apply to EVERY selected cell
     */
    getAllRules(): Array<IValidationRule>;

    /**
     * Find all the cells in the spreadsheet that contain the provided string
     * and stores the data in an array
     * @param find the string that the cells' entered value should contain
     */
    findCellsContaining(find:string): void;

    /**
     * Change the content of the currently selected cell by replacing any instance
     * of the 'find' string in the cell with the 'replace' string 
     * @param find the value to be replaced
     * @param replace the value to replace with
     */
    replaceCurrentCell(find:string, replace:string):void;
    
    /**
     * select the next cell that is in the list of currently found cells
     * which is created in the findCellsContaining function
     */
    findNextContaining():void;
    
    /**
     * Finds where a value is present and replaces all instances of it with a new value at the selected id
     * @param find the value to find
     * @param replace the value to change to
     */
    findAndReplaceAll(find: string, replace: string): void;

    /**
     * Creates a graph based on a selection of cells
     * @param cells the cells to base the graph on
     */
    createGraph(cells: Array<Cell>): void;

    /**
     * Deletes a graph from the spreadsheet
     * @param graphId the id of the graph to remove
     */
    deleteGraph(graphId: number): void;

    /**
     * Sets a graph x axis name
     * @param id the id of the graph to be renamed
     * @param name the new name
     */
    setGraphXAxisName(id: number, name: string): void;

    /**
     * Sets a graph y axis name
     * @param id the id of the graph to have its x axis renamed
     * @param name the new name
     */
    setGraphYAxisName(id: number, name: string): void;

    /**
     * Sets a graph name
     * @param id the id of the graph to have its y axis renamed
     * @param name the new name
     */
    setGraphName(id: number, name: string): void;

    /**
     * Returns the spreadsheet's cell iterator
     * @return the cell iterator
     */
    getCellIterator() : IACellsIterator;

    getCells(): Array<Array<Cell>>;
}
