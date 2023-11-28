import CellGridDisplay from "./cellGridDisplay";
import { ISpreadSheetState } from "../interfaces/controller-interface";
import { useSpreadsheetController } from "../models/spreadsheet-controller";
import { useState } from "react";
import DropDownMenu from "./dropDownMenu";
import CreateChartMenu from "./createChartMenu";
import DataValidationMenu from "./dataValidationMenu";
import FindReplaceMenu from "./findReplaceMenu";
import { IoClose } from "react-icons/io5";
import HelpMenu from "./helpMenu";
import ColorPickerComp from "./colorPicker";
import TextStyleMenu from "./textStyleMenu";

// the list of options in the edit menu
const editMenuItems: Array<string> = ["Delete Row(s)", "Insert Row Above", "Insert Row Below", "Delete Column(s)",
    "Insert Column Right", "Insert Column Left", "Clear Selected Cells", "Clear All Cells"];

// the list of options in the data menu
const dataMenuItems: Array<string> = ["Data Validation", "Create Chart", "Find and Replace"];


// the react component for the entire spreadsheet frontend display
export default function SpreadSheetDisplay() {

  // is there an opened dropdown menu?
  const [dropdown, setDropdown] = useState(false);
 
  // what is the currently opened dropdown menu?
  const [currDrop, setCurrDrop] = useState<string>("");

  // is there an opened side panel?
  const [sidePanel, setSidePanel] = useState<boolean>(false);

  // is the help pop-up open?
  const [helpOpen, setHelpOpen] = useState<boolean>(false);

  // what is the currently opened side panel?
  const [currPanel, setCurrPanel] = useState<string>("");

  // is the find and replace menu open?
  const findReplaceOpen:boolean = (sidePanel && currPanel==="find and replace");
  const findReplaceOpenF:(() => boolean) = () => (panelDisplayState("find and replace"));

  // close any opened dropdowns because the user clicked outside of the active dropdown area
  function clickOutside(e: any) {
    const currentTarget = e.currentTarget;
    // Give browser time to focus the next element
    requestAnimationFrame(() => {
      // Check if the new focused element is a child of the original container
      if (!currentTarget.contains(document.activeElement)) {
        setDropdown(false);
      }
    });
  };

  // return true if the dropdown menu of the provided title is opened/expanded 
  function dropDisplayState(option: string): boolean {
    return (option === currDrop) && dropdown;
  };

  // return true if the sidepanel of the provided title is opened
  function panelDisplayState(option: string): boolean {
    return (option === currPanel) && sidePanel;
  };

  // the list of functions associated with the options in the edit menu
  const menuFunctions: Array<{ (): void; } | { (val:string): void; }> = [
    useSpreadsheetController((controller : ISpreadSheetState) => controller.deleteRow),
    useSpreadsheetController((controller : ISpreadSheetState) => controller.addRow),
    useSpreadsheetController((controller : ISpreadSheetState) => controller.addRow),
    useSpreadsheetController((controller : ISpreadSheetState) => controller.deleteColumn),
    useSpreadsheetController((controller : ISpreadSheetState) => controller.addColumn),
    useSpreadsheetController((controller : ISpreadSheetState) => controller.addColumn),
    useSpreadsheetController((controller : ISpreadSheetState) => controller.clearSelectedCells),
    useSpreadsheetController((controller : ISpreadSheetState) => controller.clearAllCells)];

  // calls the function associated with the command in the edit menu at the provided index
  const editFunctions= (index: number) : void => {
    let params:Array<string> = ['', "above", "below", '', "right", "left", '', ''];
    menuFunctions[index]((params[index]));
    // close the dropdown because we have performed the selected task
    setDropdown(false);

  };

  // calls the function associated with the command in the data menu at the provided index
  function dataFunctions(index: number) {
    let dataFunctions: Array<{ (): void; }> = [() => setCurrPanel("data validation"),
    () => setCurrPanel("create chart"),
    () => setCurrPanel("find and replace")]
    dataFunctions[index]();
    // close the dropdown because we have performed the selected task
    setDropdown(false);
    // let the component know that a side panel was opened
    setSidePanel(true);
  };

  // the actual HTML of the spreadsheet UI
  return (
    <div>
      <div className="position-fixed top-50 start-50 translate-middle" style={helpOpen ? {display:"flex"} : {display:"none"}}><div className={"sp-panel-close float-end"} onClick={() => setHelpOpen(false)}><IoClose /></div><HelpMenu disp={helpOpen} menuOpen={setHelpOpen} /></div>

      {/* the top bar with the menu items */}
      <div className="d-flex flex-nowrap sp-menu-bar w-100 align-items-center">
        {/* edit menu */}
        <div tabIndex={100} className="sp-edit-menu float-left" onBlur={(e) => { clickOutside(e) }}>
          <button className={"sp-menu-button " + (dropDisplayState("edit") ? "selected" : '')}
            type="button" aria-haspopup="menu" aria-expanded={dropdown ? "true" : "false"}
            onClick={() => { setDropdown((prev) => !prev); setCurrDrop("edit") }}
            onMouseEnter={() => { setCurrDrop("edit") }}>Edit</button>

          {/* edit menu dropdown */}
          <div><DropDownMenu disp={dropDisplayState("edit")} menuItems={editMenuItems} functions={editFunctions} /></div>
        </div>

        {/* data menu */}
        <div tabIndex={99} className="sp-edit-menu float-left" onBlur={(e) => { clickOutside(e) }}>
          <button className={"sp-menu-button " + (dropDisplayState("data") ? "selected" : '')}
            type="button" aria-haspopup="menu" aria-expanded={dropdown ? "true" : "false"}
            onClick={() => { setDropdown((prev) => !prev); setCurrDrop("data") }}
            onMouseEnter={() => { setCurrDrop("data") }}>Data</button>

          {/* data menu dropdown */}
          <div><DropDownMenu disp={dropDisplayState("data")} menuItems={dataMenuItems} functions={dataFunctions} /></div>
        </div>

        {/* help menu */}
        <div tabIndex={98} className="sp-edit-menu float-left flex-fill" onBlur={(e) => { clickOutside(e) }}>
          <button className={"sp-menu-button "} type="button" aria-haspopup="menu" aria-expanded={dropdown ? "true" : "false"}
            onClick={() => { setDropdown((prev) => !prev); setCurrDrop("help"); setHelpOpen(true)}}
            onMouseEnter={() => { setCurrDrop("help") }}>Help</button>
        </div>

        {/* text styling buttons */}
        <div className="sp-edit-menu float-end me-3 bg-light rounded p-1 mt-2"><TextStyleMenu /></div>
      </div>

      <div className={(sidePanel ? 'sp-two-panel' : '') + ' sp-work-space'}>
        {/* actual grid of cells */}
        <CellGridDisplay  findReplaceOpen={findReplaceOpenF}/>

        <div className={"sp-side-panel"} style={sidePanel ? { display: "block" } : { display: "none" }}>
          <div className={"sp-panel-close float-right"} onClick={() => setSidePanel(false)}><IoClose /></div>
          <DataValidationMenu disp={panelDisplayState("data validation")}/>
          <CreateChartMenu disp={panelDisplayState("create chart")} />
          <FindReplaceMenu disp={panelDisplayState("find and replace")}  />
        </div>
      </div>
    </div>
  )
}