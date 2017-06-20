import React, { Component } from 'react';
import { scaleTime as d3ScaleTime, scaleLinear as d3ScaleLinear } from 'd3-scale';
import { axisBottom as d3AxisBottom, axisLeft as d3AxisLeft } from 'd3-axis';

import Axis from './axis';
import AxisLegend from './axis-legend';
import Bars from './bars';

class D3ChartComponents extends Component {
  constructor(props) {
    super(props);

    const { chartHeight, chartWidth, chartSpex: { margins }, maxMinValues } = props;
    this.state = {
      xScale: this.calculateXScale(chartWidth, margins, maxMinValues),
      yScale: this.calculateYScale(chartHeight, margins, maxMinValues),
    };
  }

  // scale functions only need to be updated after change in chart dimensions
  componentWillReceiveProps(nextProps) {
    if (this.props.chartWidth !== nextProps.chartWidth) {
      const { chartHeight, chartWidth, chartSpex: { margins }, maxMinValues } = nextProps;
      this.setState({
        xScale: this.calculateXScale(chartWidth, margins, maxMinValues),
        yScale: this.calculateYScale(chartHeight, margins, maxMinValues),
      });
    }
  }

  /*  Update of D3-dependent components only necessary after:
      - gdpData changed
      - chart dimensions changed */
  shouldComponentUpdate(nextProps) {
    if (this.props.chartWidth !== nextProps.chartWidth || this.props.gdpData !== nextProps.gdpData) {
      return true;
    }
    else {
      return false;
    }
  }

  calculateXScale(chartWidth, margins, maxMinValues) {
    const { maxXValue, minXValue } = maxMinValues;
    return d3ScaleTime()
      .domain([ minXValue, maxXValue ])
      .range([margins.left + 1, chartWidth]);
  }

  calculateYScale(chartHeight, margins, maxMinValues)  {
    const { maxYValue } = maxMinValues;
    return d3ScaleLinear()
      .domain([0, maxYValue])
      .range([chartHeight - margins.bottom, margins.top]);
  }

  render() {
    const { chartHeight, chartWidth, gdpData, chartSpex: { margins, xAxis, yAxis }, onUpdateCurrGdpDatum, styleSpex } = this.props;
    const { xScale, yScale } = this.state;

    return(
      <g>
        <Axis
          axisFunction={d3AxisBottom}
          scale={xScale}
          orient="bottom"
          ticks={xAxis.ticks * chartWidth * 0.002}
          tickSizeOuter={xAxis.tickSizeOuter}
          translate={`translate(0, ${chartHeight - margins.bottom})`}
        />
        <Axis
          axisFunction={d3AxisLeft}
          scale={yScale}
          orient="left"
          ticks={yAxis.ticks * chartWidth * 0.001}
          tickSizeOuter={yAxis.tickSizeOuter}
          tickFormat={(d) => d/1000 + 'k'}
          translate={`translate(${margins.left}, 0)`}
        />
        <AxisLegend
          margins={margins}
          legend='Billion US-$'
        />
        <Bars
          barWidth={(chartWidth/gdpData.length + 1)}
          chartHeight={chartHeight}
          gdpData={gdpData}
          margins={margins}
          onUpdateCurrGdpDatum={onUpdateCurrGdpDatum}
          styleSpex={styleSpex}
          xScale={xScale}
          yScale={yScale}
        />
      </g>
    )
  }
}

export default D3ChartComponents;
