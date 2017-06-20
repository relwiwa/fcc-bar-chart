import React from 'react';

const AxisLegend = (props) => {
  const { legend, margins } = props;

  return (
    <text
      className="hide-for-small-only"
      transform={'rotate(-90)'}
      y={margins.left + 15}
      x={-margins.top}
      style={{fontSize: 14 + 'px', textAnchor: 'end'}}
      >{legend}
    </text>
  );
}

export default AxisLegend;
