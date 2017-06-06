import React, { Component } from 'react';
import { axisBottom as d3AxisBottom } from 'd3-axis';
import { select as d3Select } from 'd3-selection';

import '../styles/x-axis.scss';

class XAxis extends Component {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis() {
    const { orient, scale, ticks, tickSizeOuter } = this.props;

    const axis = d3AxisBottom()
      .scale(scale)
      .tickSizeOuter(tickSizeOuter)
      .ticks(ticks);
      
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

export default XAxis;
