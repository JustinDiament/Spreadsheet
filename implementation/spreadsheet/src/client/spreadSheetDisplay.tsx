import CellGridDisplay from "./cellGridDisplay";
import { IController } from "../interfaces/controller-interface";
import { SpreadsheetController } from "../models/spreadsheet-controller";

const spreadsheetController : IController = new SpreadsheetController();

export default function SpreadSheetDisplay() {

// const [display, setDisplay] = useState(calculatorModel.display());
  
  return (
    <div>
      <CellGridDisplay cellIterator={spreadsheetController.getCellIterator()} />
    </div>
  )
}