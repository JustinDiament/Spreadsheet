import CellDisplay from "./cellDisplay";
import { IController } from "../interfaces/controller-interface";
import { SpreadsheetController } from "../models/spreadsheet-controller";
import { IACellsIterator } from "../interfaces/cell-iterator-interface";
import { ACell } from "../interfaces/cell-abstract-class";
import { Cell } from "../models/cell";
import { useEffect, useState } from "react";

export default function CellGridDisplay({ spreadsheetController } : { spreadsheetController : IController }) {
    
    const [grid, setGrid] = useState(spreadsheetController.getCells());
    let [changesCount, setChangesCount] = useState(0);

    const updateCount = () => {
      setChangesCount(++changesCount);
      console.log("updatehere");
    }

    useEffect(() => {
      // console.log(grid, '- Has changed')
      console.log("doing the useEffect")

    }, []) // <-- here put the parameter to listen, react will re-render component when your state will be changed


//     const [time, setTime] = useState(Date.now());

// useEffect(() => {
//   const interval = setInterval(() => setTime(Date.now()), 1000);
//   return () => {
//     clearInterval(interval);
//   };
// }, []);
  
    //  const amt : number = grid.length;

    function indToLetter(ind:number):string {
      let strInd:string = "";
      let runs:number = ind/26;
      while(runs > 0) {
        let currInd:number = (ind- 1)%26;
        strInd += (String.fromCharCode(currInd+65));
        ind-=26;
        runs--;
        
      }
      return strInd;
    }
    
  return (
    <div>
    <div className = "border overflow-auto sp-grid mt-4">
      <table className="table table-bordered mb-0 overflow-y-hidden">
        <thead>
          <tr>
            <th className="sp-grid-header"></th>
            {(grid.length > 0 && grid[0].map((curr, index) => (<th className="sp-grid-header sp-col-head">{indToLetter(index+1)}</th>)))}
            
          </tr>

        </thead>

        <tbody className = "overflow-y-scroll sp-grid-body">

            {grid.map((curr, index) => (<tr><th className="sp-grid-header sp-row-head">{index+1}</th>
                {curr.map((cell) => (<td className="m-0 p-1 sp-cell">
                  <CellDisplay cell = {cell} grid={grid} updateCount={updateCount} /></td> ))}
                
                </tr> ))}
            
        </tbody>
      </table>
      
      
    </div>
    </div>
  )
}