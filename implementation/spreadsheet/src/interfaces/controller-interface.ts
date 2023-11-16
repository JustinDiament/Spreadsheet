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

    /**
     * Adds a new row to the spreadsheet
     * @param rowId the id representing where to insert the new row
     */
    addRow(rowId: number): void;

    /**
     * Adds a new column to the spreadsheet
     * @param colId the id representing where to insert the new column
     */
    addColumn(colId: number): void;

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
     * @param cellId the id of the cell to change
     * @param newValue the new value of the cell
     */
    editCell(cellId: number, newValue: any): void;

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
     * @param cellId the id for the cell to set 
     * @param rule the new rule that the value must adhere to
     */
    createRule(cellId: number, rule: IValidationRule): void;

    /**
     * Removes a validation rule from a cell
     * @param cellId the id for the cell to set 
     * @param rule the rule that should no longer apply
     */
    removeRule(cellId: number, rule: IValidationRule): void;
    
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
