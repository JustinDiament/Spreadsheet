import { useEffect, useState } from "react";
// import { Cell } from "../models/cell";
import { useSpreadsheetController } from "../models/spreadsheet-controller";
import React from "react";
import { ISpreadSheetState } from "../interfaces/controller-interface";
import { ICellStyle } from "../interfaces/cell-style-interface";
import { ICell } from "../interfaces/cell-interface";

// an interface to define the CellDisplayProps type for the CellDisplay component
interface CellDisplayProps {
  cell: ICell;
  index: string;
  setSelected: (x:number, y:number) => void;
  isSelected: boolean;
  enabled: boolean
}

// React component for rendering an editable cell

function CellDisplay({cell, index, setSelected, isSelected, enabled}: CellDisplayProps) {

  // set whether the cell is currently "clicked in" / being edited
  const [clickedIn, setClickedIn]: Array<any> = useState<boolean>(false);

  // set the 'entered data' of the cell - the data displayed when the cell is clicked in
  const [data, setData]: Array<any> = useState<string>(cell.getEnteredValue());

  // set the 'display data' of the cell - the data displayed when the cell is not clicked in
  const [displayData, setDisplayData]: Array<any> = useState<string>(cell.getDisplayValue());

  const [style, setStyle]: Array<any> = useState<ICellStyle>(cell.getStyle())

  // a function to edit a cell's entered data
  const setValue:(cellID:string, newValue:any) => void = useSpreadsheetController((controller) => controller.editCell);

  const grid:ICell[][] = useSpreadsheetController((controller) => controller.cells);




  // storing the current state of the selected cells in the spreadsheet
  const currentlySelected = useSpreadsheetController((controller : ISpreadSheetState) => controller.currentlySelected);
  const [isSelected2, setIsSelected] = useState<boolean>(currentlySelected.includes(cell));
 
  // rerender the cell and update its data/display data if the data it contains, shows, or refers to has changed
  // as well as if the currently selected cells changes
  useEffect(() => {
    setData(cell.getEnteredValue());
    // check to see if the value of any of its cell dependencies have changed
    // cell.updateDisplayValue(grid);
    setDisplayData(cell.getDisplayValue()); 
    setIsSelected(currentlySelected.includes(cell)); 
    setStyle(cell.getStyle());
  }, [cell, currentlySelected, enabled, isSelected, style, grid]);

  // when the cell is clicked on, set it as either selected in the range
  // or selected as the single active cell
  useEffect(() => {
    if (clickedIn) {
      setSelected(cell.getColumn(), cell.getRow());
    }
  }, [clickedIn, setSelected, cell]);

  // useEffect(() => {
  //   setStyle(cell.getStyle())
  // }, [cell.getStyle(), cell, style]);

  // update the content of the cell based on the passed in data
  function update(newData: string): void {
    setValue(index, newData);
    setData(cell.getEnteredValue());
    setDisplayData(cell.getDisplayValue());
    setClickedIn(false);
  };



  const myComponentStyle = {
   color: style.getTextColor(),
   fontWeight: (style.isCellBold() ? 'bold' : 'normal'),
   fontStyle: (style.isCellItalic() ? 'italic' : 'normal'),
   textDecorationLine: (style.isCellUnderlined() ? 'underline' : 'none')
}

  // the actual HTML of the cell
  return (
    <div className={"sp-input-sizer " + (clickedIn ? "active" : "")}>
      {/* using contentEditable so that the cell can resize based on content and dangerousltSetInnerHTML so that
           the actual content of the cell displays, not only the manually entered value */}
      <div
        tabIndex={0}
        contentEditable={(!enabled ? "true" : "false")}
        className={'border-0 rounded-0 sp-expandable-input ' + (!enabled ? 'form-control ': 'p-2 ')}
        onClick={() => !enabled && setClickedIn(true)}
        style={myComponentStyle}
        // update cell value when user clicks away
        onBlur={(e) =>
          update(
            e.currentTarget.textContent != null
              ? e.currentTarget.textContent
              : ""
          )
        }
        dangerouslySetInnerHTML={{ __html: ((clickedIn || (enabled && isSelected)) ? data : displayData) }}
      ></div>
    </div>
  );
};
// memoize to avoid unnecessary rerenders
export default React.memo(CellDisplay);
