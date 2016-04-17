import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.jsx';

const app = {
  init: function(container, store) {
    ReactDOM.render(
      <App store={store} />,
      container
    )
  }
}

export default app;
