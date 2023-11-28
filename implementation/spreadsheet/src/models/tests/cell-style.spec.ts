import { CellStyle } from "../cell-style";

describe('CellStyle', () => {
  let cellStyle: CellStyle;

  beforeEach(() => {
    cellStyle = new CellStyle();
  });

  it('should have default values on creation', () => {
    expect(cellStyle.isCellBold()).toBe(false);
    expect(cellStyle.isCellItalic()).toBe(false);
    expect(cellStyle.isCellUnderlined()).toBe(false);
    expect(cellStyle.getTextColor()).toBe('#000000');
  });

  it('should set the bold property', () => {
    cellStyle.setBold(true);
    expect(cellStyle.isCellBold()).toBe(true);
  });

  it('should set the italic property', () => {
    cellStyle.setItalic(true);
    expect(cellStyle.isCellItalic()).toBe(true);
  });

  it('should set the underline property', () => {
    cellStyle.setUnderline(true);
    expect(cellStyle.isCellUnderlined()).toBe(true);
  });

  it('should set the text color property', () => {
    const newColor = '#FF0000';
    cellStyle.setTextColor(newColor);
    expect(cellStyle.getTextColor()).toBe(newColor);
  });

  it('should not be underlined by default', () => {
    expect(cellStyle.isCellUnderlined()).toBe(false);
  });

  it('should not be italicized by default', () => {
    expect(cellStyle.isCellItalic()).toBe(false);
  });

  it('should not be bold by default', () => {
    expect(cellStyle.isCellBold()).toBe(false);
  });
});
