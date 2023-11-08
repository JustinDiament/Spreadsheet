import { IController } from "../interfaces/controller-interface";
import { useEffect, useState } from "react";

export default function editMenu({  }) {

    


const menuFunctions: Array<{ (): void; }> = [];

    const menuItems : Array<String> = ["Delete Row(s)", "Insert Row Above", "Insert Row Below", "Delete Column(s)", 
                                        "Insert Column Right", "Insert Column Left", "Clear Selected Cells", "Clear All Cells"];
    

    return (
        <div>
            <ul>
                {menuItems.map((item, index) => (<li onClick={() => menuFunctions[index]()}>{item}</li>))}
            </ul>

        </div>
    )
}