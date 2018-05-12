import React, { Component } from 'react';
import { select as d3Select } from 'd3-selection';

import '../styles/axis.scss';

class Axis extends Component {
  componentDidMount() {
    this.calculateAxis();
  }

  componentDidUpdate() {
    this.calculateAxis();    
  }

  /** @name calculateAxis
   *  @description
   *  -  Assignment of axis happens in D3, not React cosmos
   *  -  If D3 axis markup and calculation was translated to JSX,
   *     this could be a stateless functional component; but for
   *     now, lifecycle methods are needed */
  calculateAxis() {
    const { axisFunction, orient, scale, tickFormat, ticks, tickSizeOuter } = this.props;

    let axis = axisFunction()
      .scale(scale)
      .tickSizeOuter(tickSizeOuter)
      .ticks(ticks);

    if (tickFormat) {
      axis = axis.tickFormat(tickFormat);
    }
      
    d3Select(this.axisElement).call(axis)
  }

  render() {
    const { orient, translate } = this.props;

    return (
      <g
        style={{fontSize: '11px'}}
        className={`axis axis-${orient}`}
        ref={(el) => { this.axisElement = el; }}
        transform={translate}
      />
    )
  }
}

export default Axis;
