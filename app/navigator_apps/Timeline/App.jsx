import React from 'react';
import vis from 'vis';
import visCss from 'vis/dist/vis.min.css';
import isEmpty from 'lodash/isEmpty';
import Filters from './Filters.js';
import { Grid, Row, Col, Modal, Button } from 'react-bootstrap';
import Freezer from 'freezer-js';
import Plottable from 'plottable';
import plottableCss from 'plottable/plottable.css';

let timelineStore = new Freezer({
  filters: {},
  visGroups: []
});

// or should this be visGroupFilterUpdated ?
timelineStore.on('filters:visGroupFilterUpdated', (visGroups) => {
  timelineStore.get().set('visGroups', visGroups);
});

class App extends React.Component {
  constructor(props) {
    super(props);
    const bbCcdaObj = this.props.store.get().bbCcdaObj.toJS();

    this.state = {
      bbCcdaObj: bbCcdaObj,
      ccdaPresent: false,
      visEvents: [],
      visGroups: {},
      showEventDetailModal: false,
      eventDetails: {
        content: ''
      }
    };

    if( !isEmpty(bbCcdaObj) ) {
      this.state.ccdaPresent = true;
      this.state.visEvents = this.generateVisEvents(bbCcdaObj);

      this.state.visGroups = this.generateVisGroups(this.state.visEvents);
      timelineStore.get().set('visGroups', this.state.visGroups)

      this.updateVisEventsWithGroupId();
    }
  }

  updateVisEventsWithGroupId() {
    const updatedVisEvents = this.state.visEvents.map((event) => {
      this.state.visGroups.map((group) => {
        if(group.content == event.group_name) {
          event.group = group.id;
        }
      });

      return event;
    });

    this.state.visEvents = updatedVisEvents;
  }

  generateVisEvents(bbCcdaObj) {
    var encounterEvents = bbCcdaObj.data.encounters.filter(function(encounter) {
      encounter.start = encounter.date;
      encounter.group_name = 'Encounters';
      encounter.content = encounter.name;

      if(encounter.date) {
        return encounter;
      };
    });

    var immunizationEvents = bbCcdaObj.data.immunizations.filter(function(immunization) {
      immunization.content = immunization.product.name;
      immunization.start = immunization.date;
      immunization.group_name = 'Immunizations';

      if(immunization.conten) {
        return immunization;
      }
    });

    var medicationEvents = bbCcdaObj.data.medications.filter(function(item) {
      item.content = item.product.name;
      item.start = item.date_range.start;
      item.end = item.date_range.end;
      item.group_name = 'Medications';

      if(item.start) {
        return item;
      };
    });

    var problemEvents = bbCcdaObj.data.problems.map(function(item) {
      item.content = item.name;
      item.start = item.date_range.start;
      item.end = item.date_range.end;
      item.group_name = 'Problems';
      return item;
    });

    var procedureEvents = bbCcdaObj.data.procedures.filter(function(item) {
      item.content = item.name;
      item.start = item.date;
      item.group_name = 'Procedures';

      if(item.start) {
        return item;
      };
    });

    return encounterEvents.concat(immunizationEvents).concat(medicationEvents).concat(problemEvents).concat(procedureEvents);
  }

  generateVisGroups(visEvents) {
    let unique = {};
    let distinct = [];

    visEvents.map((event, idx) => {
      if(event.start == null) {
        console.log(event);
      }

      if(event.content == null) {
        console.log(event);
      }


      if( typeof(unique[event.group_name]) == "undefined" && typeof event.group_name !== "undefined"){
        distinct.push({ id: parseInt(idx), content:event.group_name });
      }
      unique[event.group_name] = 0;
    });

    return distinct;
  };

