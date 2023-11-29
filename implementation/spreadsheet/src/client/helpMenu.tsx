/**
 * @file helpMenu.tsx
 */

import React from "react";

/**
 * ==============================================================
 *                     React component
 * ==============================================================
 */


// A react component for a help menu that describes how to use the spreadsheet
// Its value is hard-coded because there is no need to perform calculations
// The instructions are static
function HelpMenu() {
  return (
    <div className="d-flex flex-wrap overflow-y-auto sp-help-interior w-100 m-0 p-0">
      <div className="sp-help-section">
        <h4>Editing Cell Content</h4>
        <ul>
          <li>Click on a cell to edit it</li>

          <li>
            Click on a cell, Hold shift, then click on another cell to select
            all cells in that range
            <ul>
              <li>
                If no cell is selected to start, the first cell you click on
                after pressing shift will be the first cell in the range
              </li>

              <li>
                While holding shift, anytime you click on a cell it will set
                that cell as the last one of the range, but will keep the first
                cell the same
              </li>
            </ul>
          </li>

          <li>
            To reference the value of another cell, type REF(##), where the ##
            is the column and row of the cell being referenced (i.e. REF(A1) or
            REF(BB7))
          </li>

          <li>
            To do arithmetic in a cell, simply write the expression you want to
            evaluate
            <ul>
              <li>
                Ex. 1+2*3^2 will display 19, but the entered value will stay the
                same and be editable
              </li>
            </ul>
          </li>

          <li>
            To concatenate two strings, type string+string (i.e. good+bye will
            display goodbye)
            <ul>
              <li>
                Placing spaces around the plus sign will put spaces in the
                displayed result
              </li>
              <li>The entered value will stay the same and be editable</li>
            </ul>
          </li>

          <li>
            To calculate the sum or average of a range of cells, type
            SUM(##..##) or AVERAGE(##..##) where the ## is the column and row of
            the cell being referenced
          </li>
        </ul>
      </div>

      <div className="sp-help-section">
        <h4>Edit and Data Menus</h4>
        <ul>
          <li>
            To find all cells with a given value entered in them (not displayed)
            and/or replace that value, click on{" "}
            <span className="fw-bolder">Data {">"} Find and Replace</span>
          </li>

          <li>
            To create or edit a custom data validation rule on all selected
            cells, go to{" "}
            <span className="fw-bolder">Data {">"} Data Validation</span>
            <ul>
              <li>
                You will be allowed to create contradicting rules, however
                entering any value in a cell with contradicting rules will show
                an error
              </li>
            </ul>
          </li>

          <li>To add and delete rows and columns, navigate to the Edit menu</li>

          <li>
            To remove data from every cell or from the currently selected cells,
            navigate to the edit menu
          </li>
        </ul>
      </div>

      <div className="sp-help-section">
        <h4>Cell Styling</h4>
        <ul>
          <li>
            To style the text inside a cell, select the cell you want to style
            and click on the styling options you'd like in the top-right corner
          </li>

          <li>
            If you want to style multiple cells at once, just multi-select the
            range you want to style and click on the styling options
          </li>

          <li>
            For the bold, italic, and underline style toggles, if every selected
            cell has the given style value already, it will un-apply the style.
            Otherwise, it will apply the style to all the selected cells,
            regardless of whether they were already set to that style
            <ul>
              <li>
                e.g. If all selected cells are bolded, clicking bold will
                un-bold all the selected cells. If some or none of the selected
                cells are bolded, clicking bold will bold all the selected cells
              </li>
            </ul>
          </li>

          <li>
            For the text color picker, simply drag the picker to the color you
            want or type the hex code you want in the input box. Any invalid
            inputs will reset the color to the default black
          </li>
        </ul>
      </div>
    </div>
  );
}
// memoize to avoid unnecessary rerenders
export default React.memo(HelpMenu);
