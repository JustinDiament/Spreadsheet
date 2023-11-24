import { IController } from "../interfaces/controller-interface";
import { useState, useEffect } from "react";
import { IValidationRule } from "../interfaces/validation-rule-interface";
import { ValueTypeRule } from "../models/value-type-rule";
import { ValueInRangeRule } from "../models/value-in-range-rule";
import { ValueIsOneOfRule } from "../models/value-is-one-of-rule";


export default function DataValidationMenu({ disp, spreadsheetController } : {disp: boolean, spreadsheetController:IController}) {
    const [rules, setRules] = useState(spreadsheetController.getAllRules());
    const [type, setType] = useState("any");
    const [comp, setComp] = useState("");
    const [val, setVal] = useState(NaN);
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

    function deleteRule(rule:IValidationRule) {
        let newRules:Array<IValidationRule> = [];
        rules.forEach((r) => r!==rule && newRules.push(r));
        setRules(newRules);
    }

    function dispValTypeRule(rule:ValueTypeRule) {
        return (<div className={"d-flex flex-wrap w-100"}>
                        <span>Value is</span>
                        <select disabled className="form-select" aria-label="Default select example"
                                value={rule.getType()}>
                            <option value="num">a number</option>
                            <option value="word">a word</option>
                            <option value="any">anything</option>
                        </select>
                        <button onClick={() => deleteRule(rule as IValidationRule)}>Delete Rule</button></div>);
    }

    function dispValIsRule(rule:ValueInRangeRule) {
        return ( <div className={'flex-wrap w-100'} style={type==="num" ? {display:"flex"} : {display:"none"}}>
                        <span>Value is</span>
                        <select disabled className="form-select" aria-label="Default select example"
                                value={rule.getComparison()}>
                            <option value=""></option>
                            <option value="equal">equal to</option>
                            <option value="less">less than</option>
                            <option value="greater">greater than</option>
                        </select>
                        <input className="float-end" type="number" disabled value={rule.getValue()}></input>
                        <button onClick={() => deleteRule(rule as IValidationRule)}>Delete Rule</button></div>);
    }

    function dispValOneOf(rule:ValueIsOneOfRule) {
        return(<div className={'d-flex flex-wrap w-100'} >
                    <span>Value is one of</span>
                    <div>
                        {rule.getValues().map((opt) => (<input type={type==="num" ? 'number' : 'text'} value={opt}></input>))}
                    </div>
                    <button onClick={() => deleteRule(rule as IValidationRule)}>Delete Rule</button>
                </div>);
    }

    function dispRule(rule:IValidationRule) {
        if(rule instanceof ValueTypeRule) {
            return dispValTypeRule(rule as ValueTypeRule);
        } else if(rule instanceof ValueInRangeRule) {
            return dispValIsRule(rule as ValueInRangeRule);
        } else if(rule instanceof ValueIsOneOfRule) {
            return dispValOneOf(rule as ValueIsOneOfRule);
        } else {return}
    }

    function addRules() {
        spreadsheetController.createRule(new ValueTypeRule(type));
        comp!=="" && spreadsheetController.createRule(new ValueInRangeRule(comp, val));
        options.length>0 && spreadsheetController.createRule(new ValueIsOneOfRule(options));
        setRules(spreadsheetController.getAllRules());
        console.log(rules);
        setType("any");
        setComp("");
        setVal(NaN);
        setOptions([]);
        console.log(spreadsheetController.getCells().length)
    }

    useEffect(() => {
        console.log(spreadsheetController.getSelected());
        console.log(spreadsheetController.getAllRules());
        // setRules(spreadsheetController.getAllRules());
    }, [options, options.length, spreadsheetController.getAllRules(), spreadsheetController.getSelected()]);

    // useEffect(() => {
    //     setRules(spreadsheetController.getAllRules());
    // })

    useEffect(() => {
        setOptions(new Array<string | number>)
        setComp("");
        setVal(NaN);
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
                        <input className="float-end" type="number" disabled={comp===""} value={val} 
                        onChange={(e) => setVal(+e.target.value)}></input></div>

                    <div className={'d-flex flex-wrap w-100'} >
                        <span>Value is one of</span>
                        <div>{options.map((opt, ind) => (<input type={type==="num" ? 'number' : 'text'} 
                                                          onChange={(e) => editOption(ind, e.target.value)} value={opt}></input>))}
                        </div>
                        <button onClick={() => addOption()}>+ Add Option</button>
                    </div>
                    <button onClick={() => addRules()}>Add Rule</button>
                    {rules.map((rule) => (dispRule(rule)))}
                </div>
            </div>
        </div>
    ) 
}