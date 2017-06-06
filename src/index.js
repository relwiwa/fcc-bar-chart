import React from 'react';
import { render } from 'react-dom';

import './global-styles.scss';
import UsGdpBarChart from './components/us-gdp-bar-chart';

render(
  <UsGdpBarChart />,
  document.getElementById('root')
);
