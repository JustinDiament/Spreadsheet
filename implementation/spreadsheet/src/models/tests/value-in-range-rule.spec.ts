
import { ValueInRangeRule } from "../value-in-range-rule";

describe('ValueInRangeRule', () => {
  let rule: ValueInRangeRule;

  beforeEach(() => {
    // Initialize the rule with a specific range
    rule = new ValueInRangeRule('greater', 5);
  });
  it('should allow values that are equal to the specified value when the rule is "=="', () => {
    const rule = new ValueInRangeRule('==', 5);
    const isValid = rule.checkRule('5');
    expect(isValid).toBe(true);
  });

  it('should not allow values that are not equal to the specified value when the rule is "=="', () => {
    const rule = new ValueInRangeRule('==', 5);
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

  it('should handle large numbers and allow them when the rule is ">="', () => {
    const rule = new ValueInRangeRule('>=', 1000000);
    const isValid = rule.checkRule('1000001');
    expect(isValid).toBe(true);
  });

});

export {};