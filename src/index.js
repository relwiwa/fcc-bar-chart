import es6Promise from 'es6-promise';
es6Promise.polyfill();

import React from 'react';
import { render } from 'react-dom';

import './global-styles.scss';
import UsGdpChart from './components/us-gdp-chart';

render(
  <UsGdpChart />,
  document.getElementById('root')
);
