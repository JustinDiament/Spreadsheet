/**
 * @file value-type-rule.spec.ts
 * @testing ValueTypeRule
 */

import { ValueTypeRule } from "../value-type-rule";

describe('Value type rule', (): void => {

    beforeEach((): void => {
    });
    it('should allow values of the specified type (string)', () => {
      const rule = new ValueTypeRule('string');
      const isValid = rule.checkRule('hello');
      expect(isValid).toBe(true);
    });
  
    it('should not allow values of a different type', () => {
      const rule = new ValueTypeRule('number');
      const isValid = rule.checkRule('hello');
      expect(isValid).toBe(false);
    });

    it('should not allow values of a different type even if the first part of the cell has the correct type', () => {
      const rule = new ValueTypeRule('number');
      const isValid = rule.checkRule(1 + "hi");
      expect(isValid).toBe(false);
    });

    it('should not allow values of a different type even if for example a number is a string', () => {
      const rule = new ValueTypeRule('number');
      const isValid = rule.checkRule('"2"');
      expect(isValid).toBe(false);
    });
  
  
    it('should handle edge case with an invalid type and reject any value', () => {
      const rule = new ValueTypeRule('invalidType');
      const isValid = rule.checkRule('anyValue');
      expect(isValid).toBe(false);
    });

    it('should handle edge case with an empty string and a number rule and accept any value ', () => {
      const rule = new ValueTypeRule('number');
      const isValid = rule.checkRule('');
      expect(isValid).toBe(true);
    });

    it('should handle edge case with an empty string and a string rule and accept any value ', () => {
      const rule = new ValueTypeRule('string');
      const isValid = rule.checkRule('');
      expect(isValid).toBe(true);
      
    });
    it('should handle large numbers where the data rule specifies the entry must be a number', () => {
      const rule = new ValueTypeRule('number');
      const isValid = rule.checkRule('1000000000000000000000000000');
      expect(isValid).toBe(true);
    });
  
  });
export {}