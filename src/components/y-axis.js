import React, { Component } from 'react';
import { axisLeft as d3AxisLeft } from 'd3-axis';
import { select as d3Select } from 'd3-selection';

class YAxis extends Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const { orient, scale, tickFormat, ticks, tickSizeOuter } = this.props;

    const axis = d3AxisLeft()
      .scale(scale)
      .tickSizeOuter(tickSizeOuter)
      .ticks(ticks)
      .tickFormat(tickFormat);
      
    d3Select(this.axisElement).call(axis)
  }

  render() {
    const { orient, translate } = this.props;

    return (
      <g
        className={`axis axis-${orient}`}
        ref={(el) => { this.axisElement = el; }}
        transform={translate}
      />
    )
  }
}

export default YAxis;
