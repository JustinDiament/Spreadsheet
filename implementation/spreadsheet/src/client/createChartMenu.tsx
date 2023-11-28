import React from "react";

// an interface to define the CreateChartMenuProps type for the CreateChartMenu component
interface CreateChartMenuProps {
  disp:boolean;
}

 function CreateChartMenu({ disp } : CreateChartMenuProps) {
   
    return (
        <div className="mx-4 flex-wrap sp-panel-interior"style={disp ? {display:"flex"} : {display:"none"}}>
            <h3>Edit Chart</h3>
            <hr className = {"w-100"}></hr>
        </div>
    ) 
};
// memoize to avoid unnecessary rerenders
export default React.memo(CreateChartMenu);