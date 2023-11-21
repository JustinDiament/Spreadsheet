import { useEffect, useState } from "react";
import { Cell } from "../models/cell";

// React component for rendering an editable cell
export default function CellDisplay({ cell, setSelected, setValue, updateCount } : { cell : Cell, setSelected: Function, setValue: Function, updateCount: Function }) {
  // set whether the cell is currently "clicked in" / being edited
  const [clickedIn, setClickedIn] = useState(false);

  // set the 'entered data' of the cell - the data displayed when the cell is clicked in
  const [data, setData] : Array<any> = useState(cell.getEnteredValue());

  // set the 'display data' of the cell - the data displayed when the cell is not clicked in
  const [displayData, setDisplayData] : Array<any> = useState(cell.getDisplayValue());

  // rerender the cell if the data is contains or shows has changed
  useEffect(() => {
    setData(cell.getEnteredValue());
    setValue(cell.getEnteredValue());

    setDisplayData(cell.getDisplayValue());
  });

  // when the cell is clicked on, set it as either selected in the range 
  // or selected as the single active cell
  useEffect(() => {
    (clickedIn && setSelected());    
  }, [clickedIn]);


  // update the content of the cell based on the passed in data
  function update(newData : string) : void {
    setValue(newData);
    setDisplayData(cell.getDisplayValue());
    console.log(cell.getDisplayValue());
    // console.log("set value to " + cell.getEnteredValue())
    // setData(cell.getEnteredValue());
    // setDisplayData(cell.getDisplayValue());
    
    setClickedIn(false);
    updateCount();
  }

  // the actual HTML of the cell
  return (
    <div className={'sp-input-sizer ' +  (clickedIn ? "active" : "")}>
      {/* using contentEditable so that the cell can resize based on content and dangerousltSetInnerHTML so that
           the actual content of the cell displays, not only the manually entered value */}
      <div
        tabIndex = {0}
        contentEditable = 'true'
        className="form-control border-0 rounded-0 sp-expandable-input"
        onClick={() => setClickedIn(true)}
        onBlur={(e) => update((e.currentTarget.textContent != null) ? e.currentTarget.textContent : "")}
        dangerouslySetInnerHTML={{__html:  (clickedIn ? data : displayData)}}></div>
    </div>
  )
}