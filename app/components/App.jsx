import React from 'react';
import CcdaLoader from './CcdaLoader.js';
import NavBar from './NavBar.jsx';
import AppContainer from './AppContainer.jsx';
import { Panel } from 'react-bootstrap';

var App = React.createClass({
  componentDidMount: function(){
    this.props.store.on('update', ()=> { this.forceUpdate() });
  },

  render: function() {
    const bbCcdaObj = this.props.store.get().bbCcdaObj.toJS(); // need to call toJS here because stringify'ing that object doesn't work because of special freezerjs addition
    console.log(bbCcdaObj);
    return (
      <div>
        <div style={{display: 'flex', padding: '10px', backgroundColor: 'gold'}}>
          <h1>ccda navigator</h1>
        </div>
        <div style={{ margin: '20px' }}>
          <Panel header='CCDA loader'>
            <CcdaLoader store={this.props.store} />
          </Panel>
          <NavBar apps={this.props.store.get().apps} store={this.props.store} />
          <AppContainer store={this.props.store} />
        </div>
      </div>
    )
  }
});

export default App;
