import CellDisplay from "./cellDisplay";
import { ISpreadSheetState } from "../interfaces/controller-interface";
import { useCallback, useEffect, useState } from "react";
import { useSpreadsheetController } from "../models/spreadsheet-controller";
import React from "react";

  // function to convert an number to its corresponding letter
  // where 1 = A, 2 = B,... 27 = AA, 28 = BB, 53 = AAA, etc
  const indToLetter = (ind:number):string => {
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


// the react component for the grid of cells
function CellGridDisplay({findReplaceOpen} : {findReplaceOpen:() => boolean}) {

  console.log("rerender cellgrid display");
  // track the changing state of the grid, which is the grid of cells of the provided spreadsheetState
  const getCells = useSpreadsheetController((controller : ISpreadSheetState) => controller.cells)

  // the selected cell, or first selected if the user has shift-selected multiple cells
  const [firstSelected, setFirst] = useState<string>("");

  // the last selected cell if the user has shift-selected multiple cells
  const [lastSelected, setLast] = useState<string>("");

  // useState for determining whether the shift key is being held down
  const [shiftHeld, setShiftHeld] = useState<boolean>(false);

  // const to keep track of whether the selected cells have already been sent over to the controller
  const [sentSelected, setSentSelected] = useState<boolean>(true);

  // constant to be used in order to call setSelectedMany on the controller
  const setSelectedMany = useSpreadsheetController((controller : ISpreadSheetState) => controller.setSelectedMany);

  // constant to be used in order to call setSelectedOne on the controller
  const setSelectedOne = useSpreadsheetController((controller : ISpreadSheetState) => controller.setSelectedOne);

  // constant to be used in order to track the currently selected cells
   let currSelected = useSpreadsheetController((controller : ISpreadSheetState) => controller.currentlySelected);


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



 // useEffect to select a cell or multiple cells in the backend whenever the lastmost selected cell is changed
 useEffect(() => {
  // we only want to bother running the following code if we haven't already updated the selected cells in the model
  if(!sentSelected) {
    // if there is no first selected cell or the user is not trying to select multiple by holding shift
    // then just update the firstSelected cell, and clear any lastselected cell value
    if(firstSelected==="" || shiftHeld===false) {
      setFirst(lastSelected);
      setSelectedOne(lastSelected);
      setSentSelected(true);
    }
    
    // if there is a first selected cell and the user is holding shift to select multiple,
    // then update the lastSelected cell
    else {
      setSelectedMany(firstSelected, lastSelected);
      setSentSelected(true);
    }
  }
 }, [lastSelected, setSelectedMany, setSelectedOne, setFirst, firstSelected, setSentSelected, sentSelected, shiftHeld]);
  

  /** 
   * function to select a cell or multiple cells using useCallback to prevent every cell rerendering everytime select is passed as Props
    * @param cell the location of the cell that was selected in the frontend
    **/
  const select = useCallback((cell:string) => {
      // only allow selection if find and replace is not active
      if(!findReplaceOpen()) {
        // a new cell was clicked on, but we haven't sent it to the model yet
        setSentSelected(false);
        // update the last-clicked cell to the one provided
        setLast(cell);
      }
  }, [findReplaceOpen])

  const setSelected = useCallback((col: number, row: number) => {
    select(indToLetter(col+1) + (row+1).toString())
  }, [select])

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
              {(getCells.length > 0 && getCells[0].map((curr, col) => (<th className="sp-grid-header sp-col-head" key={indToLetter(col+1)}>{indToLetter(col+1)}</th>)))}
            </tr>
          </thead>

          <tbody className = "overflow-y-scroll sp-grid-body">
              {/* map through the grid to create the row headers */}
              {getCells.map((curr, row) => (<tr key={row+1}><th className="sp-grid-header sp-row-head" key={row+1}>{row+1}</th>
                  {/* map through the row in the grid to get the cells in the row */}
                  {curr.map((cell, col) => (<td className={'m-0 p-1 sp-cell ' + (currSelected.includes(cell) ? 'sp-selected' : '')} key={indToLetter(col+1) + (row+1).toString()} >
                    <CellDisplay cell = {cell}
                                 // the setSelected function in this cell will select cells given the location of this cell
                                setSelected={setSelected}
                                 // the key is to differentiate between the cells in the map for react
                                 key={(indToLetter(cell.getColumn()+1) + (cell.getRow()+1).toString())}
                                 index={(indToLetter(cell.getColumn()+1) + (cell.getRow()+1).toString())}
                                 enabled={findReplaceOpen()}/></td> ))}
                                 
                  </tr> ))}
          </tbody>
        </table>
      </div>
    </div>
  )
};
// memoize to avoid unnecessary rerenders
export default React.memo(CellGridDisplay);