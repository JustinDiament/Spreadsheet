//import Cell from "../models/cells.ts";
import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ACell } from "../interfaces/cell-abstract-class";




export default function CellDisplay({ cell } : { cell : ACell }) {

 
  
  const [data, setData] : Array<any> = useState(cell.getCellContent());
 
 function update(data : string) : void {
    setData(data);
    cell.editCell(data);
  }

  return (
    <div>
       {/* <button onClick={() => setCell(cell + 1)}>
        <h1 className="text-dark">Cell </h1>
       </button> */}
      <input
        className="form-control border-0 rounded-0"
        value={data}
        onChange={(e) => update(e.target.value)}
      />


      
      
    </div>
  )
}
//export default CellDisplay;