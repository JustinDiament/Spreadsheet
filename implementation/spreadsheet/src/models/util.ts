import { ErrorDisplays } from "./cell-data-errors-enum";

export class Util {
    public static getIndicesFromLocation(location:string) : Array<number> {
        let col:number = 0;
        let row:number = 0;
        let stillLetters = true;
        let remainder:string = location;
        if(remainder.length !==0) {
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
                        console.log("row " + row);
                        throw new Error(ErrorDisplays.INVALID_CELL_REFERENCE);
                        
                    }
                }
            }
            //console.log(location + ", " + col, row-1);
    
        } else {
            console.log("col " + col);
            throw new Error(ErrorDisplays.INVALID_CELL_REFERENCE);
        }
    
        return [col, row-1];
    }
}
