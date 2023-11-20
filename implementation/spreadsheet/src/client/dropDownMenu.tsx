// a react component for a dropdown menu display
export default function DropDownMenu({ disp, menuItems, functions } : {disp : boolean, menuItems:Array<string>, functions: Function}) {
    // the actual HTML of the dropdown menu
    return (
        // display iff the passed-in value of disp is true, otherwise it is hidden
        <div className="sp-dropdown p-0"style={disp ? {display:"block"} : {display:"none"}}>
            <ul className="m-0 pt-3 pb-3 p-0">
                {/* map through provided list of dropdown items */}
                {menuItems.map((item, index) => (<li className="sp-submenu-option" onClick={() => functions(index)}>{item}</li>))}
            </ul>
        </div>
    )
}