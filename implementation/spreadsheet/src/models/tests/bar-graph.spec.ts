import { BarGraph } from "../bar-graph";

describe('Bar Graph', (): void => {
    let graph: BarGraph = new BarGraph("x", "y", "name", [])

    beforeEach((): void => {
    });
  
    it('should update the y axis name when the setter is called', (): void => {
        graph.setYAxisName("new");
        expect(graph.getYAxisName()).toBe("new");
    });

    it('should update the x axis name when the setter is called', (): void => {
        graph.setXAxisName("new");
        expect(graph.getXAxisName()).toBe("new");
    });

    it('should update the graph name when the setter is called', (): void => {
        graph.setGraphName("new");
        expect(graph.getGraphName()).toBe("new");
    });
  
  });
export {}