// jest.mock('../spreadsheet-controller', ()=>({
//   ...jest.requireActual('../spreadsheet-controller'),
//   useSpreadSheetController: jest.fn()
// }))
// import { useState } from 'react';

import { shallow } from "zustand/shallow";
import { ICell } from "../../interfaces/cell-interface";
import { ISpreadSheetState } from "../../interfaces/controller-interface";
import React, { useState } from "react";
import SpreadSheetDisplay from "../../client/spreadSheetDisplay";
import { useSpreadsheetController } from "../spreadsheet-controller";
import { Cell } from "../cell";


export default function() {
describe('please', () => {
//     jest.mock("../spreadsheet-controller.ts", () => ({
//     useSpreadsheetState: (controller: ISpreadSheetState) => {
//         const data = {
//             cells:[],
//             currentlySelected:[]
//         }

//         // return controller(data);
//     }
// }));
    const state:ISpreadSheetState=useSpreadsheetController((controller) => controller)

    let cells:ICell[][] = [];
    beforeEach(() => {

    for(let i:number = 0; i < 10; i++) {
      let row:ICell[] = [];
      for(let j:number = 0; i < 10; i++) {
        row.push(new Cell(i, j));
      }
      cells.push(row);
    }
    })
    it('really wants to work', () => {
      expect(state.cells).toEqual(cells);
    })
  })
}
  

//   let cells:ICell[][];
//   let currentlySelected:ICell[];
//   let currentState:ISpreadSheetState;
//   //let set:((state:ISpreadSheetState)
//     let wrapper = (<SpreadSheetDisplay/>);
//     let setState:((state:ISpreadSheetState) => void) = jest.fn((newState:ISpreadSheetState) => (currentState=newState));

//     const useStateSpy = jest.spyOn(React, 'useState');
//   describe("Test", ()=>{
//   beforeEach(()=>{
//     useStateSpy.mockImplementation(jest.requireActual('react').useState);
//     //other preperations
//   })
// wrapper.setState()
//     // useStateSpy.mockImplementation((init:ISpreadSheetState) => [init, setState]);
//      const button:JSXElement = wrapper.find("button");
//      button.simulate('click');
//      expect(setState).toHaveBeenCalledWith(1);
// })}