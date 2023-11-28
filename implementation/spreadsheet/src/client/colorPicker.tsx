// import React from 'react';
// import { SketchPicker } from 'react-color';

// function ColorPicker() {


//     return <SketchPicker />;
  
// }

// export default (ColorPicker);

// import React from 'react'
// import { ChromePicker, SketchPicker } from 'react-color'

// export default function ColorPicker() {
 
//     let displayColorPicker:boolean = false;
 
//     return (
//       <div>
//         <div style={{position:"absolute", zIndex:2}}>
//           <div style={{position: 'fixed',
//       top: '0px',
//       right: '0px',
//       bottom: '0px',
//       left: '0px',} } onClick={ (() => displayColorPicker= false) }/>
//           <SketchPicker color={""} />
//         </div>
//       </div>
//     )
//   }
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";
import { useSpreadsheetController } from "../models/spreadsheet-controller";
import { useEffect } from "react";


export default function ColorPickerComp({disp, setDisp} : {disp:boolean, setDisp:(disp:boolean) => void}) {
  const [color, setColor] = useColor("#000000");

  useEffect(() => {
    setTextColor(color.hex);
  }, [color, setColor]);

const setTextColor = useSpreadsheetController((controller) => controller.setTextColor);

  return (<div onBlur={() => setDisp(false)}>
   
     <div className={"sp-color-picker position-fixed " + (disp ? "d-flex" : "d-none")}><ColorPicker height={74} hideAlpha={true} color={color} onChange={setColor} hideInput={["rgb", "hsv"]}/></div>
  </div>);
}