  renderDragChart() {
    var xScale = new Plottable.Scales.Time();
    var yScale = new Plottable.Scales.Linear();
    var xAxis = new Plottable.Axes.Numeric(xScale, "bottom");
    var yAxis = new Plottable.Axes.Numeric(yScale, "left");

    xAxis.formatter(Plottable.Formatters.multiTime());

    var data = [];

    this.state.visEvents.map((visEvent) => {
      const chartDate = visEvent.date == undefined ? visEvent.date_range.start : visEvent.date;

      data.push({
        'x': new Date(chartDate),
        'y': 100
      });
    });

    var plot = new Plottable.Plots.Bar()
      .x(function(d) { return d.x; }, xScale)
      .y(function(d) { return d.y; }, yScale)
      .addDataset(new Plottable.Dataset(data));


    plot.attr('width', 2);

    var dragbox = new Plottable.Components.XDragBoxLayer();

    dragbox.onDrag((box) => {
      plot.selections().attr("fill", "#5279c7");
      plot.entitiesIn(box).forEach(function(entity) {
        d3.select(entity.selection[0][0]).attr("fill", "#FD373E");
      });

      var min = xScale.invert(box.topLeft.x);
      var max = xScale.invert(box.bottomRight.x);

      if (min.toString() === max.toString()) {
        this.state.timeline.setWindow(xScale.domainMin(), xScale.domainMax());
      } else {
        this.state.timeline.setWindow(min, max);
      }
    });

    var yLabel = new Plottable.Components.Label("Hello World!")
      .angle(-90)
      .yAlignment("center");


    // was yAxis

    new Plottable.Components.Table([
      [null, new Plottable.Components.Group([dragbox, plot])],
      [null, xAxis]
    ]).renderTo("svg#brushChart");

    // window.addEventListener("resize", function () {
    //   plot.redraw();
    // });
  }

  timelineSelected() {
    const eventDetails = this.state
                          .timeline
                          .itemsData
                          .get(this.state.timeline.getSelection()[0]);

    this.setState({
      showEventDetailModal: true,
      eventDetails: eventDetails
    });
  };

  componentDidMount() {
    timelineStore.on('update', ()=> { this.forceUpdate() });
    const timelineOptions = {
      zoomKey: 'altKey'
    };

    this.state.visEvents.map((event) => {
    });

    let timeline = new vis.Timeline(document.getElementById('timeline-container'), this.state.visEvents, this.state.visGroups, timelineOptions);
    timeline.on('select', this.timelineSelected.bind(this));

    this.setState({ timeline: timeline });
      // console.log(this.itemsData.get(this.getSelection()[0]));
      // this.setState({showEventDetailModal: true});
      // console.log(this.itemSet.getItems().get(properties.items[0]));
      // var additional_info_text, item;
      // item = items.get(properties.items[0]);
      // additional_info_text = JSON.stringify(item, null, 2);
    // });

    // need to add timeline event handlers here
    // timeline.on('select', function(properties) {
    //   var additional_info_text, item;
    //   item = items.get(properties.items[0]);
    //   additional_info_text = JSON.stringify(item, null, 2);
    //   document.querySelector('#additional_info').style.display = "block";
    //   document.querySelector('#additional_info_text').innerHTML = additional_info_text;
    // });
    //
    // timeline.on('click', function(properties) {
    //   console.log(this.getSelection());
    //   if (this.getSelection().length < 1) {
    //    document.querySelector('#additional_info').style.display = "none";
    //   }
    // });

    this.renderDragChart();
  }

  componentWillUpdate() {
    if(this.state.timeline && this.shouldTimelineUpdate()) {
      this.state.timeline.setGroups(timelineStore.get().visGroups);
    };
  }

  shouldTimelineUpdate() {
    return timelineStore.get().visGroups.length !== this.state.timeline.groupsData.length;
  }

  handleButtonClick(e) {
    debugger;
  }

  hideEventDetailModal() {
    this.setState({
      showEventDetailModal: false
    });
  }

  render() {
    let warningText;
    if (!this.state.ccdaPresent) {
      warningText = 'No CCDA loaded'
    };

    return(
      <div>
        <h4>{warningText}</h4>
        <Modal
          {...this.props}
          show={this.state.showEventDetailModal}
          dialogClassName="custom-modal"
          animation={false}
          keyboard={true}
          onHide={this.hideEventDetailModal.bind(this)}
        >
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-lg">Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h4>{this.state.eventDetails.content}</h4>
            {JSON.stringify(this.state.eventDetails)}
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.hideEventDetailModal.bind(this)}>Close</Button>
          </Modal.Footer>
        </Modal>
        <Grid fluid={true} style={{width: '100%', paddingLeft: '0px', paddingRight: '0px'}}>
          <Row>
            <Col xs={12} md={9}>
              <div id="timeline-container"></div>
            </Col>
            <Col xs={6} md={3}><Filters visGroups={this.state.visGroups} timelineStore={timelineStore} /></Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default App;
