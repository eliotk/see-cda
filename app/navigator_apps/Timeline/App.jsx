import React from 'react';
import vis from 'vis';
import css from 'vis/dist/vis.min.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    var data = [
      {id: 1, content: 'item 1', start: '2013-04-20'},
      {id: 2, content: 'item 2', start: '2013-04-14'},
      {id: 3, content: 'item 3', start: '2013-04-18'},
      {id: 4, content: 'item 4', start: '2013-04-16', end: '2013-04-19'},
      {id: 5, content: 'item 5', start: '2013-04-25'},
      {id: 6, content: 'item 6', start: '2013-04-27'}
    ];
    var timeline = new vis.Timeline(document.getElementById('timeline-container'), data, {});
  }

  render() {
    return(
      <div>
        <div>Timeline!</div>
        <div id="timeline-container"></div>
      </div>
    )
  }
}

export default App;
