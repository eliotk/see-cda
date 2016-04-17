import React from 'react';
import ReactDOM from 'react-dom';


const app = {
  init: function(container, store) {
    ReactDOM.render(
      <div store={store}>Hello!</div>,
      container
    )
  }
}

export default app;
