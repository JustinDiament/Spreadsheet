import React from "react";
// import { IoClose } from "react-icons/io5";


// an interface to define the HelpMenuProps type for the HelpMenu component
interface HelpMenuProps {
  disp:boolean;
  menuOpen:(open:boolean) => void;
}

 function HelpMenu({ disp, menuOpen } : HelpMenuProps) {
   
    return (
        <div className="d-flex flex-wrap overflow-y-scroll">
            {/* <div className={"sp-panel-close float-right"} onClick={() => menuOpen(false)}><IoClose /></div> */}
            <h3>Help & Documentation</h3>
            <hr className = {"w-100"}></hr>
        </div>
    ) 
};
// memoize to avoid unnecessary rerenders
export default React.memo(HelpMenu);