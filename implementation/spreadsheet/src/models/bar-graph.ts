import { ACell } from "../interfaces/cell-abstract-class";
import { IGraph } from "../interfaces/graph-interface";

/**
 * Represents a bar graph that displays data in chosen categories
 */
export class BarGraph implements IGraph{
    /**
     * The unique ID number of this cell
     */
    //private id: number;

    /**
     * The x axis name for this bar graph
     */
    //private xAxisName: string;

    /**
     * The y axis name for this bar graph
     */
    //private yAxisName: string;

    /**
     * The name for this bar graph
     */
    //private graphName: string;

    /**
     * The cells that this bar graph reads data from to determine 
     * axis names and data in its bars
     */
    //private data: Array<Array<ACell>>;

    /**
     * Sets the name of the graph's X axis
     * @param name the new name of the X axis
     */
    public setXAxisName(name: string): void {
    }

    /**
     * Sets the name of the graph's Y axis
     * @param name the new name of the Y axis
     */
    public setYAxisName(name: string): void {
    }

    /**
     * Sets the name of the graph
     * @param name the new name of the overall graph 
     */
    public setGraphName(name: string): void {
    }

    /**
     * Updates the graph based on the current data in the cells it is observing 
     */
    public updateGraph(): void {
    }
}