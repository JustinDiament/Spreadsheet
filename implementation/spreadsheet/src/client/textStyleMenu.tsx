/**
 * @file textStyleMenu.tsx
 */

import "react-color-palette/css";
import ColorPickerComp from "./colorPicker";
import { useState } from "react";
import { AiOutlineFontColors, AiOutlineUnderline, AiOutlineItalic   } from 
"react-icons/ai";
import { BiBold } from "react-icons/bi";
import { useSpreadsheetController } from "../models/spreadsheet-controller";
import { ICellStyle } from "../interfaces/cell-style-interface";
import React from "react";

/**
 * ==============================================================
 *                     React component
 * ==============================================================
 */


// A react component for a text styles menu
function TextStyleMenu() {
  // set whether the color picker is visible
  const [pickerDisp, setPickerDisp] = useState<boolean>(false);

  // set the style of the selected cells
  const setStyle = useSpreadsheetController((controller) => controller.setStyle);

  // the actual HTML of the dropdown menu
  return (
    <div>
        {/* the button to bold the cells */}
        <button title={"Bold"} className={'btn btn-light btn-sm sp-style-button'} 
        onClick={() => setStyle((style:ICellStyle) => style.isCellBold(), (style:ICellStyle, value:boolean) => style.setBold(value)) }
        ><BiBold /></button>

        {/* the button to italicize the cells */}
        <button title={"Italic"} className={'btn btn-light btn-sm sp-style-button'} 
        onClick={() => setStyle((style:ICellStyle) => style.isCellItalic(), (style:ICellStyle, value:boolean) => style.setItalic(value)) }><AiOutlineItalic /></button>

        {/* the button to underline the cells */}
        <button title={"Underline"} className={'btn btn-light btn-sm sp-style-button'} 
        onClick={() => setStyle((style:ICellStyle) => style.isCellUnderlined(), (style:ICellStyle, value:boolean) => style.setUnderline(value)) }><AiOutlineUnderline /></button>

        {/* the button to open the color picker */}
        <button title={"Font Color"} className={'btn btn-light btn-sm sp-style-button'} onClick={() => setPickerDisp(!pickerDisp)}><AiOutlineFontColors /></button>

        {/* the color picker component */}
        <ColorPickerComp disp={pickerDisp}/>
     </div>
  );
}
// memoize to avoid unnecessary rerenders
export default React.memo(TextStyleMenu)