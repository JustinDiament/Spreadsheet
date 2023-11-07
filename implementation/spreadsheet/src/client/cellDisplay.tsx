//import Cell from "../models/cells.ts";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ACell } from "../interfaces/cell-abstract-class";




export default function CellDisplay({ cell, grid, updateCount } : { cell : ACell, grid : Array<Array<ACell>>, updateCount: Function}) {

  let [clickedIn, setClickedIn] = useState(false);
  const [data, setData] : Array<any> = useState(cell.getCellContent());
  const [displayData, setDisplayData] : Array<any> = useState(cell.getCellDisplay());


  useEffect(() => {
   // console.log(cell.getCellContent() + 'celldisplay use effect')
    update(data);
  }) // <-- here put the parameter to listen, react will re-render component when your state will be changed
  
 function update(data : string) : void {
    cell.editCell(data, grid);
    setData(cell.getCellContent());
    setDisplayData(cell.getCellDisplay());
  }

  return (
    <div>
       {/* <button onClick={() => setCell(cell + 1)}>
        <h1 className="text-dark">Cell </h1>
       </button> */}
      <input
        className="form-control border-0 rounded-0"
        onClick={() => setClickedIn(true)}
        onBlur={(e) => {
          setClickedIn(false);
         updateCount();
        }}
        value={clickedIn ? data : displayData}
        onChange={(e) => update(e.target.value)}
      />


      
      
    </div>
  )
}
//export default CellDisplay;