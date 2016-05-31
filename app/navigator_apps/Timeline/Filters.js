import React from 'react';
import { ButtonGroup, Button, Panel, Well } from 'react-bootstrap';
import CheckboxGroup from 'react-checkbox-group';
import isEmpty from 'lodash/isEmpty';
import moment from 'moment';

const eventDetailStyles = {
  backgroundColor: '#FFF785',
  overflow: 'auto',
  height: '300px'
}

export default class Filters extends React.Component {
  constructor(props) {
    super(props);
    let visGroupArray = [];
    this.props.visGroups.map((group, idx) => {
      visGroupArray.push(group.content);
    });

    this.state = {
      visGroupArray: visGroupArray,
      visGroups: this.props.visGroups, // set the visgroups as state to preserve the original
      showEventDetails: false
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


  componentWillReceiveProps(nextProps) {
    const showEventDetails = isEmpty(nextProps.eventDetails) ? false : true;

    this.setState({
      showEventDetails
    });
  };

  convertObjectToListItems(obj) {
    let listItems;

    if(typeof obj == 'object' && !isEmpty(obj)) {
      listItems = Object.keys(obj).map((key) =>  {
        const val = obj[key];

        if(val instanceof Date) {
          return <li key={key}>{key}: {moment(val).format('YYYY-MM-DD')}</li>;
        } else if(typeof val == 'object') {
          return <li key={key}>{key}: {this.convertObjectToListItems(val)}</li>;
        } else {
          return <li key={key}>{key}: {val}</li>;
        };
      });
    };


    return <ul>{listItems}</ul>;
  };

  hideEventDetails() {
    this.setState({
      showEventDetails: false
    });
  }

  searchUpdated(event) {
    console.log('here');
    if(event.target.value) {
      const results = this.props.searchIndex.search(event.target.value);

      const newTimelineDataset = results.map((result) => {
        return this.props.eventDataSet.get(result.ref);
      });

      this.props.timeline.setItems(newTimelineDataset);
    } else {
      this.props.timeline.setItems(this.props.eventDataSet);
    };

    this.props.timeline.fit();
  };

  render() {
    let eventDetails = (<Well bsSize="small" style={eventDetailStyles}>
      <div style={{float: 'right'}}>[ <a onClick={this.hideEventDetails.bind(this)}>close</a> ]</div>
      <h4>{this.props.eventDetails.content}</h4>
      {this.convertObjectToListItems(this.props.eventDetails)}
    </Well>);

    // <Well bsSize="small" style={eventDetailStyles}>{eventDetails}</Well>
    // {this.state.showEventDetailModal ? eventDetails : null}
    return(
      <div>
        {this.state.showEventDetails ? eventDetails : null}
        <Panel header="Filters">
          Search <input type="text" onChange={this.searchUpdated.bind(this)} />
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
      </div>
    )
  }
}
