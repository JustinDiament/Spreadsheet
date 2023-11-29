import { IValidationRule } from "../interfaces/validation-rule-interface";
import { ErrorDisplays } from "./cell-data-errors-enum";

/**
 * Represents a data validation rule about the type the data in a cell is allowed to be 
 */
export class ValueTypeRule implements IValidationRule{

    /**
     * The type that the data in the cell needs to be in order to be valid
     */
    private type: string;


	constructor($type: string) {
		this.type = $type;
	}


    /**
     * Is the cell data this rule is applied to valid or invalid according to the rule?
     * @param cellData the data in a cell to be tested 
     * @return true if the data is valid, false if it is not 
     */
    public checkRule(cellData: string): boolean {
        if (this.type === "num") {
            return !isNaN(Number(cellData));
        } else if (this.type === "word") {
            return typeof cellData === "string";
        } else if (this.type === "any") {
            return true;
        }
        else {
             // If the type is not recognized, consider it invalid
            throw new Error(ErrorDisplays.INVALID_CELL_DATA);
        }
    }

    public getType():string {
        return this.type;
    }

    public getErrorMessage(): string {
        return ErrorDisplays.INVALID_CELL_REFERENCE;
    }
}