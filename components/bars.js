import React, { Component } from 'react';

import '../styles/bars.scss';

const Bars = (props) => {
  const { barWidth, chartHeight, gdpData, margins, onUpdateCurrGdpDatum, styleSpex, xScale, yScale } = props;

  return (
    <g className="bars">
      {gdpData.map(datum => {
        return (
          <rect
            className="bar"
            fill={styleSpex.colorBars}
            height={chartHeight - margins.bottom - yScale(datum.gdpAmount)}
            key={datum.year + datum.quarter}
            onMouseEnter={() => onUpdateCurrGdpDatum(datum)}
            onMouseLeave={() => onUpdateCurrGdpDatum(null)}
            width={barWidth}
            x={xScale(datum.dateObject)}
            y={yScale(datum.gdpAmount)}
          />
        );
      })}
    </g>
  );
}

export default Bars;
