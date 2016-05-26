import React from 'react';
import { ButtonGroup, Button, Panel } from 'react-bootstrap';
import CheckboxGroup from 'react-checkbox-group';

export default class Filters extends React.Component {
  constructor(props) {
    super(props);
    let visGroupArray = [];
    this.props.visGroups.map((group, idx) => {
      visGroupArray.push(group.content);
    });

    this.state = {
      visGroupArray: visGroupArray,
      visGroups: this.props.visGroups // set the visgroups as state to preserve the original
    }
  }

  visGroupFilterChanged(newVisGroupArray) {
    let filteredVisGroup = [];

    filteredVisGroup = this.state.visGroups.filter((visGroup) => {
      return newVisGroupArray.indexOf(visGroup.content) > -1;
    });

    this.props.timelineStore.trigger('filters:visGroupFilterUpdated', filteredVisGroup);

    this.setState(
      {
        visGroupArray: newVisGroupArray
      }
    );
  }

  componentDidMount() {
  }

  render() {
    return(
      <Panel header="Filters">
        Search <input type="text" />
        <br />
        <h5>Active Event Types</h5>
        <CheckboxGroup name="fruits" value={this.state.visGroupArray} onChange={this.visGroupFilterChanged.bind(this)}>
          {
            Checkbox => (
              <div>
                {this.state.visGroups.map((group, idx) => {
                  return <div><label><Checkbox value={group.content} checked /> {group.content}</label></div>;
                })}
              </div>
            )
          }
        </CheckboxGroup>
        <h5>Time Range</h5>
        <svg id="brushChart" style={{width: '300px' }}></svg>
      </Panel>
    )
  }
}
