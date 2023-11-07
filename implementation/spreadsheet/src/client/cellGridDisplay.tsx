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

    // function createArray():Array<Array<ACell>> {
    //     // let ar = new Array<Array<ACell>>;
    //     // for(let i:number = 0; i < 10; i++) {
    //     //     let row : Array<ACell> = new Array<ACell>;
    //     //     for(let j:number = 0; j < 10; j++) {
    //     //         row.push(new Cell());
    //     //     }
    //     //     ar.push(row);
    //     // }
    //     // return ar;

    //     return controller.getCells();
    // }
     
    //  const amt : number = grid.length;
    
  return (
    <div>
      <table className="table table-bordered ">
        <thead>

        </thead>

        <tbody>

            {grid.map((curr) => (<tr>
                {curr.map((cell) => (<td className="m-0 p-1"><CellDisplay cell = {cell} grid={grid} updateCount={updateCount} /></td> ))}
                
                </tr> ))}
            
            {/* <tr> */}
                
                {/* here is where we iterate through the cells in the spreadsheet */}
                {/* <th><CellDisplay /></th> */}
                {/* {grid.map((curr) => (<td><CellDisplay cell = {curr} /></td> ))}
                <td>{amt}</td> */}

            {/* </tr> */}
        </tbody>
      </table>
      
      
    </div>
  )
}