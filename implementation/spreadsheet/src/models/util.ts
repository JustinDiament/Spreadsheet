/**
 * @file util.ts
 * @class Util
 */

import { ErrorDisplays } from "./cell-data-errors-enum";

/**
 * Utility class containing static utility function(s)
 */
export class Util {
  // function to convert a location such as "A1" to a set of column/row coordinates
  public static getIndicesFromLocation(location: string): Array<number> {
    
    // initiate the value of column and number to return
    let col: number = -26;
    let row: number = NaN;
    let stillLetters = true; // are we still parsing letters?
    let remainder: string = location; // the remaining substring of the provided location
    // check the provided location is not empty
    if (remainder.length !== 0) {
      if(remainder.includes(" ")) {
        throw new Error(ErrorDisplays.INVALID_CELL_REFERENCE);
      }
      let letter:string = remainder[0]
      let val:number = 0;
      if (letter.match(/[A-Z]/) !== null) {
        val = letter.charCodeAt(0)-65;
      }
      
      
      // while there are characters to parse and we are still parsing letters
      while (remainder.length > 0 && stillLetters) {
        // is the first character of the remaining string an uppercase letter?
        let sub: string = remainder[0];
        
        if (sub.match(/[A-Z]/) !== null) {
          if(sub!==letter) {
            throw new Error(ErrorDisplays.INVALID_CELL_REFERENCE);
          }

          // get unicode value of letter and convert it to the format where A=0, B=1, ... Z=25
          // add to column because column values work as follows:
          // A = column 0, B = column 1, ... Z = column 25, AA = column 26, BB = column 27, .. etc
          col+=26;
          // remove the value we just parsed from the remaining string
          remainder = remainder.substring(1);
        } else {
          if(col < 0) {
            throw new Error(ErrorDisplays.INVALID_CELL_REFERENCE);
          } 
          col += val;
          // we are no longer parsing numbers, so convert what is left to a number
          stillLetters = false;
          row = Number(remainder.substring(0));
          if (isNaN(row)) {
            // if remaining location could not be converted to a number, it was invalid
            throw new Error(ErrorDisplays.INVALID_CELL_REFERENCE);
          }
        }
      } 
    } else {
      throw new Error(ErrorDisplays.INVALID_CELL_REFERENCE);
    }
    if(row<=0) {
        throw new Error(ErrorDisplays.INVALID_CELL_REFERENCE);
      }
    // subtract 1 from row because the provided location started counting at 1, but we start at 0
    return [col, row - 1];
  }
}
