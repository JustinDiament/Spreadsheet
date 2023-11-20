export default function CreateChartMenu({ disp } : {disp: boolean}) {
   
    return (
        <div className="mx-4 flex-wrap sp-panel-interior"style={disp ? {display:"flex"} : {display:"none"}}>
            <h3>Edit Chart</h3>
            <hr className = {"w-100"}></hr>
        </div>
    ) 
}