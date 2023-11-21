export class Util {
    public static getIndicesFromLocation(location:string) : Array<number> {
        let col:number = 0;
        let row:number = 0;
        let stillLetters = true;
        let remainder:string = location;
        if(remainder.length !=0) {
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
                        throw new Error("invalid location");
                    }
                }
            }
            //console.log(location + ", " + col, row-1);
    
        } else {
            throw new Error("invalid location");
        }
    
        return [col, row-1];
    }
}
