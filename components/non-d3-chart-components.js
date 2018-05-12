import React, { Component } from 'react';

import BackgroundTooltip from './background-tooltip';

const NonD3ChartComponents = (props) => {
  const { currGdpDatum } = props;

  return (
    <div className="non-d3-chart-components" style={{position: 'absolute', top: 0, left: 0}}>
      {currGdpDatum !== null && <BackgroundTooltip
        {...props}
      />}
    </div>
  );
};

export default NonD3ChartComponents;
