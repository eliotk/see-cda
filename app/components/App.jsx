import React from 'react';
import NavBar from './NavBar.jsx';
import AppContainer from './AppContainer.jsx';
import { Panel, Well } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';

const verticalAlign = {
  justifyContent: 'center'
}

var App = React.createClass({
  componentDidMount: function(){
    this.props.store.on('update', ()=> { this.forceUpdate() });
  },

  render: function() {
    let ccdaSummary;
    const bbCcdaObj = this.props.store.get().bbCcdaObj.toJS(); // need to call toJS here because stringify'ing that object doesn't work because of special freezerjs addition
    if(!isEmpty(bbCcdaObj)) {
      ccdaSummary = bbCcdaObj.data.document.title + ' - ' + bbCcdaObj.data.demographics.name.family + ', ' + bbCcdaObj.data.demographics.name.given[0];
    } else {
      ccdaSummary = 'None loaded';
    };

    return (
      <div>
        <div style={{display: 'flex', padding: '20px', backgroundColor: 'lightblue', alignItems: 'center'}}>
          <h1 style={{margin: '0px', padding: '0px', flex: 1}}>see-cda</h1>
          <Panel style={{margin: '0px', padding: '0px', flex: 2}}>
            <h4>Current Document: <span style={{fontWeight: 'normal'}}>{ccdaSummary}</span></h4>
          </Panel>
        </div>
        <div style={{ margin: '20px' }}>
          <NavBar apps={this.props.store.get().apps} store={this.props.store} />
          <AppContainer store={this.props.store} />
        </div>
      </div>
    )
  }
});

export default App;
