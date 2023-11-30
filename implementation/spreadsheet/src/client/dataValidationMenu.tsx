/**
 * @file dataValidationMenu.tsx
 */

import { ISpreadSheetState } from "../interfaces/controller-interface";
import { useState, useEffect } from "react";
import { IValidationRule } from "../interfaces/validation-rule-interface";
import { ValueTypeRule } from "../models/value-type-rule";
import { ValueInRangeRule } from "../models/value-in-range-rule";
import { ValueIsOneOfRule } from "../models/value-is-one-of-rule";
import { useSpreadsheetController } from "../models/spreadsheet-controller";
import React from "react";

/**
 * ==============================================================
 * helper functions that do not need to be in the React component
 * ==============================================================
 */

/**
 * a function that returns an HTML element displaying the provided ValueTypeRule
 * @param rule the ValueTypeRule to be rendered
 * @param ind the index of the rule, to be used as a key
 * @param onClick the function to be called on click
 * @returns the HTML element to display
 */
function dispValTypeRule(rule: ValueTypeRule, ind: number, onClick: (rule: IValidationRule) => void) {
  return (
    <div className={"d-flex flex-wrap w-100 mb-4"} key={ind}>
      <span className={"w-100"}>Value is</span>
      {/* disable editing - user can only view this rule or delete it */}
      <select
        disabled
        className="form-select w-100 my-1"
        aria-label="Default select example"
        value={rule.getType()}>
        <option value="num">a number</option>
        <option value="word">a word</option>
      </select>
      {/* Allow user to delete this rule from the currently selected cells */}
      <button
        className={"btn btn-danger w-100 mt-2"}
        onClick={() => onClick(rule)}>
        Delete Rule
      </button>
    </div>
  );
}

/**
 * a function that returns an HTML element displaying the provided ValueInRangeRule
 * @param rule the ValueInRangeRule to be rendered
 * @param ind the index of the rule, to be used as a key
 * @param onClick the function to be called on click
 * @returns the HTML element to display
 */
function dispValIsRule(rule: ValueInRangeRule, ind: number, onClick: (rule: IValidationRule) => void) {
  return (
    <div className={"flex-wrap w-100 mb-4"} key={ind}>
      <span className={"w-100"}>Value is</span>
      {/* disable editing - user can only view this rule or delete it */}
      <select
        disabled
        className="form-select w-100 my-1"
        aria-label="Default select example"
        value={rule.getComparison()}>
        <option value=""></option>
        <option value="equal">equal to</option>
        <option value="less">less than</option>
        <option value="greater">greater than</option>
      </select>
      {/* disable editing - user can only view this rule or delete it */}
      <input
        className="float-end w-100 my-1 form-control"
        type="number"
        disabled
        value={rule.getValue()}></input>
      {/* Allow user to delete this rule from the currently selected cells */}
      <button
        className={"btn btn-danger w-100 mt-2"}
        onClick={() => onClick(rule)}>
        Delete Rule
      </button>
    </div>
  );
}

/**
 * a function that returns an HTML element displaying the provided ValueIsOneOfRule
 * @param rule the ValueIsOneOfRule to be rendered
 * @param ind the index of the rule, to be used as a key
 * @param ind the index of the rule, to be used as a key
 * @param onClick the function to be called on click
 * @param type the rule's type (i.e. word, number)
 * @returns the HTML element to display
 */
function dispValOneOf(rule: ValueIsOneOfRule, ind: number, onClick: (rule: IValidationRule) => void, type: string) {
  return (
    <div className={"d-flex flex-wrap w-100 mb-4"} key={ind}>
      <span className={"w-100"}>Value is one of</span>
      <div>
        {/* map through the values that the cell can contain and display them */}
        {/* disable editing - user can only view this rule or delete it */}
        {rule.getValues().map((opt, ind) => (
          <input
            className={"form-control w-100 my-1"}
            type={type === "num" ? "number" : "text"}
            disabled
            value={opt}
            key={ind}></input>))}
      </div>
      {/* Allow user to delete this rule from the currently selected cells */}
      <button
        className={"btn btn-danger w-100 mt-2"}
        onClick={() => onClick(rule)}>
        Delete Rule
      </button>
    </div>
  );
}

