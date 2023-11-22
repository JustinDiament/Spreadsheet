import { IController } from "../interfaces/controller-interface";
import { useState, useEffect } from "react";


export default function DataValidationMenu({ disp, spreadsheetController } : {disp: boolean, spreadsheetController:IController}) {
    const [rule, setRule] = useState("");
    const [type, setType] = useState("any");
    const [comp, setComp] = useState("");
    const [options, setOptions] = useState(new Array<string | number>);

    function addOption() {

        let added: number | string = ((type==="num" ? 0 : ''));
        let options2: Array<number | string> = [];
        for(let i:number = 0; i < options.length; i++) {
            options2.push(options[i]);
        }
        options2.push(added);
        setOptions(options2);
    };

    function editOption(index : number, newVal: number|string) {
        let options2: Array<number | string> = [];
        for(let i:number = 0; i < options.length; i++) {
            options2.push((index===i ? newVal : options[i]));
        }

        setOptions(options2);

        
    }

    useEffect(() => {

    }, [options, options.length]);

    useEffect(() => {
        setOptions(new Array<string | number>)
    }, [type])

    return (
        <div className="mx-4 flex-wrap sp-panel-interior"style={disp ? {display:"flex"} : {display:"none"}}>
            <h3 className="w-100">Data Validation Rules</h3>
            
            <div className="sp-panel-int-body w-100">
                <div className="w-100">
                    <hr className = {"w-100"}></hr>
                    <div className={"d-flex flex-wrap w-100"}>
                        <span>Value is</span>
                        <select className="form-select" aria-label="Default select example"
                                onChange={(e) => setType(e.target.value)} value={type}>
                            
                            <option value="num">a number</option>
                            <option value="word">a word</option>
                            <option value="any">anything</option>
                        </select></div>

                        <div className={'flex-wrap w-100'} style={type==="num" ? {display:"flex"} : {display:"none"}}>
                        <span>Value is</span>
                        <select className="form-select" aria-label="Default select example"
                                onChange={(e) => setComp(e.target.value)} value={comp}>
                            <option value=""></option>
                            <option value="equal">equal to</option>
                            <option value="less">less than</option>
                            <option value="greater">greater than</option>
                        </select>
                        <input className="float-end" type="number" disabled={comp===""}></input></div>

                        <div className={'d-flex flex-wrap w-100'} >
                        <span>Value is one of</span>
                        <div>{options.map((opt, ind) => (<input type={type==="num" ? 'number' : 'text'} 
                                                          onChange={(e) => editOption(ind, e.target.value)} value={opt}></input>))}
                        </div>
                        {/* <div>{options.map((opt, ind) => <span>{options.length}</span>)}
                        </div> */}
                        <button onClick={() => addOption()}>+ Add Option</button>
                        
                   
                </div>
            </div>
        </div>
        </div>
    ) 
}