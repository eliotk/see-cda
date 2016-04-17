import React from 'react';
import ReactDOM from 'react-dom';
import Freezer from 'freezer-js';
import App from './components/App.jsx';

// load individual apps
import RawJsonViewer from './navigator_apps/RawJsonViewer/main.js';
import Timeline from './navigator_apps/Timeline/main.js';

let store = new Freezer({
  bbCcdas: [],
  activeCcdas: {},
  bbCcdaObj: {},
  apps: [
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
      'name': 'Metrics',
      'key': 'metrics'
    },
  ],
  selectedApp: {
    'name': 'Raw JSON Viewer',
    'key': 'rawJsonViewier',
    'appEntryClass': RawJsonViewer
  }
});

store.on('ccda:load', (bbCcdaObj) => {
  store.get().bbCcdaObj.set( bbCcdaObj );
  console.log(bbCcdaObj);
  // console.log(notification);
  // this.setState({ notification });
  // setTimeout(() => {
  //   this.setState({ notification: '' });
  // }, 3000);
});

store.on('app:selected', (appKey) => {
  console.log(appKey);
  const app = store.get().apps.find(app => app.key === appKey)
  store.get().set('selectedApp', app);
});

ReactDOM.render(<App store={store} />, document.getElementById('app'));
