
/**
 * Represents the style attributes of a cell
 */
export interface ICellStyle {

    /**
     * Update whether or not this style is bolded
     * @param isBold whether the style should be bold or not
     */
    setBold(isBold:boolean): void;

     /**
     * Update whether or not this style is italicized
     * @param isItalic whether the style should be italicized or not
     */
    setItalic(isItalic:boolean): void;

    /**
     * Update whether or not this style is underlined
     * @param isUnderlined whether the style should be bold or not
     */
    setUnderline(isUnderlined:boolean): void;

    /**
     * Update the color of the text for this style
     * @param textColor the color the text of this style should be
     */
    setTextColor(textColor:string): void;

    /**
     * Return the value of isUnderlined
     */
    isCellUnderlined(): boolean;

    /**
     * Return the value of isItalic
     */
    isCellItalic(): boolean;

    /**
     * Return the value of isBold
     */
    isCellBold(): boolean;

    /**
     * Update the color of the text for this style
     * @returns the color of the text 
     */
    getTextColor(): string;
    
};