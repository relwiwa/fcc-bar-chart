import { colors } from '../../../config/styles';

const SPEX = {
  dataUrl: 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',
  chart: {
    margins: {
      top: 10,
      right: 20,
      bottom: 30,
      left: 35
    },
    ratioFactor: 0.6,
    xAxis: {
      ticks: 5,
      tickSizeOuter: 0
    },
    yAxis: {
      ticks: 8,
      tickSizeOuter: 0
    },
  },
  styles: {
    colorBars: colors.primary,
  },
};

export default SPEX;
