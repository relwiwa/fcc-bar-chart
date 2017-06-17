/*  Responsive D3 Bar Chart within React, adapted from:
    - https://blog.webkid.io/responsive-chart-usability-d3/
    - https://medium.com/@caspg/responsive-chart-with-react-and-d3v4-afd717e57583
    - http://busypeoples.github.io/post/d3-with-react-js/ */

import React, { Component } from 'react';

import BarChart from './bar-chart';

import usGdpData from '../data/us-gdp-data.json';

class UsGdpBarChart extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chartWidth: null,
    };

    this.calculateWidth = this.calculateWidth.bind(this);
  }

  componentDidMount() {
    this.calculateWidth();
    addEventListener('resize', this.calculateWidth);
  }

  componentWillUnmount() {
    removeEventListener('resize', this.calculateWidth);
  }

  calculateWidth () {
    this.setState({
      chartWidth: this.chartContainer.getBoundingClientRect().width,
    });
  }

  prepareData(data) {
    let newData = [];
    data.map((datum) => {
      let newDatum = [];
      newDatum[0] = new Date(datum[0]);
      newDatum[1] = datum[1];
      newData.push(newDatum);
    });
    return newData;
  };

  render() {
    const { chartWidth } = this.state;

    return (
      <div className="us-gdp-bar-chart row">
        <div ref={(el) => { this.chartContainer = el }} className="column small-12">
          <h1 className="text-center">Growth of US GDP</h1>
          {chartWidth && <BarChart
            chartWidth={chartWidth}
            data={this.prepareData(usGdpData.data)}
          />}
        </div>
      </div>
    );
  }
};

export default UsGdpBarChart;
