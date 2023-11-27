import CellDisplay from "./cellDisplay";
import { ISpreadSheetState } from "../interfaces/controller-interface";
import { useEffect, useState } from "react";
import { useSpreadsheetController } from "../models/spreadsheet-controller";

// the react component for the grid of cells
export default function CellGridDisplay() {
  // track the changing state of the grid, which is the grid of cells of the provided spreadsheetState
  const getCells = useSpreadsheetController((controller : ISpreadSheetState) => controller.cells)

  // the selected cell, or first selected if the user has shift-selected multiple cells
  const [firstSelected, setFirst] = useState<string>("");

  // the last selected cell if the user has shift-selected multiple cells
  const [lastSelected, setLast] = useState<string>("");

  // useState for determining whether the shift key is being held down
  const [shiftHeld, setShiftHeld] = useState<boolean>(false);

  // constant to be used in order to call setSelectedMany on the controller
  const setSelectedMany = useSpreadsheetController((controller : ISpreadSheetState) => controller.setSelectedMany);

  // constant to be used in order to call setSelectedOne on the controller
  const setSelectedOne = useSpreadsheetController((controller : ISpreadSheetState) => controller.setSelectedOne);

  // constant to be used in order to call isSelected on the controller
  // const isSelected = useSpreadsheetController((controller : ISpreadSheetState) => controller.isSelected);
  const isSelected = useSpreadsheetController((controller : ISpreadSheetState) => controller.getSelected);
  // const [selected, setSelected] = useState(useSpreadsheetController((controller : ISpreadSheetState) => controller.currentlySelected));

  // constant to be used in order to call editCell on the controller
  const editCell = useSpreadsheetController((controller : ISpreadSheetState) => controller.editCell)


  // function to update the shift useState depending on if the key being pressed is shift
  function downHandler({key}:{key:string}):void {
    if (key === 'Shift') {
      setShiftHeld(true);
    }
  };

  // function to update the shift useState depending on if the key being lifted is shift
  function upHandler({key}:{key:string}):void {
    if (key === 'Shift') {
      setShiftHeld(false);
    }
  };

  // useEffect to update if the shift key is being pressed or lifted
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

  

  useEffect(() => {

  },   [isSelected]);

  // function to convert an number to its corresponding letter
  // where 1 = A, 2 = B,... 27 = AA, 28 = BB, 53 = AAA, etc
  function indToLetter(ind:number):string {
    let strInd:string = "";
    // how many times we have to go through A-Z/how many letters in the output
    let runs:number = ind/26;
    while(runs > 0) {
      // the current index - meaning if it is currently 1, 27, 53, etc it would be 0, 
      // so that they number of runs does not affect the value of the first index
      // ex. 1, 27, and 53 would all result in a starting index of 0, which corresponds to A
      let currInd:number = (ind- 1)%26;
      // get character from the numeric code
      strInd += (String.fromCharCode(currInd+65));
      ind-=26;
      runs--;
    }
    return strInd;
  };

 
  // function to select a cell or multiple cells
  const select = (cell:string) => {
    // if there is no first selected cell or the user is not trying to select multiple by holding shift
    // then just update the firstSelected cell, and clear any lastselected cell value
    if(firstSelected==="" || shiftHeld===false) {
      setFirst(cell);
      setLast('');
      setSelectedOne(cell);
    }
    
    // if there is a first selected cell and the user is holding shift to select multiple,
    // then update the lastSelected cell
    else {
      setLast(cell);
      setSelectedMany(firstSelected, cell);
    }
  };

  // the actual HTML of the grid of cells
  return (
    <div className="sp-grid-box">
      <div className = "border overflow-auto sp-grid mt-4">
        <table className="table table-bordered mb-0 overflow-y-hidden">
          <thead>
            <tr>
            {/* the empty cell in the top left corner */}
              <th className="sp-grid-header"></th>
              {/* map through the first row to create headers for every column */}
              {(getCells.length > 0 && getCells[0].map((curr, index) => (<th className="sp-grid-header sp-col-head">{indToLetter(index+1)}</th>)))}
            </tr>
          </thead>

          <tbody className = "overflow-y-scroll sp-grid-body">
              {/* map through the grid to create the row headers */}
              {getCells.map((curr, index) => (<tr><th className="sp-grid-header sp-row-head">{index+1}</th>
                  {/* map through the row in the grid to get the cells in the row */}
                  {curr.map((cell, ind) => (<td className={'m-0 p-1 sp-cell ' + (isSelected().includes(cell) ? 'sp-selected' : '')}>
                    <CellDisplay cell = {cell}
                                 // the setSelected function in this cell will select cells given the location of this cell
                                 setSelected={() => select(indToLetter(ind+1) + (index+1).toString())}
                                 // the setValue function in this cell will edit the value of this cell given its location
                                 setValue={(value : string) => editCell(indToLetter(ind+1) + (index+1).toString(), value)}/></td> ))}

                  </tr> ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}