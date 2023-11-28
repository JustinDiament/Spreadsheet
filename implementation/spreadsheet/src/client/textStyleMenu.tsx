import "react-color-palette/css";
import ColorPickerComp from "./colorPicker";
import { useState } from "react";
import { AiOutlineFontColors, AiOutlineUnderline, AiOutlineItalic   } from 
"react-icons/ai";
import { BiBold } from "react-icons/bi";
import { useSpreadsheetController } from "../models/spreadsheet-controller";
import { ICellStyle } from "../interfaces/cell-style-interface";

export default function TextStyleMenu() {
  const [pickerDisp, setPickerDisp] = useState<boolean>(false);

  const setStyle = useSpreadsheetController((controller) => controller.setStyle);



  return (
    <div>
        <button title={"Bold"} className={'btn btn-light btn-sm sp-style-button'} 
        // onClick={() => setBold() }
        onClick={() => setStyle((style:ICellStyle) => style.isCellBold(), (style:ICellStyle, value:boolean) => style.setBold(value)) }
        ><BiBold /></button>

        <button title={"Italic"} className={'btn btn-light btn-sm sp-style-button'} 
        onClick={() => setStyle((style:ICellStyle) => style.isCellItalic(), (style:ICellStyle, value:boolean) => style.setItalic(value)) }><AiOutlineItalic    /></button>

        <button title={"Underline"} className={'btn btn-light btn-sm sp-style-button'} 
        onClick={() => setStyle((style:ICellStyle) => style.isCellUnderlined(), (style:ICellStyle, value:boolean) => style.setUnderline(value)) }><AiOutlineUnderline   />
</button>

        <button title={"Font Color"} className={'btn btn-light btn-sm sp-style-button'} onClick={() => setPickerDisp(!pickerDisp)}><AiOutlineFontColors  />
        </button>
     <ColorPickerComp disp={pickerDisp} setDisp={setPickerDisp}/>
     </div>
  );
}