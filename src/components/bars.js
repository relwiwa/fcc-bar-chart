import React, { Component } from 'react';
import { scaleLinear } from 'd3-scale';

import '../styles/bars.scss';

const Bars = (props) => {
  const { barWidth, data, margins, onUpdateCurrBar, svgDimensions: { height, width }, xScale, yScale } = props;

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
          width={barWidth}
          onMouseEnter={onUpdateCurrBar !== null ? () => onUpdateCurrBar(datum) : null}
          onMouseLeave={onUpdateCurrBar !== null ? () => onUpdateCurrBar(null) : null}
        />
      )})}
    </g>
  );
}

export default Bars;
