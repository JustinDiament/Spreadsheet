import { Util } from "../util";
import { ErrorDisplays } from "../cell-data-errors-enum";
// tests for the Util class
describe('Testing the Util Class', (): void => {
  // tests for the function getIndicesFromLocation(location:string): Array<number>
  describe('Testing getIndicesFromLocation', (): void => {
    // tests input groups:
    /**
     * valid: 
    
  
     * BBB100
     * BB0100
     * BBBBBBBBB19923045
     * 
     * length = 2, order is correct, value of col is correct, value of row is correct
     * 
     * 
     * invalid:
     * a1
     * ?1
     * A0
     * AB
     * A?
     * A
     * 1
     * ""
     * 1A
     * " "
     * A 1
     * 1 A
     * A-1
     * 23
     * undefined
     * 
     * check that it throws and that it throws the right error
     */

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
      expect(indices[0]).toBe(1);
    });

    // test column as first value: 1 uppercase letter and 1 digit positive number
    it('should return row as second value given valid input', (): void => {
      let indices = Util.getIndicesFromLocation("B5");
      // row should be 4
      expect(indices[1]).toBe(4);
    });

    // test valid column and row: 1 uppercase letter and 1 digit positive number
    it('should return correct indices given 1 uppercase and 1 digit positive', (): void => {
      let indices = Util.getIndicesFromLocation("C8");
      // column should be 2
      expect(indices[0]).toBe(2);
      // row should be 7
      expect(indices[1]).toBe(7);
    });

    // test valid column and row: 1 uppercase letter and 2 digit positive number not containing 0
    it('should return correct indices given 1 uppercase and 2 digit positive', (): void => {
      let indices = Util.getIndicesFromLocation("J19");
      // column should be 9
      expect(indices[0]).toBe(9);
      // row should be 18
      expect(indices[1]).toBe(18);
    });

    // test valid column and row: 1 uppercase letter and 2 digit positive number that ends in 0
    it('should return correct indices given 1 uppercase and 2 digit positive ending 0', (): void => {
      let indices = Util.getIndicesFromLocation("J20");
      // column should be 9
      expect(indices[0]).toBe(9);
      // row should be 19
      expect(indices[1]).toBe(19);
    });

    // test valid column and row: 1 uppercase letter and 2 digit positive number containing leading zero
    it('should return correct indices given 1 uppercase and 2 digit positive leading zero', (): void => {
      let indices = Util.getIndicesFromLocation("K09");
      // column should be 10
      expect(indices[0]).toBe(10);
      // row should be 18
      expect(indices[1]).toBe(8);
    });

    // test valid column and row: 2 identical uppercase letters and 1 digit positive number
    it('should return correct indices given 2 uppercase and 1 digit positive', (): void => {
      let indices = Util.getIndicesFromLocation("CC4");
      // column should be 30
      expect(indices[0]).toBe(30);
      // row should be 18
      expect(indices[1]).toBe(3);
    });

    // test valid column and row: 2 identical uppercase letter and 2 digit positive number not containing 0
    it('should return correct indices given 2 uppercase and 2 digit positive', (): void => {
      let indices = Util.getIndicesFromLocation("AA33");
      // column should be 26
      expect(indices[0]).toBe(26);
      // row should be 18
      expect(indices[1]).toBe(32);
    });

    // // test valid column and row: 2 identical uppercase letter and 2 digit positive number not containing 0
    // it('should return correct indices given 2 uppercase and 2 digit positive', (): void => {
    //   let indices = Util.getIndicesFromLocation("AA33");
    //   // column should be 26
    //   expect(indices[0]).toBe(26);
    //   // row should be 18
    //   expect(indices[1]).toBe(32);
    // });

    // test valid column and row: 2 identical uppercase letter and 2 digit positive number not containing 0
    it('should throw error given only number', (): void => {
      expect(() => Util.getIndicesFromLocation("1")).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE)
      // // column should be 26
      // expect(indices[0]).toBe(26);
      // // row should be 18
      // expect(indices[1]).toBe(32);
    });


    // it('should throw error if invalid reference', (): void => {
    //     expect(() => {
    //         Util.getIndicesFromLocation("A)");
    //       }).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE);
    // });

    // it('should throw error if invalid reference', (): void => {
    //     expect(() => {
    //         Util.getIndicesFromLocation("*1)");
    //       }).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE);    
    //     });

    // it('should throw error if invalid reference', (): void => {
    //     expect(() => {
    //         Util.getIndicesFromLocation("");
    //       }).toThrow(ErrorDisplays.INVALID_CELL_REFERENCE);    });

    // it('should take the value of the cell if only one defined', (): void => {
    //     expect(Util.getIndicesFromLocation("A1")).toBe([0, 0]);
    // });
  })
});
