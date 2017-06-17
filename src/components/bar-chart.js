import React, { Component } from 'react';
import { scaleTime, scaleLinear } from 'd3-scale';
import { min as d3Min, max as d3Max } from 'd3-array';

import Bars from './bars';
import Tooltip from './tooltip';
import XAxis from './x-axis';
import YAxis from './y-axis';

import '../styles/bar-chart.scss';

class BarChart extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      currBar: null,
      currBars: [],
      authorDrivenCounter: 0,
    }

    this.continueAuthorDrivenNarrative = this.continueAuthorDrivenNarrative.bind(this);
  }

  componentWillMount() {
    this.xScale = scaleTime();
    this.yScale = scaleLinear();
  }

  componentDidMount() {
    this.authorDrivenInterval = setInterval(() => {
      this.continueAuthorDrivenNarrative();
    }, 20)
  }

  componentWillUnmount() {
    clearInterval(this.authorDrivenInterval);
  }

  continueAuthorDrivenNarrative() {
    const { authorDrivenCounter, currBars } = this.state;
    const { data } = this.props;

    if (authorDrivenCounter < data.length) {
      const newData = data[authorDrivenCounter];
      let newArray = [];
      newArray.push(...currBars);
      newArray.push(newData);
      this.setState({
        currBar: newData,
        currBars: newArray,
        authorDrivenCounter: this.state.authorDrivenCounter + 1,
      });
    }
    else {
      clearInterval(this.authorDrivenInterval);
      setTimeout(() => {
        this.setState({
          currBar: null,
          authorDrivenCounter: null,
        })
      }, 5000);
    }
  }

  handleUpdateCurrBar(currBarUpdate) {
    this.setState({
      currBar: currBarUpdate
    });
  }

  render() {
    const { data, chartWidth } = this.props;
    const { authorDrivenCounter } = this.state;

    const margins = { top: 20, right: 30, bottom: 30, left: 30 };
    const svgDimensions = { width: chartWidth - margins.left - margins.right, height: 0.6 * chartWidth }
    
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
      <div style={{position: 'relative'}} className="bar-chart text-center">
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
          {(this.state.currBars.length > 0) && <Bars
            data={this.state.currBars}
            xScale={xScale}
            yScale={yScale}
            svgDimensions={svgDimensions}
            margins={margins}
            barWidth={chartWidth/data.length + 1}
            onUpdateCurrBar={authorDrivenCounter === null ? (currBarUpdate) => this.handleUpdateCurrBar(currBarUpdate) : null}
          />}
        </svg>
        {(this.state.currBar !== null) && <Tooltip
          height={svgDimensions.height}
          width={svgDimensions.width}
          marginLeft={margins.left}
          marginTop={margins.top}
          data={this.state.currBar}
        />}
      </div>
    );
  }
}

export default BarChart;
