import React from 'react';
import ReactDOM from 'react-dom';
import Freezer from 'freezer-js';
import App from './components/App.jsx';

// load individual apps
import CcdaLoader from './navigator_apps/CcdaLoader/main.js';
import RawJsonViewer from './navigator_apps/RawJsonViewer/main.js';
import Timeline from './navigator_apps/Timeline/main.js';

let store = new Freezer({
  bbCcdas: [],
  activeCcdas: {},
  bbCcdaObj: {},
  apps: [
    {
      'name': 'Document Loader',
      'key': 'ccdaLoader',
      'appEntryClass': CcdaLoader
    },
    {
      'name': 'Raw JSON Viewer',
      'key': 'rawJsonViewier',
      'appEntryClass': RawJsonViewer
    },
    {
      'name': 'Timeline',
      'key': 'timeline',
      'appEntryClass': Timeline
    },
    {
      'name': 'Result Trends',
      'key': 'metrics'
    },
  ],
});
store.get().set( 'selectedApp', store.get().apps[0] );

if (localStorage.getItem('bbCcdaObj')) {
  store.get().bbCcdaObj.set({ data: JSON.parse(localStorage.getItem('bbCcdaObj')) });
}

store.on('ccda:load', (bbCcdaObj) => {
  store.get().bbCcdaObj.set( bbCcdaObj );

  // save in local storage
  localStorage.setItem('bbCcdaObj', JSON.stringify( bbCcdaObj.data ));
});

store.on('app:selected', (appKey) => {
  console.log(appKey);
  const app = store.get().apps.find(app => app.key === appKey)
  store.get().set('selectedApp', app);
});

ReactDOM.render(<App store={store} />, document.getElementById('app'));
