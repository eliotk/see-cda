import React from 'react';
import ReactDOM from 'react-dom';


const app = {
  init: function(container, store) {
    ReactDOM.render(
      <div>
        <pre>{JSON.stringify(store.get().bbCcdaObj.data, null, 2)}</pre>
      </div>,
      container
    )
  }
}

export default app;
