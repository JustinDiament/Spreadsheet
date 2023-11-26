import { error } from "console";
import { IStrategy } from "../interfaces/strategy-interface";
import { Cell } from "./cell";
import { AExpressionStrategy } from "./strategy-abstract-expression";

//NOT DONE
export class PlusSignStrategy implements IStrategy {
    public constructor() {
    }
    private formulaCharacters: Array<string> = ['+', '-', '*', '^', '/', ')', '(', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ' '];


    parse(currentValue: string): string {
        console.log(currentValue);

        const inputArray = Array.from(currentValue);

        for (const char of inputArray) {
            const index = this.formulaCharacters.indexOf(char);
            if (index == -1) {
                return currentValue.replace(/\+/g, '');
            }
        }

        return currentValue; 
    }
//         // set current string to first element and remove it from the array
//         let combinedValue: string = "";

//         // todo check for reserved characters? like -, + etc
//         // todo include it as a design decision that this reduces all space blocks to 1 space in the display
//         try {
//         for (let i=0; i < sections.length; i++) {
//             if (sections[i] == "+") {
//                 if (isNaN(Number(sections[i-1].replace(/\(/g, ''))) || isNaN(Number(sections[i+1].replace(/\)/g, '')))) {
//                     sections[i+1] = sections[i-1].slice(0, -1) + sections[i+1] + " ";
//                     sections[i-1] = "";
//                     sections[i] = "";
//                     i++;
//                 }
//                 else {
//                     sections[i] += " ";
//                 }
//             }
//             else {
//                 sections[i] += " ";
//             }
//         }

    //     let sections: string[] = currentValue.split(" ");

    //     if (sections.length == 1) {
    //         return sections[0];
    //     }

    //     let reducedSize = 0;
    //     for (let i=0; i < sections.length - reducedSize; i++) {
    //         if (sections[i] == '') {
    //             sections.splice(i, 1);
    //             i--;
    //         }
    //     }

    //     // set current string to first element and remove it from the array
    //     // let combinedValue = "";
    //     let combinedValue: string = ""

    //     // todo bad if ends in + 
    //     // todo check for reserved characters? like -, + etc
    //     // todo include it as a design decision that this reduces all space blocks to 1 space in the display
    //     for (let i=0; i < sections.length; i++) {
    //         if (sections[i] == "+") {
    //             if (isNaN(Number(sections[i-1].replace(/\(/g, ''))) || isNaN(Number(sections[i+1].replace(/\)/g, '')))) {
    //                 sections[i+1] = sections[i-1].slice(0, -1) + sections[i+1] + " ";
    //                 sections[i-1] = "";
    //                 sections[i] = "";
    //                 i++;
    //             }
    //             else {
    //                 sections[i] += " ";
    //             }
    //         }
    //         else {
    //             sections[i] += " ";
    //         }
    //     }

    //     combinedValue+= sections.join("");



         //   let sections: string[] = str.split("+");
            // for (let i=0; i < sections.length - 1; i++) {
            //     console.log(sections[i]);
            //     // stripping whitespace
            //     if (isNaN(Number(sections[i].replace(/\s+$/, ''))) || isNaN(Number(sections[i+1].replace(/^\s+/, '')))) {
            //         sections[i+1] = sections[i].replace(/\s+$/, '') + sections[i+1].replace(/^\s+/, '');
            //         sections[i] = "";
            //     }
            //     else {
            //         sections[i] += "+";
            //     }

        //     }
        // }


        // sections.splice(0, 1);
        // //for the rest of the elements in the array check if both the current string and 
        // sections.forEach(element => {
        //     // sum + Number(element.replace(/\s/g, "")); 
        // });
        // while (sections.length > 1) {
        //     combinedValue += sections[0];
        // }
        // combinedValue += sections[0];
}