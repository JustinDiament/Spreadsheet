import { ACell } from "../interfaces/cell-abstract-class";
import { IGraph } from "../interfaces/graph-interface";

/**
 * Represents a bar graph that displays data in chosen categories
 */
export class BarGraph implements IGraph{
    /**
     * The unique ID number of this cell
     */
    private id: number;

    /**
     * The x axis name for this bar graph
     */
    private xAxisName: string;

    /**
     * The y axis name for this bar graph
     */
    private yAxisName: string;

    /**
     * The name for this bar graph
     */
    private graphName: string;

    /**
     * The cells that this bar graph reads data from to determine 
     * axis names and data in its bars
     */
    private data: Array<Array<ACell>>;

    public constructor(xAxisName: string, yAxisName: string, graphName: string, data: Array<Array<ACell>>) {
        this.yAxisName = yAxisName;
        this.xAxisName = xAxisName;
        this.data = data;
        this.graphName = graphName;
        this.id = 0; //this will need to be updated so we give them unique ids
    }

    /**
     * Getter data
     * @return {Array<Array<ACell>>}
     */
	public getData(): Array<Array<ACell>> {
		return this.data;
	}

    /**
     * Setter data
     * @param {Array<Array<ACell>>} value
     */
	public setData(value: Array<Array<ACell>>) {
		this.data = value;
	}

    /**
     * Sets the name of the graph's X axis
     * @param name the new name of the X axis
     */
    public setXAxisName(name: string): void {
        this.xAxisName = name;
    }

    /**
     * Sets the name of the graph's Y axis
     * @param name the new name of the Y axis
     */
    public setYAxisName(name: string): void {
        this.yAxisName = name;
    }

    /**
     * Sets the name of the graph
     * @param name the new name of the overall graph 
     */
    public setGraphName(name: string): void {
        this.graphName = name;
    }

        /**
     * Gets the name of the graph's X axis
     * @param name the new name of the X axis
     */
        public getXAxisName(): string {
            return this.xAxisName;
        }
    
        /**
         * Gets the name of the graph's Y axis
         * @param name the new name of the Y axis
         */
        public getYAxisName(): string {
            return this.yAxisName;
        }
    
        /**
         * Gets the name of the graph
         * @param name the new name of the overall graph 
         */
        public getGraphName(): string {
            return this.graphName;
        }


    /**
     * Updates the graph based on the current data in the cells it is observing 
     */
    public updateGraph(): void {
    }
}