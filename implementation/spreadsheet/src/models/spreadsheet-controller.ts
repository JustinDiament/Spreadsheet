import { IACellsIterator } from "../interfaces/cell-iterator-interface";
import { IController } from "../interfaces/controller-interface";
import { IGraph } from "../interfaces/graph-interface";
import { IValidationRule } from "../interfaces/validation-rule-interface";
import { ACellsIterator } from "./cells-iterator";
import { Cell } from "./cell";
import { IStrategy } from "../interfaces/strategy-interface";
import { CellRefStrategy } from "./strategy-cell-ref";
// todo fix errors and warnings in terminal 
// todo fix comments
// todo fix imports
// todo make things depend on a cell interface not the cell class
// todo error checking
// todo delete unneeded methods and members 
// todo check the key errors in inspect element console

/**
 * Represents the main controller for the spreadsheet application 
 */
export class SpreadsheetController implements IController {

    /**
     * The cells contained in the spreadsheet 
     */
    private cells: Array<Array<Cell>>;

    /**
     * The graphs contained in the spreadsheet 
     */
    private graphs: Array<IGraph> = [];

    /**
     * The cell(s), if any, that are currently selected by the user
     */
    private currentlySelected: Array<Cell> = [];

    /**
     * An iterator that iterates over a 2D array of ACells, used to 
     * perform find and repalce operations
     */
    private cellsIterator: IACellsIterator;

    constructor() {
        // for now, populate the grid of cells with an empty 10x10 grid
        this.cells = new Array<Array<Cell>>;
        for(let i:number = 0; i < 10; i++) {
            let row : Array<Cell> = new Array<Cell>;
            for(let j:number = 0; j < 10; j++) {
                row.push(new Cell(i, j));
            }
            this.cells.push(row);
        }
        this.cellsIterator = new ACellsIterator();
    }

    public getCells(): Array<Array<Cell>> {
        return this.cells;
    }

    public setSelectedOne(cell: string):void {
        //cellIndex = getlocation
        this.currentlySelected = [];
        try{
            let location:Array<number> = this.getIndicesFromLocation(cell);
            this.currentlySelected.push(this.cells[location[1]][location[0]]);
        } catch {
            // select nothing if there was an error
            this.currentlySelected = [];
        }

    }

    public setSelectedMany(cell1: string, cell2:string) : void {
        this.currentlySelected = [];
        try {
            let location1:Array<number> = this.getIndicesFromLocation(cell1);
            let location2:Array<number> = this.getIndicesFromLocation(cell2);
            let colStart:number = Math.min(location1[0], location2[0]);
            let colEnd:number = Math.max(location1[0], location2[0]);
            let rowStart:number = Math.min(location1[1], location2[1]);
            let rowEnd:number = Math.max(location1[1], location2[1]);
            //console.log(colStart, colEnd,rowStart, rowEnd);
            for(let i:number = rowStart; i <= rowEnd; i++) {
                for(let j:number = colStart; j <= colEnd; j++) {
                    this.currentlySelected.push(this.cells[i][j]);
                    
                }
            }

        } catch {
            // select nothing if there was an error
            this.currentlySelected = [];
        }
    }

    public isSelected(cell: Cell): boolean {
        try {
           
            return this.currentlySelected.includes(cell);
        } catch {
            // invalid cell cannot be selected, so return false
            return false;
        }
    }

    // if the function does not throw an error, it will always return an array of two numbers in the format of [col #, row #]
    private getIndicesFromLocation(location:string) : Array<number> {
        let col:number = 0;
        let row:number = 0;
        let stillLetters = true;
        let remainder:string = location;
        if(remainder.length !=0) {
            while(remainder.length > 0 && stillLetters) {
                let sub:string = remainder[0];
                if(sub.match(/[A-Z]/) != null) {
                    (col += (sub.charCodeAt(0) - 65))
                    //console.log(col);
                    remainder = remainder.substring(1);
                } else {
                    stillLetters = false;
                    row = Number(remainder.substring(0));
                    if(isNaN(row)) {
                        throw new Error("invalid location");
                    }
                }
            }
            //console.log(location + ", " + col, row-1);

        } else {
            throw new Error("invalid location");
        }

        return [col, row-1];
    }

