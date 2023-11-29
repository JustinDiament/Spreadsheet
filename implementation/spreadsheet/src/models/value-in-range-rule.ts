import { IValidationRule } from "../interfaces/validation-rule-interface";
import { ErrorDisplays } from "./cell-data-errors-enum";

/**
 * Represents a data validation rule about if the data in the cell is in a range of numerical values
 */
export class ValueInRangeRule implements IValidationRule{

    /**
     * Determines if the data in the cell needs to be equal, greater, or less than the value to be valid
     */
    private equalGreaterLess: string;

    /**
     * The number that the cell data must be equal/greater/less than in order to be valid
     */
    private value: number;

    constructor(equalGreaterLess:string, value:number) {
        this.equalGreaterLess=equalGreaterLess;
        this.value=value;

    }

    /**
     * Is the cell data this rule is applied to valid or invalid according to the rule?
     * @param cellData the data in a cell to be tested 
     * @return true if the data is valid, false if it is not 
     */
    checkRule(cellData: string): boolean {
        const numericCellData = Number(cellData);

        if (isNaN(numericCellData)) {
            throw new Error(ErrorDisplays.INVALID_CELL_DATA);
        }

        switch (this.equalGreaterLess) {
            case "equal":
                return numericCellData === this.value;
            case "greater":
                return numericCellData > this.value;
            case "less":
                return numericCellData < this.value;
            default:
                throw new Error(ErrorDisplays.INVALID_CELL_DATA);
        }
    }

    public getErrorMessage(): string {
        return ErrorDisplays.INVALID_CELL_DATA;
    }

    public getComparison():string {
        return this.equalGreaterLess;
    }

    public getValue():number {
        return this.value;
    }
}