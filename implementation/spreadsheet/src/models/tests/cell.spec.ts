// import { Cell } from "../cell";

import { Cell } from "../cell";

// describe('Cell Content', (): void => {

//   beforeEach((): void => {
//   });

//   it('initial cell content should be empty', (): void => {
//     let cell: Cell = new Cell();
//     expect(cell.getEnteredValue()).toEqual('');
//   });

// });

describe('Cell Display', (): void => {

    beforeEach((): void => {
    });
  
    it('initial cell display should be empty', (): void => {
      let cell: Cell = new Cell(1, 1);
      expect(cell.getDisplayValue()).toEqual('');
    });
  
  });
export {}