    /**
     * Adds a new row to the spreadsheet
     */
    public addRow(aboveOrBelow: string): void {
        let belowRow: number = -1;
        let aboveRow: number = this.cells[0].length;
        let numRowsToAdd: number = 0;
        let colToCheck = this.currentlySelected[0].getColumn();


        for (const cell of this.currentlySelected) {
            if (colToCheck == cell.getColumn()) {
                if (cell.getRow() > belowRow) {
                    belowRow = cell.getRow();
                }

                if (cell.getRow() < aboveRow) {
                    aboveRow = cell.getRow();
                }

                numRowsToAdd++;
            }
        }

        let insertLocation;
        if (aboveOrBelow == "above") {
            insertLocation = aboveRow;
        }
        else {
            insertLocation = belowRow + 1;
        }

        let newCells: Array<Cell> = new Array<Cell>();
        for (let i=0; i < this.cells[0].length; i++) {
            newCells.push(new Cell(insertLocation, i));
        }

        for (let i=0; i < numRowsToAdd; i++) {
            this.cells.splice(insertLocation, 0, newCells)
        }

        for (let i=insertLocation + 1; i < this.cells.length; i++) {
            for (let j=0; j < this.cells[0].length; j++) {
                this.cells[i][j].setRow(i);
            }
        }
    }

    /**
     * Adds a new column to the spreadsheet
     */
    public addColumn(leftOrRight: string): void {
        let leftCol: number = -1;
        let rightCol: number = this.cells.length;
        let numColsToAdd: number = 0;
        let rowToCheck = this.currentlySelected[0].getRow();

        for (const cell of this.currentlySelected) {
            if (rowToCheck == cell.getRow()) {
                if (cell.getColumn() > leftCol) {
                    leftCol = cell.getColumn();
                }

                if (cell.getColumn() < rightCol) {
                    rightCol = cell.getColumn();
                }

                numColsToAdd++;
            }
        }

        let insertLocation;
        if (leftOrRight == "left") {
            insertLocation = leftCol;
        }
        else {
            insertLocation = rightCol + 1;
        }

        // let newCells: Array<Cell> = new Array<Cell>();
        // for (let i=0; i < this.cells[0].length; i++) {
        //     newCells.push(new Cell(insertLocation, i));
        // }

        for (let i=0; i < this.cells.length; i++) {
            for (let j=0; j < numColsToAdd; j++) {
                this.cells[i].splice(insertLocation, 0, new Cell(i, insertLocation));
            }
        }

        for (let i=0; i < this.cells.length; i++) {
            for (let j=insertLocation + 1; j < this.cells[0].length; j++) {
                this.cells[i][j].setColumn(j);
            }
        }
    }

    /**
     * Removes the currently selected rows from the spreadsheet
     */
    public deleteRow(): void {
        // todo check if any rows exist
        // todo check if they are deleting the last row and don't let them do that 
        let rowToDelete: number = this.cells[0].length;
        let numRowsToDelete: number = 0;
        let colToCheck = this.currentlySelected[0].getColumn();

        for (const cell of this.currentlySelected) {
            if (colToCheck == cell.getColumn()) {
                if (cell.getRow() <  rowToDelete) {
                    rowToDelete = cell.getRow();
                }
                numRowsToDelete++;
            }
        }

        for (let i=0; i < numRowsToDelete; i++) {
            this.cells.splice(rowToDelete, 1)
        }

        for (let i=rowToDelete; i < this.cells.length; i++) {
            for (let j=0; j < this.cells[0].length; j++) {
                this.cells[i][j].setRow(this.cells[i][j].getRow() - numRowsToDelete);
            }
        }
    }

