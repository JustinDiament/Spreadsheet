/**
 * @file cellDisplay.tsx
 */

import { useEffect, useState } from "react";
import { useSpreadsheetController } from "../models/spreadsheet-controller";
import React from "react";
import { ICellStyle } from "../interfaces/cell-style-interface";
import { ICell } from "../interfaces/cell-interface";
import { Util } from "../models/util";

/**
 * ==============================================================
 *                     React component
 * ==============================================================
 */

// an interface to define the CellDisplayProps type for the CellDisplay component
interface CellDisplayProps {
  cell: ICell; // the cell being displayed
  index: string; // the string location of the cell (ex. A1)
  setSelected: (x: number, y: number) => void; // the function to call on click to select a cel
  enabled: boolean; // is the cell allowed to be clicked?
  getClickedIn: boolean; // is the cell currently clicked in/focused
  setClickedIn: (cell: ICell | null) => void; // the function to update which cell is clicked in/focused
  currentSelected: ICell[] | null;
}

// React component for rendering an editable cell
function CellDisplay({cell, index, setSelected, enabled, getClickedIn, setClickedIn, currentSelected}: CellDisplayProps) {

  let isSelected:boolean = !currentSelected===null;

  // set whether the cell is currently "clicked in" / being edited
  const [clickedIn, setLocalClickedIn]: Array<any> = useState<boolean>(getClickedIn);

  // set the 'entered data' of the cell - the data displayed when the cell is clicked in
  const [data, setData]: Array<any> = useState<string>(cell.getEnteredValue());

  // set the 'display data' of the cell - the data displayed when the cell is not clicked in
  const [displayData, setDisplayData]: Array<any> = useState<string>(cell.getDisplayValue()
  );

  // set the style of the cell - the state of whether it is bold, italic, and/or underlined and the color of its text
  let loc:number[] = Util.getIndicesFromLocation(index);
  const [style, setStyle]: Array<any> = useState<ICellStyle>(useSpreadsheetController((controller) => controller.cells[loc[1]][loc[0]].getStyle()));

  // a function to edit a cell's entered data
  const setValue: (cellID: string, newValue: any) => void =
    useSpreadsheetController((controller) => controller.editCell);

  // The HTML style attributes to apply to this cell
  const myComponentStyle = {
    color: style.getTextColor(),
    fontWeight: style.isCellBold() ? "bold" : "normal",
    fontStyle: style.isCellItalic() ? "italic" : "normal",
    textDecorationLine: style.isCellUnderlined() ? "underline" : "none",
  };

  // rerender the cell and update its data/display data if the data it contains, shows, or refers to has changed
  // as well as if the currently selected cells changes
  useEffect(() => {
    setData(cell.getEnteredValue());
    setDisplayData(cell.getDisplayValue());
    setStyle(cell.getStyle());
  }, [cell, enabled, isSelected, style]);

  // when the cell is clicked on, set it as either selected in the range
  // or selected as the single active cell
  useEffect(() => {
    if (clickedIn) {
      // if we have already told the grid this cell is focused, it means we need to change
      // what cells are selected, because it means that setSelected was the value that changed
      if (clickedIn !== getClickedIn) {
        // update the cell clicked in and update which cells are selected
        setClickedIn(cell);
        setSelected(cell.getColumn(), cell.getRow());
        // make sure this cell maintains focus
        document
          .getElementById(
            "editable-cell-" + cell.getColumn() + ":" + cell.getRow()
          )
          ?.focus();
      } else {
        // update the cell clicked in and update which cells are selected
        setClickedIn(cell);
        // make sure this cell maintains focus
        document
          .getElementById(
            "editable-cell-" + cell.getColumn() + ":" + cell.getRow()
          )
          ?.focus();
      }
    }
    // run this any time the state of whether the cell is clicked in changes
  }, [cell, clickedIn, getClickedIn, setClickedIn, setSelected]);

  // update the content and state of the cell based on the passed in data
  function update(newData: string): void {
    setValue(index, newData);
    setData(cell.getEnteredValue());
    setDisplayData(cell.getDisplayValue());
    setLocalClickedIn(false);
    setClickedIn(null);
  }

  // the actual HTML of the cell
  return (
    <div className={"sp-input-sizer " + (clickedIn ? "active" : "")}>
      {/* using contentEditable so that the cell can resize based on content and dangerousltSetInnerHTML so that
           the actual content of the cell displays, not only the manually entered value */}
      <div
        id={"editable-cell-" + cell.getColumn() + ":" + cell.getRow()}
        tabIndex={0}
        contentEditable={!enabled ? "true" : "false"}
        className={"border-0 rounded-0 sp-expandable-input " + (!enabled ? "form-control " : "p-2 ")}
        // if the find and replace is not on, set this cell as clicked in
        onClick={() => {
          !enabled && setLocalClickedIn(cell);
        }}
        style={myComponentStyle}
        // update cell value when user clicks away
        onBlur={(e) =>
          update(
            e.currentTarget.textContent != null
              ? e.currentTarget.textContent
              : ""
          )
        }
        // make sure the cell displays the entered value when it is clicked in,
        // and the display value when it is not
        dangerouslySetInnerHTML={{
          __html: clickedIn || (enabled && isSelected) ? data : displayData,
        }}
      ></div>
    </div>
  );
}
// memoize to avoid unnecessary rerenders
export default React.memo(CellDisplay);