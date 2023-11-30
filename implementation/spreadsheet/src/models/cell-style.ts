/**
 * @file cell-style.ts
 * @class CellStyle
 */

import { ICellStyle } from "../interfaces/cell-style-interface";

/**
 * Represents the style attributes of a cell
 */
export class CellStyle implements ICellStyle {
  /**
   * Is the text in the cell bolded?
   */
  private isBold: boolean;

  /**
   * Is the text in the cell italicized?
   */
  private isItalic: boolean;

  /**
   * Is the text in the cell underlined?
   */
  private isUnderlined: boolean;

  /**
   * The color of the text in the cell
   */
  private textColor: string;

  /**
   * Create a new default cell style
   */
  public constructor() {
    this.isBold = false;
    this.isItalic = false;
    this.isUnderlined = false;
    this.textColor = "#000000";
  }

  /**
   * Update whether or not this style is bolded
   * @param isBold whether the style should be bold or not
   */
  public setBold(isBold: boolean): void {
    this.isBold = isBold;
  }

  /**
   * Update whether or not this style is italicized
   * @param isItalic whether the style should be italicized or not
   */
  public setItalic(isItalic: boolean): void {
    this.isItalic = isItalic;
  }

  /**
   * Update whether or not this style is underlined
   * @param isUnderlined whether the style should be bold or not
   */
  public setUnderline(isUnderlined: boolean): void {
    this.isUnderlined = isUnderlined;
  }

  /**
   * Update the color of the text for this style
   * @param textColor the color the text of this style should be
   */
  public setTextColor(textColor: string): void {
    this.textColor = textColor;
  }

  /**
   * Return the value of isUnderlined
   * @returns whether this cell style is underlined
   */
  public isCellUnderlined(): boolean {
    return this.isUnderlined;
  }

  /**
   * Return the value of isItalic
   * @returns whether this cell style is italicized
   */
  public isCellItalic(): boolean {
    return this.isItalic;
  }

  /**
   * Return the value of isBold
   * @returns whether this cell style is underlined
   */
  public isCellBold(): boolean {
    return this.isBold;
  }

  /**
   * Return the value of textColor
   * @returns the hex-code text color of this style
   */
  public getTextColor(): string {
    return this.textColor;
  }
}