/**
 * a function that returns an HTML element displaying the provided IValidationRule
 * by determining which type of data validation rule it is, and sending it to the corresponding
 * helper function to render
 * @param rule the data validation rule to be rendered
 * @param ind the index of the rule, to be used as a key
 * @param onClick the function to be called on click
 * @param type the rule's type (i.e. word, number)
 * @returns the HTML element to display
 */
function dispRule(rule: IValidationRule, ind: number, onClick: (rule: IValidationRule) => void, type: string) {
  if (rule instanceof ValueTypeRule) {
    return dispValTypeRule(rule as ValueTypeRule, ind, onClick);
  } else if (rule instanceof ValueInRangeRule) {
    return dispValIsRule(rule as ValueInRangeRule, ind, onClick);
  } else if (rule instanceof ValueIsOneOfRule) {
    return dispValOneOf(rule as ValueIsOneOfRule, ind, onClick, type);
  } else {
    return;
  }
}

/**
 * ==============================================================
 *                     React component
 * ==============================================================
 */

// an interface to define the DataValidationMenuProps type for the DataValidationMenu component
interface DataValidationMenuProps {
  disp: boolean; // is the data validation menu displayed?
}

// A React component to respresent the side menu that allows for the creation, deletion, and viewing of data validation rules
// the value of disp determines whether this menu is rendered or not
function DataValidationMenu({ disp }: DataValidationMenuProps) {
  // store the currently displayed list of data validation rules
  const [rules, setRules] = useState<IValidationRule[]>(
    useSpreadsheetController(
      (controller: ISpreadSheetState) => controller.getAllRules
    )
  );

  // for the new set of rules being created, store the following information as it is being edited:
  // the type of value that the cell will contain ("value is a number/a word")
  const [type, setType] = useState<string>("word");

  // the comparison function for the value, IFF type is a number ("value is greater than/less than/equal to")
  const [comp, setComp] = useState<string>("");

  // the value being compared to, IFF comp is not "" ("value is greater than/less than/equal to VAL")
  const [val, setVal] = useState<number>(NaN);

  // the list of values that the cell can contain ("value is one of...")
  const [options, setOptions] = useState<Array<string | number>>([]);

  // store the currently selected cells in the spreadsheet
  const selection = useSpreadsheetController(
    (controller: ISpreadSheetState) => controller.currentlySelected
  );

  // a constant to allow createRule to be called on the spreadsheet using the ISpreadSheetState
  const createRule = useSpreadsheetController(
    (controller: ISpreadSheetState) => controller.createRule
  );

  // a constant to allow removeRule to be called on the spreadsheet using the ISpreadSheetState
  const removeRule = useSpreadsheetController(
    (controller: ISpreadSheetState) => controller.removeRule
  );

  // a constant to allow getAllRules to be called on the spreadsheet using the ISpreadSheetState
  const getAllRules = useSpreadsheetController(
    (controller: ISpreadSheetState) => controller.getAllRules
  );

  /**
   * a function that allows an empty option to be added to list of values that the cell can contain
   */
  function addOption() {
    // the option to be added - it is either a number of a string
    let added: number | string = type === "num" ? 0 : "";
    // the array of the new list of options, populate it with the original options
    let options2: Array<number | string> = [];
    for (let i: number = 0; i < options.length; i++) {
      options2.push(options[i]);
    }
    // add the new option to the new list of options
    // and use setOptions to set the state of the current list of options
    options2.push(added);
    setOptions(options2);
  }

  /**
   * a function that allows the value of an option in the current list of values a cell can contain to be edited
   * @param index the index of the option being edited
   * @param newVal the new value for the option being edited
   */
  function editOption(index: number, newVal: number | string) {
    // the array of the new list of options, populate it with the original options
    let options2: Array<number | string> = [];
    for (let i: number = 0; i < options.length; i++) {
      // if this is the option that is being edited, add the new value instead of the existing one
      // otherwise, just add the original option
      options2.push(index === i ? newVal : options[i]);
    }
    // use setOptions to set the state of the current list of options
    setOptions(options2);
  }

  /**
   * a function that allows an existing rule to be deleted from all the currently selected cells
   * @param rule the rule to be deleted
   */
  function deleteRule(rule: IValidationRule) {
    removeRule(rule);
    // use setRules to set the state of the current list of rules
    setRules(getAllRules());
  }

  /**
   * a function to add to the currently selected cells the new rule(s) containing the edited type, comp, val, options states
   * if they have been changed from the empty default state
   */
  function addRules() {
    // create a rule for the value type, since it is never empty
    createRule(new ValueTypeRule(type));
    // if there is a comparison function and a valid value selected, create a rule for it with the value the user entered
    comp !== "" && !isNaN(val) && createRule(new ValueInRangeRule(comp, val));
    // if there are any options for the values the cell can contain, create a rule for the values the cell can be
    options.length > 0 && createRule(new ValueIsOneOfRule(options));
    // set the list of rules to make sure they include all rules, including the newly added ones
    setRules(getAllRules());
    // reset all the values of the states, as the user can now add a fresh rule if they would like
    setType("word");
    setComp("");
    setVal(NaN);
    setOptions([]);
  }

  // rerender the displayed list of options if they change
  useEffect(() => {}, [options, options.length]);

  // rerender the list of rules if the rules change, or if the selected cells change
  useEffect(() => {
    setRules(getAllRules());
  }, [getAllRules, selection]);

  // if the user changes the value type of the rule, reset all the other rules being edited
  useEffect(() => {
    setOptions([]);
    setComp("");
    setVal(NaN);
  }, [type]);

  // the actual HTML to return
  return (
    <div
      className="mx-4 flex-wrap sp-panel-interior overflow-y-auto"
      style={disp ? { display: "flex" } : { display: "none" }}
    >
      <h3 className="w-100">Data Validation Rules</h3>

      <div className="sp-panel-int-body w-100">
        <div className="w-100 d-flex flex-wrap justify-content-center">
          <hr className={"w-100"}></hr>
          {/* display the existing rules */}
          {rules.map((rule, ind) => dispRule(rule, ind, deleteRule, type))}
          <hr
            className="w-100"
            style={rules.length > 0 ? { display: "flex" } : { display: "none" }}
          ></hr>
          {/* display the UI for adding a new set of rules */}
          {/* add a rule for the type of value (number, word) */}
          <div className={"d-flex flex-wrap w-100 my-2"}>
            <span className={"w-100"}>Value is</span>
            {/* drop down to select type */}
            <select
              className="form-select w-100 my-1"
              aria-label="Default select example"
              onChange={(e) => setType(e.target.value)}
              value={type}>

              <option value="num">a number</option>
              <option value="word">a word</option>
            </select>
          </div>

          {/* add a rule for the range the value can fall in IFF it is a number */}
          <div
            className={"flex-wrap w-100 my-2"}
            style={type === "num" ? { display: "flex" } : { display: "none" }}>
            <span className={"w-100"}>Value is</span>
            {/* dropdown to select comparison function */}
            <select
              className="form-select w-100 my-1"
              aria-label="Default select example"
              onChange={(e) => setComp(e.target.value)}
              value={comp}>

              <option value=""></option>
              <option value="equal">equal to</option>
              <option value="less">less than</option>
              <option value="greater">greater than</option>
            </select>
            {/* input box to enter value */}
            <input
              className="float-end w-100 my-1 form-control"
              type="number"
              disabled={comp === ""}
              value={!isNaN(val) ? val : ''}
              onChange={(e) => setVal(+e.target.value)}></input>
          </div>

          {/* add a rule for the list of values the cell can have */}
          <div className={"d-flex flex-wrap w-100 my-2"}>
            <span className="mb-1 w-100">Value is one of</span>
            <div>
              {/* input box to enter option */}
              {options.map((opt, ind) => (
                <input
                  className="w-100 my-1 form-control"
                  type={type === "num" ? "number" : "text"}
                  onChange={(e) => editOption(ind, e.target.value)}
                  value={opt}
                  key={ind}></input>))}
            </div>
            {/* button to add another option */}
            <button
              className={"btn btn-light btn-sm"}
              onClick={() => addOption()}>
              + Add Option
            </button>
          </div>
          {/* add the rules to the list of rules */}
          <button
            className={"btn btn-primary justify-content-center w-100 mt-3"}
            onClick={() => addRules()}>
            Add Rule
          </button>
        </div>
      </div>
    </div>
  );
}

// memoize to avoid unnecessary rerenders
export default React.memo(DataValidationMenu);
