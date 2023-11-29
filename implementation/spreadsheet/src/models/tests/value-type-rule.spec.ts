import { ValueTypeRule } from "../value-type-rule";


describe('ValueTypeRule', () => {
  let rule: ValueTypeRule;

  beforeEach(() => {
    // Initialize the rule with a specific expected type
    rule = new ValueTypeRule('number');
  });
  it('should allow values of the specified type (string)', () => {
    const rule = new ValueTypeRule('string');
    const isValid = rule.checkRule('hello');
    expect(isValid).toBe(true);
  });

  it('should allow values of the specified type (boolean)', () => {
    const rule = new ValueTypeRule('boolean');
    const isValid = rule.checkRule('true');
    expect(isValid).toBe(true);
  });

  it('should not allow values of a different type', () => {
    const rule = new ValueTypeRule('number');
    const isValid = rule.checkRule('hello');
    expect(isValid).toBe(false);
  });

  it('should handle edge case with an invalid type and reject any value', () => {
    const rule = new ValueTypeRule('invalidType');
    const isValid = rule.checkRule('anyValue');
    expect(isValid).toBe(false);
  });

  // Add more edge cases as needed

});

export {};