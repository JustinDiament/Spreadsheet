import { IStrategy } from "../interfaces/strategy-interface";
import { evaluate } from 'mathjs';
import { ErrorDisplays } from "./cell-data-errors-enum";

export class StrategyFormulas implements IStrategy {
    private formulaCharacters: Array<string> = ['+', '-', '*', '^', '/'];

    parse(currentValue: string): string {

        if (this.formulaCharacters.some(char => currentValue.includes(char))) {
            try {
                return evaluate(currentValue);
            }
            catch (e){
                return ErrorDisplays.INVALID_FORMULA;
            }
        }
        
        return currentValue;
    }
}