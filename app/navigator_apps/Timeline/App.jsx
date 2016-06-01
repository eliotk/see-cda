import React from 'react';
import vis from 'vis';
import visCss from 'vis/dist/vis.min.css';
import visOverflowCss from './overflow-event-text.css';
import isEmpty from 'lodash/isEmpty';
import Filters from './Filters.js';
import { Grid, Row, Col, Modal, Button } from 'react-bootstrap';
import Freezer from 'freezer-js';
import Plottable from 'plottable';
import plottableCss from 'plottable/plottable.css';
import { generateVisEvents, generateVisGroups } from './utils.js';
import lunr from 'lunr';

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
      eventDetails: {}
    };

    if( !isEmpty(bbCcdaObj) ) {
      let eventDataSet = new vis.DataSet({});

      this.state.ccdaPresent = true;
      this.state.visEvents = generateVisEvents(bbCcdaObj);

      eventDataSet.add(this.state.visEvents);
      this.state.eventDataSet = eventDataSet;

      this.state.searchIndex = this.buildSearchIndex();

      this.state.visGroups = generateVisGroups(this.state.visEvents);
      timelineStore.get().set('visGroups', this.state.visGroups)

      this.updateVisEventsWithGroupId();
    }
  }

  buildSearchIndex() {
    let idx = lunr(function () {
      this.field('content', { boost: 10 })
      this.field('group_name')
      this.field('product.code')
      this.field('code')
    });

    this.state.visEvents.map((event, key) => {
      if(!event.id) {
        event.id = key;
      };

      idx.add(event);
    });

    return idx;
  };

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
    dragbox.movable(true);

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

    this.setState({
      brushChart: {
        dragbox: dragbox,
        xScale: xScale
      }
    });
  }

  timelineSelected() {
    const eventDetails = this.state
                          .timeline
                          .itemsData
                          .get(this.state.timeline.getSelection()[0]);

    this.setState({
      eventDetails
    });
  };

  eventDetailsClosed() {
    this.setState({
      eventDetails: {}
    });
  };

  timelineClicked() {
    if (this.state.timeline.getSelection() < 1) {
      this.setState({
        eventDetails: {}
      });
    };
  }

  timelineRangeChange(rangeProperties) {
    if(rangeProperties.byUser == true) {
      const xMin = this.state.brushChart.xScale.scale(rangeProperties.start);
      const xMax = this.state.brushChart.xScale.scale(rangeProperties.end);
      this.state.brushChart.dragbox.bounds({
        topLeft: { x: xMin, y: 0 },
        bottomRight: { x: xMax, y: 0 }
      });
    };
  }

  componentDidMount() {
    const timelineOptions = {
      zoomKey: 'altKey',
      zoomMin: 172800000
    };
    console.log(this.state.visEvents);

    let timeline = new vis.Timeline(document.getElementById('timeline-container'), this.state.visEvents, this.state.visGroups, timelineOptions);
    timeline.on('select', this.timelineSelected.bind(this));
    timeline.on('click', this.timelineClicked.bind(this));
    timeline.on('rangechange', this.timelineRangeChange.bind(this));

    this.setState({
      timeline: timeline,
      eventDataSet: timeline.itemsData
    });

    this.renderDragChart();

    timelineStore.on('update', ()=> { this.forceUpdate() });
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

  render() {
    let warningText;
    if (!this.state.ccdaPresent) {
      warningText = 'No CCDA loaded'
    };

    return(
      <div>
        <h4>{warningText}</h4>
        <Grid fluid={true} style={{width: '100%', paddingLeft: '0px', paddingRight: '0px'}}>
          <Row>
            <Col xs={12} md={9}>
              <div id="timeline-container"></div>
            </Col>
            <Col xs={6} md={3}>
            <Filters
              visGroups={this.state.visGroups}
              timelineStore={timelineStore}
              eventDetails={this.state.eventDetails}
              timeline={this.state.timeline}
              searchIndex={this.state.searchIndex}
              eventDataSet={this.state.eventDataSet}
              eventDetailsClosed={this.eventDetailsClosed.bind(this)}/></Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default App;
