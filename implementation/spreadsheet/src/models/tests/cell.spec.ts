import { Cell } from "../cell";
import { ValueInRangeRule } from "../value-in-range-rule";
import { ValueIsOneOfRule } from "../value-is-one-of-rule";
import { ValueTypeRule } from "../value-type-rule";

describe('Cell Location', (): void => {

  beforeEach((): void => {
  });

  it('cell row should be as set when constructed', (): void => {
    let cell: Cell = new Cell(1,1);
    expect(cell.getRow()).toEqual(1);
  });

  it('cell row should be as set', (): void => {
    let cell: Cell = new Cell(1,1);
    cell.setRow(2)
    expect(cell.getRow()).toEqual(2);
  });

  it('cell col should be as set when constructed', (): void => {
    let cell: Cell = new Cell(1,1);
    expect(cell.getColumn()).toEqual(1);
  });

  it('cell column should be as set', (): void => {
    let cell: Cell = new Cell(1,1);
    cell.setColumn(2)
    expect(cell.getColumn()).toEqual(2);
  });

});

describe('Cell Content', (): void => {

  beforeEach((): void => {
  });

  it('initial cell content should be empty', (): void => {
    let cell: Cell = new Cell(1,1);
    expect(cell.getEnteredValue()).toEqual('');
  });

});

describe('Cell Display', (): void => {

    beforeEach((): void => {
    });
  
    it('initial cell display should be empty', (): void => {
      let cell: Cell = new Cell(1, 1);
      expect(cell.getDisplayValue()).toEqual('');
    });

    it('should return the display value after it has been set and updated', (): void => {
      let cell: Cell = new Cell(1, 1);
      cell.setEnteredValue("hi");
      cell.updateDisplayValue([]);
      expect(cell.getDisplayValue()).toEqual('hi');
    });

    it('should catch errors when updating', (): void => {
      let cell: Cell = new Cell(1, 1);
      cell.setEnteredValue("REF(!)");
      cell.updateDisplayValue([]);
      expect(cell.getDisplayValue()).toEqual('#INVALID-REF');
    });

    it('should be able to update to become empty', (): void => {
      let cell: Cell = new Cell(1, 1);
      cell.setEnteredValue("");
      cell.updateDisplayValue([]);
      expect(cell.getDisplayValue()).toEqual(' ');
    });
  
  });

  describe('Clear Cell', (): void => {

    beforeEach((): void => {
    });
  
    it('Cell entered value should be cleared', (): void => {
      let cell: Cell = new Cell(1,1);
      cell.setEnteredValue("hi")
      cell.clearCell();
      expect(cell.getEnteredValue()).toEqual('');
    });

    it('Cell display should be cleared', (): void => {
      let cell: Cell = new Cell(1,1);
      cell.setEnteredValue("hi")
      cell.updateDisplayValue([]);
      cell.clearCell();
      expect(cell.getDisplayValue()).toEqual('');
    });
  
  });

  describe('Find and Replace', (): void => {

    beforeEach((): void => {
    });
  
    it('Should not change entered value if the value is not present', (): void => {
      let cell: Cell = new Cell(1,1);
      cell.setEnteredValue("hi")
      cell.updateDisplayValue([]);
      cell.findReplace("find", "replace")
      expect(cell.getEnteredValue()).toEqual('hi');
    });

    it('Should not change display value if the value is not present', (): void => {
      let cell: Cell = new Cell(1,1);
      cell.setEnteredValue("hi")
      cell.updateDisplayValue([]);
      cell.findReplace("find", "replace")
      expect(cell.getDisplayValue()).toEqual('hi');
    });

    it('Cell entered value should be changed', (): void => {
      let cell: Cell = new Cell(1,1);
      cell.setEnteredValue("find")
      cell.updateDisplayValue([]);
      cell.findReplace("find", "replace")
      expect(cell.getEnteredValue()).toEqual('replace');
    });

    it('Cell display value should be changed', (): void => {
      let cell: Cell = new Cell(1,1);
      cell.setEnteredValue("find")
      cell.findReplace("find", "replace")
      cell.updateDisplayValue([]);
      expect(cell.getDisplayValue()).toEqual('replace');
    });
    describe('Cell with Multiple Validation Rules', () => {
      let cell: Cell;
    
      beforeEach(() => {
        cell = new Cell(1, 1);
      });
    
      it('should pass all validation rules', () => {
        const valueInRangeRule = new ValueInRangeRule('=', 5);
        const valueIsOneOfRule = new ValueIsOneOfRule(['rule0', 'rule', 'rules']);
        const valueTypeRule = new ValueTypeRule('string');
    
        cell.addRule(valueInRangeRule);
        cell.addRule(valueIsOneOfRule);
        cell.addRule(valueTypeRule);
    
        cell.setEnteredValue('rule0');
    
        // Assuming updateDisplayValue method is working correctly
        cell.updateDisplayValue([]);
    
        // Expect the cell to have the entered value because it passed all validation rules
        expect(cell.getDisplayValue()).toEqual('rule0');
      });
    
      it('should fail one validation rule', () => {
        const valueInRangeRule = new ValueInRangeRule('=', 5);
        const valueIsOneOfRule = new ValueIsOneOfRule(['rule1', 'rule1', 'rule3']);
        const valueTypeRule = new ValueTypeRule('string');
    
        cell.addRule(valueInRangeRule);
        cell.addRule(valueIsOneOfRule);
        cell.addRule(valueTypeRule);
    
        cell.setEnteredValue('rule4'); // Violates valueIsOneOfRule
    
        // Assuming updateDisplayValue method is working correctly
        cell.updateDisplayValue([]);
    
        // Expect the cell to show the error message because it violated one validation rule
        expect(cell.getDisplayValue()).toEqual('#INVALID-REF'); // or whatever error message you set
      });
    
      // Add more test cases for different combinations of passing and failing validation rules
    });
  
  });
