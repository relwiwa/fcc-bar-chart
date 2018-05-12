import React, { Component } from 'react';
import { scaleTime, scaleLinear } from 'd3-scale';
import { select as d3Select } from 'd3-selection';

import D3ChartComponents from './d3-chart-components';
import NonD3ChartComponents from './non-d3-chart-components';

class ChartContainer extends Component {
  constructor(props) {
    super(props);

    const { containerWidth, chartSpex: { margins, ratioFactor } } = props;

    this.state = {
      chartHeight: this.calculateChartHeight(containerWidth, margins, ratioFactor),
      chartWidth: this.calculateChartWidth(containerWidth, margins),
    };
  }

  // Update state in response to a props change
  componentWillReceiveProps(nextProps) {
    const { containerWidth, gdpData } = this.props;

    if (containerWidth !== nextProps.containerWidth) {
      const { containerWidth, chartSpex: { margins, ratioFactor } } = nextProps;
      this.setChartDimensions(containerWidth, margins, ratioFactor);
    }
  }

  calculateChartHeight(containerWidth, margins, ratioFactor) {
    return containerWidth * ratioFactor;
  }

  calculateChartWidth(containerWidth, margins) {
    return containerWidth;
  }

  setChartDimensions(containerWidth, margins, ratioFactor) {
    this.setState({
      chartHeight: this.calculateChartHeight(containerWidth, margins, ratioFactor),
      chartWidth: this.calculateChartWidth(containerWidth, margins),
    });
  }

  render() {
    const { chartSpex, currGdpDatum, gdpData, maxMinValues, onUpdateCurrGdpDatum, styleSpex } = this.props;
    const { chartHeight, chartWidth } = this.state;

    return (
      <div style={{position: 'relative'}}>
        <svg style={{border: '1px solid ' + styleSpex.colorBorders}} height={chartHeight} width={chartWidth - 2}>
          {gdpData.length > 0 && <D3ChartComponents
            chartHeight={chartHeight}
            chartWidth={chartWidth}
            chartSpex={chartSpex}
            gdpData={gdpData}
            maxMinValues={maxMinValues}
            onUpdateCurrGdpDatum={onUpdateCurrGdpDatum}
            styleSpex={styleSpex}
          />}
        </svg>
        <NonD3ChartComponents
          chartHeight={chartHeight}
          chartWidth={chartWidth}
          currGdpDatum={currGdpDatum}
          margins={chartSpex.margins}
        />
      </div>
    );
  }

}

export default ChartContainer;
