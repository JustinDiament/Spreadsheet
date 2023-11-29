/**
 * @file colorPicker.tsx
 */

import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useSpreadsheetController } from "../models/spreadsheet-controller";
import { useEffect } from "react";
import React from "react";

/**
 * ==============================================================
 *                     React component
 * ==============================================================
 */

// an interface to define the ColorPickerCompProps type for the ColorPickerComp component
interface ColorPickerCompProps {
  disp: boolean; // is this component visible?
}

// The react component for the color picker menu
function ColorPickerComp({ disp }: ColorPickerCompProps) {
  // set the active color
  const [color, setColor] = useColor("#000000");

  // set the currently selected cells to be the currently active color
  const setTextColor = useSpreadsheetController((controller) => controller.setTextColor);

  // update the color of the currently selected cells when the currently active color changes
  useEffect(() => {
    setTextColor(color.hex);
  }, [color, setColor, setTextColor]);

  // the actual HTML of the color picker
  return (
    <div>
      <div className={"sp-color-picker position-fixed " + (disp ? "d-flex" : "d-none")}>
        {/* this is the imported external color picker library */}
        <ColorPicker
          height={74}
          hideAlpha={true}
          color={color}
          onChange={setColor}
          hideInput={["rgb", "hsv"]}/>
      </div>
    </div>
  );
}
// memoize component to prevent unnecessary rerendering
export default React.memo(ColorPickerComp);