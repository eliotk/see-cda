import React from 'react';
import ReactDOM from 'react-dom';
import CcdaLoader from './CcdaLoader.js';

const app = {
  init: function(container, store) {
    ReactDOM.render(
      <CcdaLoader store={store} />,
      container
    )
  }
}

export default app;
