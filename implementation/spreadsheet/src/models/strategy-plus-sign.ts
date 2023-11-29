import { IStrategy } from "../interfaces/strategy-interface";


export class PlusSignStrategy implements IStrategy {
    
    private formulaCharacters: Array<string> = ['+', '-', '*', '^', '/', ')', '(', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' '];


    parse(currentValue: string): string {

        const inputArray = Array.from(currentValue);

        for (const char of inputArray) {
            const index = this.formulaCharacters.indexOf(char);
            if (index === -1) {
                return currentValue.replace(/\+/g, '');
            }
        }

        return currentValue; 
    }
}