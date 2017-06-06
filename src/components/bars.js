import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';

import '../styles/bars.scss';

class Bars extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, margins, svgDimensions: { height, width }, xScale, yScale } = this.props;

    return (
      <g>
        {data.map(datum => {
          return (
          <rect
            className="bar"
            key={datum[0]}
            x={xScale(datum[0])}
            y={yScale(datum[1])}
            height={height - margins.bottom - yScale(datum[1])}
            width={width/data.length + 1}
          />
        )})}
      </g>
    );
  }
}

export default Bars;
