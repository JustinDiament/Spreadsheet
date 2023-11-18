import { error } from "console";
import { IStrategy } from "../interfaces/strategy-interface";
import { Cell } from "./cell";
import { AExpressionStrategy } from "./strategy-abstract-expression";

//NOT DONE
export class PlusSignStrategy implements IStrategy {
    public constructor() {
    }

    parse(currentValue: string): string {
        // let sections: string[] = this.splitInput(currentValue);
        //set current string to first element and remove it from the array
        // let combinedValue = sections[0];
        // sections.splice(0, 1);
        // //for the rest of the elements in the array check if both the current string and 
        // sections.forEach(element => {
        //     // sum + Number(element.replace(/\s/g, "")); 

        // });
        // while (sections.length > 1) {
        //     combinedValue += sections[0];
        // }
        // combinedValue += sections[0];
        // return combinedValue;
        return "sum"
    }
}