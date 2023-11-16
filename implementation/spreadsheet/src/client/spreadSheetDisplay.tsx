import CellGridDisplay from "./cellGridDisplay";
import { IController } from "../interfaces/controller-interface";
import { SpreadsheetController } from "../models/spreadsheet-controller";
import { useState, useEffect, useRef } from "react";
import EditMenu from "./editMenu";

const spreadsheetController : IController = new SpreadsheetController();

export default function SpreadSheetDisplay() {

// const [display, setDisplay] = useState(calculatorModel.display());
const [dropdown, setDropdown] = useState(false);
const [currDrop, setCurrDrop] = useState("");
const [ignored, setForcedGridUpdate] = useState(0);

useEffect(() => {

}, [ignored]);


// useEffect(() => {
//     const handler : any = (event) => {
//       if (!container.current.contains(event.target)) {
//         setDropdown(false);
//       }
//     };
//     document.addEventListener("click", handler);
//     return () => {
//       document.removeEventListener("click", handler);
//     };
//   });

function clickOutside(e : any) {
  const currentTarget = e.currentTarget;
  // Give browser time to focus the next element
    requestAnimationFrame(() => {
    // Check if the new focused element is a child of the original container
         if (!currentTarget.contains(document.activeElement)) {
            setDropdown(false);
            }
    });
  }

  function dropDisplayState(option : string) : boolean {
    return (option == currDrop) && dropdown;
  }


  function editFunctions(index:number) {
    let menuFunctions: Array<{ (): void; }> = [() => spreadsheetController.deleteRow(), 
                                             () => spreadsheetController.addRow(1), 
                                             () => spreadsheetController.addRow(-1),
                                             () => spreadsheetController.deleteColumn(),
                                             () => spreadsheetController.addColumn(1),
                                             () => spreadsheetController.addColumn(-1),
                                             () => spreadsheetController.clearSelectedCells(),
                                             () => spreadsheetController.clearAllCells(),];
    menuFunctions[index]();
    setDropdown(false);
    setForcedGridUpdate(ignored+1);
  }
 
  
  return (
    <div>
      <div className = "sp-menu-bar">
        <div tabIndex={100} className="sp-edit-menu float-left" onBlur={(e) => {clickOutside(e)}}>
          <button className={"sp-menu-button " + (dropDisplayState("edit") ? "selected" : '')} type = "button" aria-haspopup="menu" aria-expanded={dropdown ? "true" : "false"}
        onClick={() => {setDropdown((prev) => !prev); setCurrDrop("edit")}} 
        onMouseEnter={() => {setCurrDrop("edit")}}>Edit</button>
     
        <div><EditMenu disp={dropDisplayState("edit")} functions={editFunctions}/></div>
          
        </div>

        <div tabIndex={99} className="sp-edit-menu float-left" onBlur={(e) => {clickOutside(e)}}>
          <button className={"sp-menu-button " + (dropDisplayState("data") ? "selected" : '')} type = "button" aria-haspopup="menu" aria-expanded={dropdown ? "true" : "false"}
        onClick={() => {setDropdown((prev) => !prev); setCurrDrop("data")}} 
        onMouseEnter={() => {setCurrDrop("data")}}>Data</button>
     
        <div><EditMenu disp={dropDisplayState("data")} functions={editFunctions}/></div>
          
        </div>

        <div tabIndex={98} className="sp-edit-menu float-left" onBlur={(e) => {clickOutside(e)}}>
          <button className={"sp-menu-button "} type = "button" aria-haspopup="menu" aria-expanded={dropdown ? "true" : "false"}
        onClick={() => {setDropdown((prev) => !prev); setCurrDrop("help")}} 
        onMouseEnter={() => {setCurrDrop("help")}}>Help</button>
     
          
        </div>
        </div>
        <CellGridDisplay spreadsheetController={spreadsheetController} ignore={ignored}/>
      
    </div>
  )
}