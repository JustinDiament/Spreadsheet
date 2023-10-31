import CellDisplay from "./cellDisplay";
import { IController } from "../interfaces/controller-interface";
import { SpreadsheetController } from "../models/spreadsheet-controller";
import { IACellsIterator } from "../interfaces/cell-iterator-interface";
import { ACell } from "../interfaces/cell-abstract-class";
import { Cell } from "../models/cell";

export default function CellGridDisplay({ cellIterator } : { cellIterator:IACellsIterator }) {
    
    const grid : Array<Array<ACell>> = createArray();

    function createArray():Array<Array<ACell>> {
        let ar = new Array<Array<ACell>>;
        for(let i:number = 0; i < 10; i++) {
            let row : Array<ACell> = new Array<ACell>;
            for(let j:number = 0; j < 10; j++) {
                row.push(new Cell());
            }
            ar.push(row);
        }
        return ar;
    }
     
     const amt : number = grid.length;
    
  
  return (
    <div>
      <table className="table table-bordered ">
        <thead>

        </thead>

        <tbody>

            {grid.map((curr) => (<tr>
                {curr.map((cell) => (<td className="m-0 p-1"><CellDisplay cell = {cell} /></td> ))}
                
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