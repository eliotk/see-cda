import React from 'react';
import { Nav, NavItem, OverlayTrigger, Popover, Button } from 'react-bootstrap';
import isEmpty from 'lodash/isEmpty';

export default React.createClass({
  getInitialState: function() {
    return {activeKey: this.props.store.get().selectedApp.key};
  },

  handleSelect(selectedKey) {
    this.setState({ 'activeKey': selectedKey });
    this.props.store.trigger('app:selected', selectedKey);
  },

  render() {


    return (
      <Nav bsStyle="tabs" activeKey={this.state.activeKey} onSelect={this.handleSelect}>
        {this.props.apps.map((app, idx) => {
          const disabled = app.requiresData ? isEmpty(this.props.store.get().bbCcdaObj.toJS()) : false;

          const popover = (<Popover
                            id="{app.name + 'Popover'}">
                            {app.description}
                          </Popover>);

          const overlay = (<div>
                            <span>{app.name} </span>
                            <OverlayTrigger
                              trigger="hover"
                              placement="bottom"
                              overlay={popover}>
                              <span>(?)</span>
                            </OverlayTrigger>
                          </div>);

          return <NavItem key={idx} eventKey={app.key} disabled={disabled}>{overlay}</NavItem>;
        })}
      </Nav>
    );
  }
});
