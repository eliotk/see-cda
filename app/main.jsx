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
      'appEntryClass': CcdaLoader,
      'requiresData': false,
      'description': 'Load in new C-CDA documents'
    },
    {
      'name': 'Timeline',
      'key': 'timeline',
      'appEntryClass': Timeline,
      'requiresData': true,
      'description': "Explore a timeline of the C-CDA data. You can use ALT+Scroll to zoom in and out of timeline. Click on events to show more details."
    },
    {
      'name': 'Raw JSON Viewer',
      'key': 'rawJsonViewier',
      'appEntryClass': RawJsonViewer,
      'requiresData': true,
      'description': 'View a JSON representation of the document. Intended mainly for development.'
    }
    // {
    //   'name': 'Result Trends',
    //   'key': 'metrics'
    // },
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
