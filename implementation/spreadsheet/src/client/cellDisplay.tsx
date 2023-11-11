//import Cell from "../models/cells.ts";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { ACell } from "../models/cell";
// import ContentEditable from 'react-contenteditable';
// import sanitizeHtml from "sanitize-html"





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
    // let elm = document.getElementById("cell-curr");
    // if (elm !=null) {
    //   elm.style.width = (data.length).toString() + "ch";
    // }
  }

  // const [content, setContent] = React.useState("")

	// const onContentChange = React.useCallback(evt => {
	// 	const sanitizeConf = {
	// 		allowedTags: ["b", "i", "a", "p"],
	// 		allowedAttributes: { a: ["href"] }
	// 	};

	// 	setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf))
	// }, [])



  return (
    <div className="sp-input-sizer">
       {/* <button onClick={() => setCell(cell + 1)}>
        <h1 className="text-dark">Cell </h1>
       </button> */}
      {/* <input id={"cell-curr"}
      type="text"
      // onInput={(e) => parentNode.dataset.value = this.value}
        className="form-control border-0 rounded-0 sp-expandable-input"
        onClick={() => setClickedIn(true)}
        onBlur={(e) => {
          setClickedIn(false);
         updateCount();
        }}
        value={clickedIn ? data : displayData}
        onChange={(e) => update(e.target.value)}
      /> */}
      <div id={"cell-curr"}
        contentEditable = 'true'
        className="form-control border-0 rounded-0 sp-expandable-input"
        onClick={() => setClickedIn(true)}
        // onBlur={() => {
        // //setClickedIn(false);
        // updateCount();
        // }}
        onChange={e => update((e.currentTarget.textContent != null) ? e.currentTarget.textContent : "")}
        
      >{clickedIn ? data : displayData}</div>


      
      
    </div>
  )
}
//export default CellDisplay;