    /**
     * Removes the currently selected columns from the spreadsheet
     */
    public deleteColumn(): void {
        // todo check if any cols exist
                // todo check if they are deleting the last col and don't let them do that 
        let colToDelete: number = this.cells.length;
        let numColsToDelete: number = 0;
        let rowToCheck = this.currentlySelected[0].getRow();

        for (const cell of this.currentlySelected) {
            if (rowToCheck == cell.getRow()) {
                if (cell.getColumn() <  colToDelete) {
                    colToDelete = cell.getColumn();
                }
                numColsToDelete++;
            }
        }

        for (let i=0; i < numColsToDelete; i++) {
            for (let j=0; j < this.cells.length; j++) {
                this.cells[j].splice(colToDelete, 1);
            }
        }

        for (let i=0; i < this.cells.length; i++) {
            for (let j=colToDelete; j < this.cells[0].length; j++) {
                this.cells[i][j].setColumn(this.cells[i][j].getColumn() - numColsToDelete);
            }
        }
        
    }

    /**
     * Changes the value of a cell
     * @param cellId the location of the cell to change
     * @param newValue the new value of the cell
     */

    public editCell(cellId: string, newValue: any): void {
        // todo: any should be string???
        // todo: need interface for cell
        let loc : Array<number> = this.getIndicesFromLocation(cellId);
        let row : number = loc[1];
        let col : number = loc[0];
        let cell : Cell = this.cells[row][col];
        cell.setEnteredValue(newValue);
        cell.updateDisplayValue(this.cells);
        //I think this is where we would pass in the strategies and parse the string

    }

    /**
     * Removes the value for a selection of cells
     */
    public clearSelectedCells(): void {
        this.currentlySelected.forEach((cell) => cell.clearCell());
        console.log(this.currentlySelected[0].getDisplayValue());
    }

    /**
     * Removes the value for a selection of cells
     */
    public clearAllCells(): void {
        this.cells.forEach((row) => row.forEach((cell) => cell.clearCell()));
    }

    /**
     * Adds a validation rule to a cell
     * @param cellId the id for the cell to set 
     * @param rule the new rule that the value must adhere to
     */
    public createRule(cellId: number, rule: IValidationRule): void {
        // idea - skip cellID, just iterate through selected cells and apply the rule to them
    }

    /**
     * Removes a validation rule from a cell
     * @param cellId the id for the cell to set 
     * @param rule the rule that should no longer apply
     */
    public removeRule(cellId: number, rule: IValidationRule): void {

        // idea - skip cellID, just iterate through selected cells and remove the rule from them
        // IFF they contain that rule
    }

    /**
     * Find all the cells in the spreadsheet that contain the provided string
     * and stores the data in an array
     * @param find the string that the cells' entered value should contain
     */
    findCellsContaining(find:string): void {
        // TODO
        // find all the cells containing find and store them /somewhere/
        // set currently selected to contain only the first of the cells we just stored
    }

    /**
     * Change the content of the currently selected cell by replacing any instance
     * of the 'find' string in the cell with the 'replace' string 
     * @param find the value to be replaced
     * @param replace the value to replace with
     */
    replaceCurrentCell(find:string, replace:string):void {
        // TODO
        // for(cells in currently selected): cell.findReplace(find, replace);
        // there should either be one or zero currently selected cells
    }

    /**
     * select the next cell that is in the list of currently found cells
     * which is created in the findCellsContaining function
     */
    findNextContaining():void {
        // TODO
        // set currently selected to contain only the next of the cells we stored in
        // findCellsContaining()
        // if the currently selected is the last cell, set next to the first
        // if there are no cells to be replaced, do nothing

    }
    
    /**
     * Finds where a value is present and replaces all instances of it with a new value at the selected id
     * @param find the value to find
     * @param replace the value to change to
     */
    findAndReplaceAll(find: string, replace: string): void {
        this.cells.forEach((row) => {
            row.forEach((element) => {
              element.findReplace(find, replace);
            });
          });
    }

    /**
     * Creates a graph based on a selection of cells
     * @param cells the cells to base the graph on
     */
    createGraph(cells: Array<Cell>): void {
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

    getCellIterator(): IACellsIterator {
        return this.cellsIterator;
    }
}