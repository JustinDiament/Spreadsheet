/**
 * @file value-in-range-rule.spec.ts
 * @testing ValueInRangeRule
 */

import { ValueInRangeRule } from "../value-in-range-rule";

describe('Value in Range Rule', (): void => {

    beforeEach((): void => {
    });

  it('should allow values that are equal to the specified value when the rule is "==="', () => {
    const rule = new ValueInRangeRule('===', 5);
    const isValid = rule.checkRule('5');
    expect(isValid).toBe(true);
  });
 
  it('should handle the case where numbers being compared are negative and positive when the rule is "==="', () => {
    const rule = new ValueInRangeRule('===', -5);
    const isValid = rule.checkRule('5');
    expect(isValid).toBe(false);
  });

  it('should handle the case where there is an expression being evaluated when the rule is "==="', () => {
    const rule = new ValueInRangeRule('===', -5 * -1);
    const isValid = rule.checkRule('5');
    expect(isValid).toBe(true);
  });
  
  it('should handle the case where there is an expression requring order of operations being evaluated when the rule is "==="', () => {
    const rule = new ValueInRangeRule('===', (-5 + 1) * -1);
    const isValid = rule.checkRule('4');
    expect(isValid).toBe(true);
  });

  it('should not allow values that are not equal to the specified value when the rule is "=="', () => {
    const rule = new ValueInRangeRule('===', 5);
    const isValid = rule.checkRule('10');
    expect(isValid).toBe(false);
  });

  it('should handle negative numbers and allow them when the rule is "<"', () => {
    const rule = new ValueInRangeRule('<', -5);
    const isValid = rule.checkRule('-10');
    expect(isValid).toBe(true);
  });

  it('should handle decimal values and allow them when the rule is "<="', () => {
    const rule = new ValueInRangeRule('<=', 5.5);
    const isValid = rule.checkRule('5.3');
    expect(isValid).toBe(true);
  });

  it('should handle 0 values and allow them when the rule is ">="', () => {
    const rule = new ValueInRangeRule('>=', 0);
    const isValid = rule.checkRule('0');
    expect(isValid).toBe(true);
  });

  it('should handle large numbers and allow them when the rule is ">="', () => {
    const rule = new ValueInRangeRule('>=', 1000000);
    const isValid = rule.checkRule('1000001');
    expect(isValid).toBe(true);
  });
  

});
export {}