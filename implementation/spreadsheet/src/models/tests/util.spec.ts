import { assert } from "console";
import { PlusSignStrategy } from "../strategy-plus-sign";
import { Cell } from "../cell";
import { SumStrategy } from "../strategy-sum";
import { Util } from "../util";
describe('Util Tests', (): void => {   

    it('should take return the value of the cell if only one defined', (): void => {
        expect(Util.getIndicesFromLocation("A1")).toBe([0, 0]);
    });

    it('should throw error if invalid reference', (): void => {
        expect(Util.getIndicesFromLocation("A)")).toThrow(new Error("#INVALIDCELL"));
    });

    it('should throw error if invalid reference', (): void => {
        expect(Util.getIndicesFromLocation("*1")).toThrow(new Error("#INVALIDCELL"));
    });

    it('should throw error if invalid reference', (): void => {
        expect(Util.getIndicesFromLocation("")).toThrow(new Error("#INVALIDCELL"));
    });
  });
