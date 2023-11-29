import { IStrategy } from "../interfaces/strategy-interface";
import { evaluate } from 'mathjs';
import { ErrorDisplays } from "./cell-data-errors-enum";

export class StrategyFormulas implements IStrategy {
    private formulaCharacters: Array<string> = ['+', '-', '*', '^', '/'];

    private legalCharacters: Array<string> = ['+', '-', '*', '^', '/', ')', '(', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' ', '.'];

    parse(currentValue: string): string {


        if (this.formulaCharacters.some(char => currentValue.includes(char))) {
            let inputSet:Set<string> = new Set(currentValue);
            let legal:boolean = true;
            inputSet.forEach((char) => legal = legal && this.legalCharacters.includes(char));
            if(!legal) {
                return ErrorDisplays.INVALID_FORMULA;
            }
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