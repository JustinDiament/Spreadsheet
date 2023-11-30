/**
 * @file util.spec.ts
 * @testing Util
 */

import { Util } from "../util";
import { ErrorDisplays } from "../cell-data-errors-enum";
// tests for the Util class
describe('Testing the Util Class', (): void => {
  // tests for the function getIndicesFromLocation(location:string): Array<number>
  describe('Testing getIndicesFromLocation', (): void => {
  
    // VALID INPUTS

    // test valid format: 1 uppercase letter and 1 digit positive number
    it('should return an array of size 2 with a valid input', (): void => {
      let indices = Util.getIndicesFromLocation("B5");
      // first check it's an array
      expect(indices).toBeInstanceOf(Array<number>);
      // check length is two
      expect(indices).toHaveLength(2);
    });

    // test column as first value: 1 uppercase letter and 1 digit positive number
    it('should return column as first value given valid input', (): void => {
      let indices = Util.getIndicesFromLocation("B5");
      // column should be 2
      expect(indices[0]).toEqual(1);
    });

    // test column as first value: 1 uppercase letter and 1 digit positive number
    it('should return row as second value given valid input', (): void => {
      let indices = Util.getIndicesFromLocation("B5");
      // row should be 4
      expect(indices[1]).toEqual(4);
    });

    // test valid column and row: 1 uppercase letter and 1 digit positive number
    it('should return correct indices given 1 uppercase and 1 digit positive', (): void => {
      let indices = Util.getIndicesFromLocation("C8");
      expect(indices).toEqual([2, 7]);
    });

    // test valid column and row: 1 uppercase letter and 2 digit positive number not containing 0
    it('should return correct indices given 1 uppercase and 2 digit positive', (): void => {
      let indices = Util.getIndicesFromLocation("J19");
      expect(indices).toEqual([9, 18]);
    });

    // test valid column and row: 1 uppercase letter and 2 digit positive number that ends in 0
    it('should return correct indices given 1 uppercase and 2 digit positive ending 0', (): void => {
      let indices = Util.getIndicesFromLocation("J20");
      expect(indices).toEqual([9, 19]);
    });

    // test valid column and row: 1 uppercase letter and 2 digit positive number containing leading zero
    it('should return correct indices given 1 uppercase and 2 digit positive leading zero', (): void => {
      let indices = Util.getIndicesFromLocation("K09");
      expect(indices).toEqual([10, 8]);
    });

    // test valid column and row: 2 identical uppercase letters and 1 digit positive number
    it('should return correct indices given 2 uppercase and 1 digit positive', (): void => {
      let indices = Util.getIndicesFromLocation("CC4");
      expect(indices).toEqual([28, 3]);
    });

    // test valid column and row: 2 identical uppercase letter and 2 digit positive number not containing 0
    it('should return correct indices given 2 uppercase and 2 digit positive', (): void => {
      let indices = Util.getIndicesFromLocation("AA33");
      expect(indices).toEqual([26, 32]);
    });

    // test valid column and row: 2 identical uppercase letter and 3 digit positive number
    it('should return correct indices given 2 uppercase and 3 digit positive', (): void => {
      let indices = Util.getIndicesFromLocation("BB230");
      expect(indices).toEqual([27, 229]);
    });

    // test valid column and row: >3 identical uppercase letter and >3 digit positive number
    it('should return correct indices given >3 uppercases and >3 digits positive', (): void => {
      let indices = Util.getIndicesFromLocation("ZZZZ23023");
      expect(indices).toEqual([103, 23022]);
    });



    // INVALID INPUTS

    // test invalid: no letter and 1 digit positive number != 0
    it('should throw error given only number', (): void => {
      expect(() => Util.getIndicesFromLocation("1")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: 1 lowercase letter and 1 digit positive number != 0
    it('should throw error given 1 lowercase letter and 1 digit number', (): void => {
      expect(() => Util.getIndicesFromLocation("a1")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: 2 lowercase letter and 1 digit positive number != 0
    it('should throw error given 2 lowercase letters and 1 digit number', (): void => {
      expect(() => Util.getIndicesFromLocation("aa1")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: 1 nonletter non number character and 1 digit positive number != 0
    it('should throw error given 1 nonletter character and 1 digit number', (): void => {
      expect(() => Util.getIndicesFromLocation("(8")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: 1 lowercase letter and no number 
    it('should throw error given 1 lowercase letter and no number', (): void => {
      expect(() => Util.getIndicesFromLocation("a")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: 1 uppercase letter and 0
    it('should throw error given 1 uppercase letter and 0', (): void => {
      expect(() => Util.getIndicesFromLocation("B0")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: 2 uppercase letter and 0
    it('should throw error given 2 uppercase letter and 0', (): void => {
      expect(() => Util.getIndicesFromLocation("BB0")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: 2 mismatched uppercase letter and number !=0
    it('should throw error given 2 mismatched uppercase letter and number', (): void => {
      expect(() => Util.getIndicesFromLocation("AB8")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: 2 mismatched uppercase letter and no number
    it('should throw error given 2 mismatched uppercase letter and no number', (): void => {
      expect(() => Util.getIndicesFromLocation("AB")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: empty string
    it('should throw error given empty string', (): void => {
      expect(() => Util.getIndicesFromLocation("")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: 1 digit number then 1 uppercase letter
    it('should throw error given number then uppercase letter', (): void => {
      expect(() => Util.getIndicesFromLocation("4G")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: space between letter and number
    it('should throw error given space between letter and number', (): void => {
      expect(() => Util.getIndicesFromLocation("G 7")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: leading space
    it('should throw error given leading space', (): void => {
      expect(() => Util.getIndicesFromLocation(" G7")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: trailing space
    it('should throw error given trailing space', (): void => {
      expect(() => Util.getIndicesFromLocation("G7 ")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: only space
    it('should throw error given only space', (): void => {
      expect(() => Util.getIndicesFromLocation(" ")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: non number character between letter and number
    it('should throw error given 1 uppercase, 1 invalid character, and 1 number', (): void => {
      expect(() => Util.getIndicesFromLocation("H)6")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });

    // test invalid: uppercase number and negative number
    it('should throw error given 1 uppercase, and 1 negative', (): void => {
      expect(() => Util.getIndicesFromLocation("H-6")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
    });
  })
});
