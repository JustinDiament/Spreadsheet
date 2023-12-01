/**
 * @file cell-data-errors-enum.ts
 * @enum ErrorDisplays
 */

/**
 * Represents the possible error types that can be contained in a cell
 */
export enum ErrorDisplays {
  // Malformed range expression
  INVALID_RANGE_EXPR = "#INVALID-EXPR",

  // Malformed cell reference
  INVALID_CELL_REFERENCE = "#INVALID-REF",

  // Cell ref or range expression refers to cell beyond the bounds 
  // of the current spreadsheet size
  REFERENCE_OUT_OF_RANGE = "#REF-OUT-OF-RANGE",

  // Malformed arithmetic formula
  INVALID_FORMULA = "#INVALID-FORMULA",

  // A cell ref or range expression references itself, or creates an
  // infinate loop via a chain of references
  REFERENCE_TO_SELF = "#SELF-REF",

  // A validation rule has been violated
  INVALID_CELL_DATA = "#INVALID-INPUT",
}
