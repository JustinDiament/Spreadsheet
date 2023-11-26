import { useEffect, useState } from "react";
import { Cell } from "../models/cell";
import { ISpreadSheetState } from "../interfaces/controller-interface";
import { useSpreadsheetController } from "../models/spreadsheet-controller";

// React component for rendering an editable cell
export default function CellDisplay({cell, setSelected, setValue}: {cell: Cell; setSelected: Function; setValue: Function}) {
  // set whether the cell is currently "clicked in" / being edited
  const [clickedIn, setClickedIn] = useState(false);

  // set the 'entered data' of the cell - the data displayed when the cell is clicked in
  const [data, setData]: Array<any> = useState(cell.getEnteredValue());

  // set the 'display data' of the cell - the data displayed when the cell is not clicked in
  const [displayData, setDisplayData]: Array<any> = useState(
    cell.getDisplayValue()
  );

  // storing the current state of the cells in the spreadsheet
  const grid = useSpreadsheetController((controller : ISpreadSheetState) => controller.cells);

  // sotring the current state of the selected cells in the spreadsheet
  const selected = useSpreadsheetController((controller : ISpreadSheetState) => controller.currentlySelected);

 
  // rerender the cell and update its data/display data if the data it contains, shows, or refers to has changed
  // as well as if the currently selected cells changes
  useEffect(() => {
    setData(cell.getEnteredValue());
    cell.updateDisplayValue(grid);
    setDisplayData(cell.getDisplayValue());
  }, [cell, data, displayData, grid, selected]);

  // when the cell is clicked on, set it as either selected in the range
  // or selected as the single active cell
  useEffect(() => {
    if (clickedIn) {
      setSelected();
    }
  }, [clickedIn, setSelected]);

  // update the content of the cell based on the passed in data
  function update(newData: string): void {
    setValue(newData);
    setData(cell.getEnteredValue());
    setDisplayData(cell.getDisplayValue());
    setClickedIn(false);
  }

  // the actual HTML of the cell
  return (
    <div className={"sp-input-sizer " + (clickedIn ? "active" : "")}>
      {/* using contentEditable so that the cell can resize based on content and dangerousltSetInnerHTML so that
           the actual content of the cell displays, not only the manually entered value */}
      <div
        tabIndex={0}
        contentEditable="true"
        className="form-control border-0 rounded-0 sp-expandable-input"
        onClick={() => setClickedIn(true)}
        onBlur={(e) =>
          update(
            e.currentTarget.textContent != null
              ? e.currentTarget.textContent
              : ""
          )
        }
        dangerouslySetInnerHTML={{ __html: clickedIn ? data : displayData }}
      ></div>
    </div>
  );
}
