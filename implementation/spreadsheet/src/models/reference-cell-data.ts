import { ACell } from "../interfaces/cell-abstract-class";
import { ACellData } from "../interfaces/cell-data-abstract-class";
import { ErrorCellData } from "./cell-data-errors-enum";

/**
 * Represents a reference to another cell contained in a cell
 */
export class ReferenceCellData extends ACellData {
  /**
   * The cell that this cell refers to
   */
  private reference: ACell | ErrorCellData;

  private data: string;

  constructor(data: string, grid: Array<Array<ACell>>) {
    super();
    this.data = data;
    //this.reference = grid[0][0];
    // TODO: needs more error checking to make sure ')' doesn't occur first, or is missing, or string is too short, etc

    try {
      const cell_location = data.slice(3, data.indexOf(")"));

      // TODO: a lot more error checking here too and rest of constructor
      let endRow = 0;
      for (let i = 0; i < cell_location.length; i++) {
        const currentChar = cell_location[i];

        if (/[0-9]/.test(currentChar)) {
          endRow = i;
          break;
        }
      }

      // TODO: make work for AA and beyond (after 26 letters)
      // Make sure char 0 is a '('
      const col = cell_location.slice(1, endRow).charCodeAt(0) - 65;
      const row = parseInt(cell_location.slice(endRow, cell_location.length));
      console.log(row);
      console.log(col);
      this.reference = grid[col][row - 1];

      if (!this.reference) {
        this.reference = ErrorCellData.INVALREF;
      }
    } catch {
      this.reference = ErrorCellData.INVALREF;
    }
  }

  /**
   * Replaces the text content of this ACellData
   * @param data the new text contained in this cell data
   */
  public setData(data: string): void {}

  /**
   * Returns the text contained in the cell data, as entered by the user
   * @return the text contained the cell
   */
  public getData(): string {
    return this.data;
  }

  /**
   * Returns the display value of the text in the cell data (for instance,
   * 5+3 has a dispaly value of 8)
   * @return the display value of the cell
   */
  public getDisplayValue(): string {
    if (this.reference instanceof ACell) {
      return this.reference.getCellDisplay();
    }

    return this.reference;
  }
}
