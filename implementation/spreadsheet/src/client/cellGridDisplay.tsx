import CellDisplay from "./cellDisplay";
import { IController } from "../interfaces/controller-interface";
import { SpreadsheetController } from "../models/spreadsheet-controller";
import { IACellsIterator } from "../interfaces/cell-iterator-interface";
import { Cell } from "../models/cell";
import { useEffect, useState } from "react";

export default function CellGridDisplay({ spreadsheetController, ignore } : { spreadsheetController : IController, ignore:number }) {
    // not sure if we need this use state
    const [grid, setGrid] = useState(spreadsheetController.getCells());
    useEffect(() => {
      console.log(ignore);
      setGrid(spreadsheetController.getCells());
    }, [ignore]);

    useEffect(() => {
      console.log("changed grid");
    }, [grid]);

    // const [selected, setSelected] = useState(spreadsheetController.getSelected());
    const [firstSelected, setFirst] = useState("");
    const [lastSelected, setLast] = useState("");

    // count the number of changes made to the grid (why?)
    let [changesCount, setChangesCount] = useState(0);

    // useState for determining whether the shift key is being held down
    const [shiftHeld, setShiftHeld] = useState(false);

    const updateCount = () => {
      setChangesCount(++changesCount);
      console.log("updatehere");
    }

    // function to update the shift useState depending on if the key being pressed is shift
    function downHandler({key}:{key:string}):void {
    if (key === 'Shift') {
      setShiftHeld(true);
    }
  }

  // function to update the shift useState depending on if the key being lifted is shift
  function upHandler({key}:{key:string}):void {
    if (key === 'Shift') {
      setShiftHeld(false);
    }
  }

  // useEffect to update if the shift key is being pressed or lifted
  useEffect(() => {
    window.addEventListener('keydown', downHandler);
    window.addEventListener('keyup', upHandler);
    return () => {
      window.removeEventListener('keydown', downHandler);
      window.removeEventListener('keyup', upHandler);
    };
  }, []);

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
    }

    // function to select a cell or multiple cells
  
    function select(cell:string) {
      if(firstSelected=="" || shiftHeld==false) {
        setFirst(cell);
        setLast('');
        spreadsheetController.setSelectedOne(cell);
        console.log("first" + cell);
  
      }
      else {
        setLast(cell);
        spreadsheetController.setSelectedMany(firstSelected, cell);
        console.log(firstSelected, lastSelected);
     
      }
    }
    
  return (
    <div>
      <div className = "border overflow-auto sp-grid mt-4">
        <table className="table table-bordered mb-0 overflow-y-hidden">
          <thead>
            <tr>
            {/* the empty cell in the top left corner */}
              <th className="sp-grid-header"></th>
              {/* map through the first row to create headers for every column */}
              {(grid.length > 0 && grid[0].map((curr, index) => (<th className="sp-grid-header sp-col-head">{indToLetter(index+1)}</th>)))}
            </tr>
          </thead>

          <tbody className = "overflow-y-scroll sp-grid-body">
              {/* map through the grid to create the row headers */}
              {grid.map((curr, index) => (<tr><th className="sp-grid-header sp-row-head">{index+1}</th>
                  {/* map through the row in the grid to get the cells in the row */}
                  {curr.map((cell, ind) => (<td className={'m-0 p-1 sp-cell ' + (spreadsheetController.isSelected(cell) ? 'sp-selected' : '')}>
                    <CellDisplay cell = {cell} grid={grid} updateCount={updateCount} 
                    setSelected={() => select(indToLetter(ind+1) + (index+1).toString())}
                    active = {((indToLetter(ind+1) + (index+1).toString()) === firstSelected)} ignore={ignore}/></td> ))}
                  
                  </tr> ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}