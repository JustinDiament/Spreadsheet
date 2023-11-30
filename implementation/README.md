HOW TO INSTALL THE SPREADSHEET: 
- Navigate to the "spreadsheet" folder (/implementation/spreadsheet)
- Run "npm install" in the terminal
- Run "npm start" in the terminal
- Navigate to http://localhost:3000 in a web browser


HOW TO RUN THE SPREADSHEET TESTS:
- Navigate to the "spreadsheet" folder (/implementation/spreadsheet)
- Run "npm install" in the terminal
- Run "npm test --coverage" in the terminal


HOW TO USE THE SPREADSHEET: 
- Cells are denoted via a column and row in the form "A1". 
- Click on any cell to type in it. You will now see the "true" value of that cell. 
    - Then, click anywhere else on the page to exit editing that cell. You will see the "display" value of that cell again (whatever that may be, after applying references, formulas, error checking, etc.).
    - You may type any text into cells.
- Cell references are in the form "REF(A1)".
- Range expressions are in the form "SUM(A1..B5)" and "AVERAGE(A1..B5)".
- Formulas are any cells that include the reserved character(s) +, -, /, *, and/or *, with the exception of the + operator also being used to concatenate strings.
- Strings can be concatenated using the + operator. This will be done with the + sign unless both the operands to the left and right of it are numerical (in which case it will be evaluated as a numerical formula) .
- In non-formula cells, you may type any number of expressions back to back (for instance, “REF(A1) REF(B1) SUM(A4..A7)” is a legal cell content). 

- Single cells, as well as groups of cells, can be selected. This is visually indicated by a blue highlight over the cell(s). 
    - In order to select multiple cells at once, click one cell, hold SHIFT, then click another cell. All cells in between will be selected.
- To add a column, click the Edit dropdown menu and select "Insert Column Left" or "Insert Column Right". A column will be inserted either to the left of the leftmost cell you have selected or to the right of the rightmost cell you have selected. 
- To add a row, click the Edit dropdown menu and select "Insert Row Above" or "Insert Row Below". A row will be inserted either above the highest cell you have selected or below the lowest cell you have selected.
- In order to delete row(s) or column(s), use the Delete Row(s) and Delete Column(s) buttons in the Edit dropdown menu. All rows or columns with a cell selected in them will be deleted.
- To clear cell(s), use the Clear Selected Cells or Clear All Cells buttons in the Edit dropdown menu. 

- The Find and Replace side menu is opened via the Data dropdown menu.
    - Once the Find and Replace side menu is open, the cells will be locked and cannot be clicked into/edited until the side menu is closed.
- Type a word to find into the "find" box and a word to replace it with in the "replace with" box. 
- Then, one possible choice is the Replace All button, which will replace all instances of the find text with the replace text in cells no matter what
- The other choice is to go through instance of the find text one by one, selecting to replace or not on a case by case basis.
    - To do this, you will see that the first instance of the find text is selected/highlighted. 
    - To choose to replace this instance, press the Replace button. The select/highlight will automatically move on to the next instance of the find text after doing this.
    - To choose NOT to replace this instance, press the Find Next button. The select/highlight will automatically move on to the next instance of the find text without replacing this one.
- Close the side menu with the X icon in its top right corner.

- The Data Validation side menu is opened via the Data dropdown menu.
- In this menu, you can select from different types of rules to apply to the currently selected cell:
    - A "value is a word" rule allows the cell to contain any text
    - A "value is a number" rule requires the cell to contain a number
    - A "value is one of" rule allows you to specify any number of different values that the cell data must be equal to one of
    - A "value is greater than/less than/equal to" rule does as the name implies and is only avalible after applying the "value is a number" rule. 
- For these rules, "required to be" means that if the cell's display value does not meet the rule, it will be replaced with an error message instead. For instance, if a "value is a number" rule is applied to cell A1, which contains "REF(B1)", and B1 contains "hello", A1 would display an error instead of "hello". A1's "true" value remains uneffected. 
- Rules can be applied to multiple cells at once by selecting multiple cells using SHIFT as described above
- Rules can be removed via the Delete Rule button that appears under the rule after applying it to a cell.
    - Rules must be deleted from one cell at a time. They cannot be deleted in bulk.
- Close the side menu with the X icon in its top right corner.

- To style text, you can use the 4 buttons in the top right corner. In order from right to left, they are:
    - A bold button
    - An italics button
    - An underline button
    - A button that displays a color palette that allows you to choose text color from a GUI, or type a HEX value for color
- Styles are applied on a cell basis. All text in a cell will have the same style or lack thereof
- If bold, italics, or underline is selected for a cell that is already bolded/italicized/underlined, that quality is removed.
- Text styles are applied to all selected cells (you can use multi-select with SHIFT as described above). 
    - In order to remove bolded/italicized/underline, ALL selected cells must have that quality. If only some do, the quality will be applied to the ones that do not have it when clicking the button. 
    
- To view this guide, click the Help button next to the Edit and Data dropdown menus.