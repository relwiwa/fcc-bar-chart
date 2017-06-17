import React from 'react';
import { select as d3Select } from 'd3-selection';

const Tooltip = (props) => {
  const { data, height, marginLeft, marginTop, width } = props;

  const styles = {
    background: 'green',
    fontSize: (48 * 0.001 * width) + 'px',
    position: 'absolute',
    top: 0,
    left: 0,
    textAlign: 'left',
    marginTop: (marginTop) + 'px',
    marginLeft: (marginLeft * 2) + 'px'
  };

  return (
    <div style={styles} className="tooltip">
      <p style={{position: 'absolute', top: 0, left: 0, width: width / 2}}>{Math.round(data[1])}<br />Billion US-$</p>
      <p style={{position: 'absolute', top: height * 0.5 * 1.1, left: 0}}>{data[0].getFullYear()}</p>
    </div>
  );
}

export default Tooltip;
