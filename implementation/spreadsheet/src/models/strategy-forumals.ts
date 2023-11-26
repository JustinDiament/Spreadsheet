import { error } from "console";
import { IStrategy } from "../interfaces/strategy-interface";
import { Cell } from "./cell";
import { AExpressionStrategy } from "./strategy-abstract-expression";
import { evaluate } from 'mathjs';

export class StrategyFormulas implements IStrategy {
    private formulaCharacters: Array<string> = ['+', '-', '*', '^', '/'];

    public constructor() {
    }

    parse(currentValue: string): string {
        if (this.formulaCharacters.some(char => currentValue.includes(char))) {
            try {
                return evaluate(currentValue);
            }
            catch (e){
                return '#FORMULAERROR'
            }
        }
        
        return currentValue;


        // for (let i=0; i < sections.length; i++) {
        //     if (this.formulaCharacters.has(sections[i])) {
        //         let buildFormula: string = "";
        //         let needToCheck: boolean = false;

        //         let addToI = -3;
        //         for (let j=i-1; j < sections.length; j++) {
        //             addToI++;
        //             if (needToCheck && !this.formulaCharacters.has(sections[j])) {
        //                 break;
        //             }
        //             else {
        //                 needToCheck = !needToCheck;
        //                 buildFormula = buildFormula + sections[j] + " ";
        //                 sections[j] = "";
        //             }
        //         }
        //         i = i + addToI;
        //         sections[i] = evaluate(buildFormula) + " ";

                // i = i - 2;
                // for (let j=i-1; j < sections.length - 1; j++) {
                //     i++;
                //     console.log(sections[j]);
                //     if (needToCheck && !this.formulaCharacters.has(sections[j])) {
                //         i++;
                //         break;
                //     }
                //     else {
                //         // console.log(buildFormula);
                //         needToCheck = !needToCheck;
                //         buildFormula = buildFormula + sections[j] + " ";
                //         sections[j] = "";
                //     }
                // }
                // console.log(buildFormula);
                // sections[i] += evaluate(buildFormula) + " ";
        //    }
        //     else {
        //         sections[i] += " ";
        //     }
        // }
        // // console.log(sections);
        // return sections.join("");
        
    }
}