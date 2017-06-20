import React from 'react';
import { format as d3Format } from 'd3-format';

const BackgroundTooltip = (props) => {
  const { chartHeight, chartWidth, currGdpDatum, margins } = props;

  const styles = {
    position: 'absolute',
    top: 0,
    left: 20,
    fontSize: (72 * 0.001 * chartWidth) + 'px',
    textAlign: 'left',
    marginTop: (margins.top * 0.001 * chartHeight) + 'px',
    marginLeft: (margins.left + 30 * 0.001 * chartWidth) + 'px'
  };

  return (
    <div style={styles} className="tooltip">
      <p style={{position: 'absolute', top: 0, left: 0, width: chartWidth / 2}}>
        {d3Format(',.5')(currGdpDatum.gdpAmount)}<br />Billion US-$
      </p>
      <p style={{position: 'absolute', top: chartHeight * 0.5 * 1.1, left: 0}}>{currGdpDatum.quarter + '/' + currGdpDatum.year}</p>
    </div>
  );
}

export default BackgroundTooltip;
