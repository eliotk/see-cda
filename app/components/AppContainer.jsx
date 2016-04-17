import React from 'react';

var AppContainer = React.createClass({
  getInitialState: function() {
    return {
      selectedAppName: 'No app selected'
    };
  },

  componentWillReceiveProps: function(nextProps) {
    const selectedApp = nextProps.store.get().selectedApp;
    this.setState({
      selectedAppName: selectedApp.name
    });

    selectedApp.appEntryClass.init(document.getElementById('app-container'), this.props.store);
  },


  render: function() {
    //  <!-- <h4>{this.state.selectedAppName}</h4> -->
    return (
      <div style={{padding: '10px'}}>
        <div id="app-container"></div>
      </div>
    )
  }
});

export default AppContainer;
