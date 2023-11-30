/**
 * @file cell-data-errors-enum.ts
 * @enum ErrorDisplays
 */

/**
 * Represents the possible error types that can be contained in a cell
 */
export enum ErrorDisplays {
  INVALID_RANGE_EXPR = "#INVALID-EXPR",
  INVALID_CELL_REFERENCE = "#INVALID-REF",
  REFERENCE_OUT_OF_RANGE = "#REF-OUT-OF-RANGE",
  INVALID_FORMULA = "#INVALID-FORMULA",
  REFERENCE_TO_SELF = "#SELF-REF",
  INVALID_CELL_DATA = "#INVALID-INPUT",
}
