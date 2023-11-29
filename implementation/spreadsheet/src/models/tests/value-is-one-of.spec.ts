import { ValueIsOneOfRule } from "../value-is-one-of-rule";


describe('ValueIsOneOfRule', () => {
  let rule: ValueIsOneOfRule;

  beforeEach(() => {
    // Initialize the rule with a specific set of values
    rule = new ValueIsOneOfRule(['rule1', 'rule2', 'rule3']);
  });
  it('should allow values that are numbers in the specified set', () => {
    const allowedValues = [5, 10, 15];
    const rule = new ValueIsOneOfRule(allowedValues);

    // Values that are numbers in the specified set
    for (const value of allowedValues) {
      const isValid = rule.checkRule(value.toString());
      expect(isValid).toBe(true);
    }
  });

  it('should not allow values that are not in the specified set', () => {
    const allowedValues = ['apple', 'orange', 'banana'];
    const rule = new ValueIsOneOfRule(allowedValues);

    // Values that are not in the specified set
    const invalidValues = ['grape', 'kiwi', 'pear'];
    for (const value of invalidValues) {
      const isValid = rule.checkRule(value.toString());
      expect(isValid).toBe(false);
    }
  });

  it('should handle edge case with an empty set and reject any value', () => {
    const rule = new ValueIsOneOfRule([]);
    const isValid = rule.checkRule('anyValue');
    expect(isValid).toBe(false);
  });

  // Add more edge cases as needed

});

export {};