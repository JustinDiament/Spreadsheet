/**
 * @file cell-style.spec.ts
 * @testing ICellStyle
 */

import { ICellStyle } from "../../interfaces/cell-style-interface";
import { CellStyle } from "../cell-style";

// tests for the ICellStyle interface
// because only setters and getters, no logic to test
describe('Testing ICellStyle', (): void => {

  let cellStyle: ICellStyle;

  // reset cellStyle
  beforeEach(() => {
    cellStyle = new CellStyle();
  });

  // test getTextColor - default value is #000000
  it('should have default values on creation', () => {
    expect(cellStyle.getTextColor()).toBe('#000000');
  });
  
  // test isCellUnderlined - default value is false
   it('should not be underlined by default', () => {
    expect(cellStyle.isCellUnderlined()).toBe(false);
  });

  // test isCellItalic - default value is false
  it('should not be italicized by default', () => {
    expect(cellStyle.isCellItalic()).toBe(false);
  });

  // test isCellBold - default value is false
  it('should not be bold by default', () => {
    expect(cellStyle.isCellBold()).toBe(false);
  });

  // test setBold true
  it('should set the bold property to true', () => {
    cellStyle.setBold(true);
    expect(cellStyle.isCellBold()).toBe(true);
  });

  // test setBold false
  it('should set the bold property to false', () => {
    cellStyle.setBold(false);
    expect(cellStyle.isCellBold()).toBe(false);
  });

  // test setItalic true
  it('should set the italic property to true', () => {
    cellStyle.setItalic(true);
    expect(cellStyle.isCellItalic()).toBe(true);
  });

   // test setItalic false
  it('should set the italic property to false', () => {
    cellStyle.setItalic(false);
    expect(cellStyle.isCellItalic()).toBe(false);
  });

  // test setUnderline true
  it('should set the underline property to true', () => {
    cellStyle.setUnderline(true);
    expect(cellStyle.isCellUnderlined()).toBe(true);
  });

   // test setUnderline false
  it('should set the underline property to false', () => {
    cellStyle.setUnderline(false);
    expect(cellStyle.isCellUnderlined()).toBe(false);
  });

  // test setTextColor
  it('should set the text color property', () => {
    const newColor = '#FF0000';
    cellStyle.setTextColor(newColor);
    expect(cellStyle.getTextColor()).toBe(newColor);
  });
});
