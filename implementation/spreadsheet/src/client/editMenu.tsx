import { IController } from "../interfaces/controller-interface";
import { useEffect, useState } from "react";

export default function EditMenu({ disp, menuItems, functions } : {disp : boolean, menuItems:Array<string>, functions: Function}) {


    //const disp : boolean = dropdown;

  

    



    
    

    return (
        <div id = "edit-menu" className="sp-dropdown p-0"style={disp ? {display:"block"} : {display:"none"}}>
            <ul className="m-0 pt-3 pb-3 p-0">
                {menuItems.map((item, index) => (<li className="sp-submenu-option" onClick={() => functions(index)}>{item}</li>))}
                {/* {menuItems.map((item, index) => (<li className="sp-submenu-option" onClick={() => console.log("test")}>{item}</li>))} */}
            </ul>

        </div>
    )
}