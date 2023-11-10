import { IController } from "../interfaces/controller-interface";
import { useEffect, useState } from "react";

export default function EditMenu({ disp } : {disp : boolean}) {

    //const disp : boolean = dropdown;

    


const menuFunctions: Array<{ (): void; }> = [];

    const menuItems : Array<String> = ["Delete Row(s)", "Insert Row Above", "Insert Row Below", "Delete Column(s)", 
                                        "Insert Column Right", "Insert Column Left", "Clear Selected Cells", "Clear All Cells"];
    

    return (
        <div id = "edit-menu" className="sp-dropdown p-1"style={disp ? {display:"block"} : {display:"none"}}>
            <ul className="m-0 p-2">
                {menuItems.map((item, index) => (<li className="sp-submenu-option" onClick={() => menuFunctions[index]()}>{item}</li>))}
            </ul>

        </div>
    )
}