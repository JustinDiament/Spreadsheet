import React, { useEffect, useState } from "react";
import { Cell } from "../models/cell";
// import sanitizeHtml from "sanitize-html"

// React component for rendering an editable cell
export default function CellDisplay({ cell, grid, updateCount, setSelected, active, ignore } : { cell : Cell, grid : Array<Array<Cell>>, updateCount: Function, setSelected: Function, active:boolean, ignore:number}) {
  //const [selected, setCellSelect] = useState(active);
  const [clickedIn, setClickedIn] = useState(false);
  const [data, setData] : Array<any> = useState(cell.getEnteredValue());
  const [displayData, setDisplayData] : Array<any> = useState(cell.getDisplayValue());

  useEffect(() => {
    setData(cell.getEnteredValue());
    setDisplayData(cell.getDisplayValue());
    console.log("rerender cell?");
  }, [ignore]);

  // when the cell is clicked on, set it as either selected in the range 
  // or selected as the single active cell
  useEffect(() => {
    (clickedIn && setSelected());    
  }, [clickedIn]);

  // useEffect(()=> {
  //   //(clickedIn ? setDisplayData(cell.getEnteredValue()) : setDisplayData(cell.getDisplayValue()));
  //   (clickedIn ? setDisplayData(cell.getEnteredValue()) : setDisplayData("test"));
  // }, [clickedIn]);

  // update the content of the cell based on the passed in data
  function update(newData : string) : void {
    cell.setEnteredValue(newData);
    setData(cell.getEnteredValue());
    setDisplayData(cell.getDisplayValue());
    console.log(data);
    setClickedIn(false);
  }

  // const [content, setContent] = React.useState("")

	// const onContentChange = React.useCallback(evt => {
	// 	const sanitizeConf = {
	// 		allowedTags: ["b", "i", "a", "p"],
	// 		allowedAttributes: { a: ["href"] }
	// 	};

	// 	setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf))
	// }, [])


  // using contentEditable so that the cell can resize based on content
  return (
    <div className={'sp-input-sizer ' +  (clickedIn ? "active" : "")}>
      <div id={"cell-curr"}
        tabIndex = {0}
        contentEditable = 'true'
        className="form-control border-0 rounded-0 sp-expandable-input"
        onClick={() => setClickedIn(true)}
        onBlur={(e) => update((e.currentTarget.textContent != null) ? e.currentTarget.textContent : "")}
        dangerouslySetInnerHTML={{__html:  (clickedIn ? data : displayData)}}></div>
    </div>
  )
}