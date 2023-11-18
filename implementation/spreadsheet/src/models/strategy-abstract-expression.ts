export abstract class AExpressionStrategy {
    code: string;
    
    constructor(code: string) {
        this.code = code;
    }

    useStrategy(currentValue: string): boolean {
        return currentValue.includes(this.code);
    }

    splitInput(currentValue: string): string[] {
        return currentValue.split(this.code); 
    }
}