import { Cell } from "../models/cell";
import { ICellStyle } from "./cell-style-interface";
import { IGraph } from "./graph-interface";
import { IValidationRule } from "./validation-rule-interface";

// representation of the spreadsheet controller, which manages the current state
// of the spreadsheet
export interface ISpreadSheetState {
    // the 2d array/grid of cells in the spreadsheet, instantiated as an
    // empty 10x10 grid of cells
    cells: Cell[][];
    
    // the list of cells in the spreadsheet that are currently selected by the user
    currentlySelected: Cell[];

    // the list of graphs created inside the spreadsheet by the user
    graphs: IGraph[];

    findAndReplaceCells: Cell[];

    /**
     * Set the list of currently selected cells in the spreadsheet to contain
     * only the provided cell, and no other
     * @param cell the cell to set as the currently selected cell, provided via its location
     */
    setSelectedOne(cell: string):void;

    /**
     * Set the list of currently selected cells in the spreadsheet to contain only
     * the cells that fall within the range of cells determined by the provided starting and ending points
     * @param cell1 the first cell in the range of cells to select
     * @param cell2  the last cell in the range of cells to select
     */
    setSelectedMany(cell1: string, cell2: string) : void;

    /**
     * Returns whether the provided cell is contained in the list of currently
     * selected cells
     * @param cell the cell to be determined if it is selected
     */
    isSelected(cell: Cell) : boolean;

    /**
     * Get the list of all currently selected cells
     */
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
    findNextContaining(find: string):void;
    
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
     * Update whether or not the selected cells should be bolded
     * If all cells are bold, unbold. Otherwise, bold all
     */
    

    /**
     * Set the style of the selected cells using the provided functions for determining
     * if a style property is active, and function to set that property's value
     * 
     * If all selected cells have the provided style property activated, it will be deactivated. 
     * Otherwise, it will be activated for all selected cells
     * @param isCellStyled the function for determining if a style property is active
     * @param setCellStyle the function to set a style property's value
     */
    setStyle(isCellStyled:(style:ICellStyle) => boolean, setCellStyle:(style:ICellStyle, value:boolean) => void): void;

    /**
     * Update the color of the text for all selected cells
     * @param textColor the color the text in the cells should be
     */
    setTextColor(textColor:string): void;
}