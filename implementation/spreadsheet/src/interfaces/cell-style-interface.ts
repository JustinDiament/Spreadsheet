/**
 * @file cell-style-interface.ts
 * @interface ICellStyle
 */


/**
 * An interface that represents a set of style attribtues
 */
export interface ICellStyle {

    /**
     * Update whether or not this ICellStyle is bolded
     * @param isBold whether the ICellStyle should be bold or not
     */
    setBold(isBold:boolean): void;

     /**
     * Update whether or not this ICellStyle is italicized
     * @param isItalic whether the ICellStyle should be italicized or not
     */
    setItalic(isItalic:boolean): void;

    /**
     * Update whether or not this ICellStyle is underlined
     * @param isUnderlined whether the ICellStyle should be bold or not
     */
    setUnderline(isUnderlined:boolean): void;

    /**
     * Update the color of the text for this ICellStyle
     * @param textColor the color the text of this ICellStyle should be
     */
    setTextColor(textColor:string): void;

    /**
     * Is this ICellStyle underlined?
     * @returns true if this ICellStyle is underlined, else false
     */
    isCellUnderlined(): boolean;

    /**
     * Is this ICellStyle italicized?
     * @returns true if this ICellStyle is italicized, else false
     */
    isCellItalic(): boolean;

    /**
     * Is this ICellStyle bolded?
     * @returns true if this ICellStyle is bolded, else false
     */
    isCellBold(): boolean;

    /**
     * Get the color of the text for this ICellStyle
     * @returns a text color represented as a string containing a 6-digit hex code
     */
    getTextColor(): string;
};