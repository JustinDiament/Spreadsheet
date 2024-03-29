import { ACell } from "../interfaces/cell-abstract-class";
import { IACellsIterator } from "../interfaces/cell-iterator-interface";
import { IController } from "../interfaces/controller-interface";
import { IGraph } from "../interfaces/graph-interface";
import { IValidationRule } from "../interfaces/validation-rule-interface";

/**
 * Represents the main controller for the spreadsheet application 
 */
export class SpreadsheetController implements IController {

    /**
     * The cells contained in the spreadsheet 
     */
    private cells: Array<Array<ACell>>;

    /**
     * The graphs contained in the spreadsheet 
     */
    private graphs: Array<IGraph>;

    /**
     * The cell(s), if any, that are currently selected by the user
     */
    private currentlySelected: Array<ACell>;

    /**
     * An iterator that iterates over a 2D array of ACells, used to 
     * perform find and repalce operations
     */
    private cellsIterator: IACellsIterator

    /**
     * Adds a new row to the spreadsheet
     * @param rowId the id representing where to insert the new row
     */
    public addRow(rowId: number): void {
    }

    /**
     * Adds a new column to the spreadsheet
     * @param colId the id representing where to insert the new column
     */
    public addColumn(colId: string): void {
    }

    /**
     * Removes a row from the spreadsheet
     * @param rowId the id representing what row to delete
     */
    public deleteRow(rowIdes: Array<number>): void {
    }

    /**
     * Removes a column from the spreadsheet
     * @param colId the id representing what column to delete
     */
    public deleteColumn(colIdes: Array<string>): void {
    }

    /**
     * Changes the value of a cell
     * @param cellId the id of the cell to change
     * @param newValue the new value of the cell
     */
    public editCell(cellId: number, newValue: any): void {
    }

    /**
     * Removes the value for a selection of cells
     * @param cellIds the ids of the cells to clear
     */
    public clearCells(cellIds: Array<number>): void {
    }

    /**
     * Adds a validation rule to a cell
     * @param cellId the id for the cell to set 
     * @param rule the new rule that the value must adhere to
     */
    public createRule(cellId: number, rule: IValidationRule): void {
    }

    /**
     * Removes a validation rule from a cell
     * @param cellId the id for the cell to set 
     * @param rule the rule that should no longer apply
     */
    public removeRule(cellId: number, rule: IValidationRule): void {
    }
    
    /**
     * Finds where a value is present and replaces it with a new value at the selected id
     * @param find the value to find
     * @param replace the value to change to
     * @param id the id of the position of the found value
     */
    public findAndReplace(find: string, replace: string, id: number): void {
    }
    
    /**
     * Finds where a value is present and replaces all instances of it with a new value at the selected id
     * @param find the value to find
     * @param replace the value to change to
     */
    findAndReplaceAll(find: string, replace: string): void {
    }

    /**
     * Creates a graph based on a selection of cells
     * @param cells the cells to base the graph on
     */
    createGraph(cells: Array<ACell>): void {
    }

    /**
     * Deletes a graph from the spreadsheet
     * @param graphId the id of the graph to remove
     */
    deleteGraph(graphId: number): void {
    }

    /**
     * Sets a graph x axis name
     * @param id the id of the graph to be renamed
     * @param name the new name
     */
    setGraphXAxisName(id: number, name: string): void {
    }

    /**
     * Sets a graph y axis name
     * @param id the id of the graph to have its x axis renamed
     * @param name the new name
     */
    setGraphYAxisName(id: number, name: string): void {
    }

    /**
     * Sets a graph name
     * @param id the id of the graph to have its y axis renamed
     * @param name the new name
     */
    setGraphName(id: number, name: string): void {
    }
}