import { useState, useEffect } from "react";
import { IController } from "../interfaces/controller-interface";
export default function FindReplaceMenu({ disp, spreadsheetController } : {disp: boolean, spreadsheetController:IController}) {
    //
    const [find, setFind] = useState("");
    const [replace, setReplace] = useState("");

    // if the value of find is changed, let the spreadsheet know
    // it needs to update the list of cells that contain the provided value
    useEffect(() => {
        spreadsheetController.findCellsContaining(find);
    }, [find]);
    
    return (
        <div className="mx-4 flex-wrap sp-panel-interior"style={disp ? {display:"flex"} : {display:"none"}}>
            <h3 className="w-100">Find and Replace</h3>
            
            <div className="sp-panel-int-body">
                <div>
                    <hr className = {"w-100"}></hr>
                    <h6 className="w-100">Find</h6>
                    <input onChange={(e) => setFind((e.currentTarget.textContent != null) ? e.currentTarget.textContent : "")}className="w-100 mb-3"></input>
                    <h6 className="w-100">Replace With</h6>
                    <input onChange={(e) => setReplace((e.currentTarget.textContent != null) ? e.currentTarget.textContent : "")} className="w-100"></input>
                    <button className="w-100 my-2 border-0" onClick={() => spreadsheetController.findNextContaining()}>find next</button>
                    <button className="w-100 my-2 border-0" onClick={() => spreadsheetController.replaceCurrentCell(find, replace)}>replace</button>
                    <button className="w-100 my-2 border-0" onClick={() => spreadsheetController.findAndReplaceAll(find, replace)}>replace all</button>
                </div>
            </div>
        </div>
    ) 
}