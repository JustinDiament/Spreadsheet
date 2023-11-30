/**
 * @file findReplaceMenu.tsx
 */

import { useState, useEffect } from "react";
import { ISpreadSheetState } from "../interfaces/controller-interface";
import { useSpreadsheetController } from "../models/spreadsheet-controller";
import React from "react";

/**
 * ==============================================================
 *                     React component
 * ==============================================================
 */

// an interface to define the FindReplaceMenuProps type for the FindReplaceMenu component
interface FindReplaceMenuProps {
  disp: boolean; // is the find and replace menu displayed?
}

// a react component for a find and replace side panel
function FindReplaceMenu({ disp }: FindReplaceMenuProps) {
  // the value to find
  const [find, setFind] = useState<string>("");

  // the value to replace
  const [replace, setReplace] = useState<string>("");

  // a constant to contain the function findCellsContaining in the ISpreadSheetState
  const findCellsContaining = useSpreadsheetController(
    (controller: ISpreadSheetState) => controller.findCellsContaining);

  // a constant to contain the function findNextContaining in the ISpreadSheetState
  const findNextContaining = useSpreadsheetController(
    (controller: ISpreadSheetState) => controller.findNextContaining);

  // a constant to contain the function findAndReplaceAll in the ISpreadSheetState
  const findAndReplaceAll = useSpreadsheetController(
    (controller: ISpreadSheetState) => controller.findAndReplaceAll);

  // a constant to contain the function replaceCurrentCell in the ISpreadSheetState
  const replaceCurrentCell = useSpreadsheetController(
    (controller: ISpreadSheetState) => controller.replaceCurrentCell);

  // if the value of find is changed, let the spreadsheet know
  // it needs to update the list of cells that contain the provided value
  useEffect(() => {
    findCellsContaining(find);
  }, [find, findCellsContaining]);

  // If the value of disp is changed to false, meaning the panel has closed,
  // reset the find and replace values and their input fields back to empty
  useEffect(() => {
    if (!disp) {
      setFind("");
      setReplace("");
      (document.getElementById("find") as HTMLInputElement).value = find;
      (document.getElementById("replace") as HTMLInputElement).value = replace;
    }
  }, [disp, find, replace]);

  // return the HTML to render the find and replace menu
  return (
    <div
      className="mx-4 flex-wrap sp-panel-interior" style={disp ? { display: "flex" } : { display: "none" }}>
      <h3 className="w-100">Find and Replace</h3>

      <div className="sp-panel-int-body">
        <div>
          <hr className={"w-100"}></hr>

          <h6 className="w-100">Find</h6>
          {/* enter the value to find */}
          <input id="find" onChange={(e) => e.currentTarget.textContent != null && setFind(
                    (document.getElementById("find") as HTMLInputElement).value)}
            className="w-100 mb-3 form-control"></input>

          <h6 className="w-100">Replace With</h6>
          {/* enter the value to replace it with */}
          <input id="replace" onChange={(e) => e.currentTarget.textContent != null && setReplace(
                    (document.getElementById("replace") as HTMLInputElement).value)}
            className="w-100 form-control"></input>

          {/* find next cell containing value */}
          <button className="w-100 my-2 border-0 btn btn-light" onClick={() => findNextContaining(find)}>Find Next</button>

          {/* replace value of current cell */}
          <button className="w-100 my-2 border-0 btn btn-light" onClick={() => replaceCurrentCell(find, replace)}>Replace</button>

          {/* replace value of all cells */}
          <button className="w-100 my-2 border-0 btn btn-light" onClick={() => findAndReplaceAll(find, replace)}>Replace All</button>
        </div>
      </div>
    </div>
  );
}
// memoize to avoid unnecessary rerenders
export default React.memo(FindReplaceMenu);
