/**
 * Represents a graph that displays data in chosen categories
 */
export interface IGraph {
    /**
     * Sets the name of the graph's X axis
     * @param name the new name of the X axis
     */
    setXAxisName(name: string): void;

    /**
     * Sets the name of the graph's Y axis
     * @param name the new name of the Y axis
     */
    setYAxisName(name: string): void;

    /**
     * Sets the name of the graph
     * @param name the new name of the overall graph 
     */
    setGraphName(name: string): void;

    /**
     * Updates the graph based on the current data in the cells it is observing 
     */
    updateGraph(): void;
}