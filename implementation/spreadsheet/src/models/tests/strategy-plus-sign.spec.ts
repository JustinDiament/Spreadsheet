import { assert } from "console";
import { PlusSignStrategy } from "../strategy-plus-sign";

describe('Plus Sign Strategy', (): void => {
    let strategy = new PlusSignStrategy()
  
    it('should concatenate 2 strings', (): void => {
        let originalString = "one + two";
        let expectedString = "onetwo"
        let parsedString = strategy.parse(originalString);
    });

    it('should concatenate 1 string with 1 number', (): void => {
        let originalString = "one + 2";
        let expectedString = "one2"
        let parsedString = strategy.parse(originalString);
    });

    it('should add two numbers', (): void => {
        let originalString = "1 + 2";
        let expectedString = "3"
        let parsedString = strategy.parse(originalString);
    });

    it('should add two numbers when one is negative', (): void => {
        let originalString = "1 + -2";
        let expectedString = "-1"
        let parsedString = strategy.parse(originalString);
    });

    it('should add more than two strings', (): void => {
        let originalString = "a + b + c + d + e";
        let expectedString = "abcde"
        let parsedString = strategy.parse(originalString);
});

    it('should add more than two numbers', (): void => {
            let originalString = "1 + 2 + 3 + 4 + 5";
            let expectedString = "15"
            let parsedString = strategy.parse(originalString);
    });

    it('should add more than two numbers with negatived', (): void => {
        let originalString = "1 + 2 + -3 + 4 + -5";
        let expectedString = "-1"
        let parsedString = strategy.parse(originalString);
    });

    it('should return an error when the equation ends in +', (): void => {
        let originalString = "1 + ";
        let expectedString = "ERROR: Invalid equation"
        let parsedString = strategy.parse(originalString);
    });
  });
