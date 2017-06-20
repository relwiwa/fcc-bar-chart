/*  Responsive D3 Bar Chart within React, adapted from:
    - https://blog.webkid.io/responsive-chart-usability-d3/
    - https://medium.com/@caspg/responsive-chart-with-react-and-d3v4-afd717e57583
    - http://busypeoples.github.io/post/d3-with-react-js/ */

import React, { Component } from 'react';
import axios from 'axios';
import es6Promise from 'es6-promise';

import ChartContainer from './chart-container';

import additionalUsGdpData from '../data/additional-us-gdp-data.json';
import SPEX from '../data/us-gdp-chart.spex';

es6Promise.polyfill();
const axiosConfig = axios.create({
  timeout: 5000
});

class UsGdpChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      containerWidth: null,
      currGdpDatum: null,
      errorMessage: false,
      maxMinValues: {
        maxXValue: null,
        maxYValue: null,
        minXValue: null,
      },
      preparedData: [],
      progressMessage: false,
    };

    this.calculateWidth = this.calculateWidth.bind(this);
  }

  componentDidMount() {
    this.calculateWidth();
    this.getGdpData();
    addEventListener('resize', this.calculateWidth);
  }

  componentWillUnmount() {
    removeEventListener('resize', this.calculateWidth);
  }

  calculateWidth () {
    const containerComputedStyles = getComputedStyle(this.chartContainer);
    const containerDimensions = {
      width: containerComputedStyles['width'],
      paddingLeft: containerComputedStyles['padding-left'],
      paddingRight: containerComputedStyles['padding-right']
    }

    // get rid of 'px'
    for (let property in containerDimensions) {
      containerDimensions[property] = containerDimensions[property].substr(0, containerDimensions[property].length - 2);
    }

    let { paddingLeft, paddingRight, width } = containerDimensions;
    width = width - paddingLeft - paddingRight;
    console.log(getComputedStyle(this.chartContainer)['padding-left']);
    this.setState({
      containerWidth: width,
    });
  }

  getGdpData() {
    this.gdpData = axios.get(SPEX.dataUrl)
    .then(
      data => {
        let gdpData = data.data.data;
        gdpData = gdpData.concat(additionalUsGdpData.data);
        this.prepareData(gdpData);
      },
      error => {
        this.setState({
          errorMessage: true,
          progressMessage: false,
        });
      }
    );
    this.setState({
      progressMessage: true,
    });
  }

  /** @name prepareData
   *  @description
   *  - Prepares data for further usage with D3:
   *  - GDP and Date/Quarter values are prepared
   *  - min/maxX/Y are determined for D3 to create scales */
  prepareData(data) {
    let preparedData = [];
    let minXValue = new Date('2050-01-01');
    let maxXValue = new Date('1900-01-01');
    let maxYValue = 0;

    data.map((datum) => {
      let newDatum = {};
      newDatum.dateObject = new Date(datum[0]);
      newDatum.year = datum[0].substr(0, 4);
      newDatum.quarter = datum[0].substr(5, 2);
      newDatum.gdpAmount = Math.round(datum[1]);
      if (newDatum.quarter === '04') {
        newDatum.quarter = '02';
      }
      else if (newDatum.quarter === '07') {
        newDatum.quarter = '03';
      }
      else if (newDatum.quarter === '10') {
        newDatum.quarter = '04';
      }
      preparedData.push(newDatum);

      if (newDatum.dateObject < minXValue) {
        minXValue = newDatum.dateObject;
      }
      if (newDatum.dateObject > maxXValue) {
        maxXValue = newDatum.dateObject;
      }
      if (newDatum.gdpAmount > maxYValue) {
        maxYValue = newDatum.gdpAmount;
      }
    });

    this.setState({
      maxMinValues: {
        maxXValue: maxXValue,
        maxYValue: maxYValue,
        minXValue: minXValue,
      },
      progressMessage: null,
      currGdpDatum: preparedData[0],
      preparedData: preparedData,
    });
  };

  render() {
    const { containerWidth, currGdpDatum, errorMessage, maxMinValues, preparedData, progressMessage } = this.state;

    return (
      <div className="row">
        <div ref={(el) => this.chartContainer = el} className="column small-12 text-center">
          <h1>Quarterly US GDP</h1>
          <p>This chart displays the quarterly US Gross Domestic Product from January 1947 until January 2017</p>
          {errorMessage && <p>An error happened while fetching data</p>}
          {progressMessage && <p><i className="fa fa-spinner fa-spin"></i> Fetching data</p>}
          {(containerWidth !== null && !errorMessage) && <ChartContainer
            chartSpex={SPEX.chart}
            containerWidth={containerWidth}
            containerHeight={containerWidth * 0.6}
            currGdpDatum={currGdpDatum}
            gdpData={preparedData}
            maxMinValues={maxMinValues}
            onUpdateCurrGdpDatum={(datum) => this.setState({currGdpDatum: datum})}
            styleSpex={SPEX.styles}
          />}
        </div>
      </div>
    );
  }
};

export default UsGdpChart;
