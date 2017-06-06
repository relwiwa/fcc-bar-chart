import React, { Component } from 'react';
import { scaleTime, scaleLinear } from 'd3-scale';
import { min as d3Min, max as d3Max } from 'd3-array';

import Bars from './bars';
import XAxis from './x-axis';
import YAxis from './y-axis';

class BarChart extends Component {
  constructor(props) {
    super(props);
    
    this.xScale = scaleTime();
    this.yScale = scaleLinear();
  }

  render() {
    const { data, chartWidth } = this.props;

    const margins = { top: 20, right: 30, bottom: 30, left: 40 };
    const svgDimensions = { width: chartWidth, height: 0.6 * chartWidth }
    
    const minXValue = d3Min(data, (d) => {
      return d[0];
    });
    const maxXValue = d3Max(data, (d) => {
      return d[0];
    });

    const xScale = this.xScale
      .domain([ minXValue, maxXValue ])
      .range([margins.left + 5, svgDimensions.width - margins.right]);

    const maxYValue = d3Max(data, (d) => {
      return d[1];
    });

    const yScale = this.yScale
      .domain([0, maxYValue])
      .range([ svgDimensions.height - margins.bottom, margins.top ])

    return (
      <svg width={svgDimensions.width} height={svgDimensions.height}>
        <XAxis
          orient="bottom"
          scale={xScale}
          translate={`translate(0, ${svgDimensions.height - margins.bottom})`}
          ticks={5}
          tickSizeOuter={0}
        />
        <YAxis
          orient="left"
          scale={yScale}
          translate={`translate(${margins.left}, 0)`}
          ticks={10}
          tickSizeOuter={0}
          tickFormat={(d) => {
            d = d/1000;
            return d + 'k';
          }}
        />
        <Bars
          data={data}
          xScale={xScale}
          yScale={yScale}
          svgDimensions={svgDimensions}
          margins={margins}
        />
      </svg>
    );
  }
}

export default BarChart;
