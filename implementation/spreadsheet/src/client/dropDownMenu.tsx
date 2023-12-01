/**
 * @file dropDownMenu.tsx
 */

import React from "react";

/**
 * ==============================================================
 *                     React component
 * ==============================================================
 */

// an interface to define the DropDownMenuProps type for the DropDownMenu component
interface DropDownMenuProps {
  disp:boolean; // is this dropdownmenu displayed?
  menuItems:Array<string>; // the menu items in this dropdown menu
  functions:((index:number) => void); // the functions corresponding to the menu items
}

// a react component for a dropdown menu display
 function DropDownMenu({ disp, menuItems, functions } : DropDownMenuProps) {
    // the actual HTML of the dropdown menu
    return (
        // display iff the passed-in value of disp is true, otherwise it is hidden
        <div className="sp-dropdown p-0"style={disp ? {display:"block"} : {display:"none"}}>
            <ul className="m-0 pt-3 pb-3 p-0">
                {/* map through provided list of dropdown items */}
                {menuItems.map((item, index) => (<li className="sp-submenu-option" id={item} onClick={() => functions(index)} key={index}>{item}</li>))}
            </ul>
        </div>
    )
};
// memoize to avoid unnecessary rerenders
export default React.memo(DropDownMenu);