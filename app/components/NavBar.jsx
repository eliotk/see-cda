import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';

export default React.createClass({
  getInitialState: function() {
    return {activeKey: this.props.store.get().currentApp};
  },

  handleSelect(selectedKey) {
    this.setState({ 'activeKey': selectedKey });
    this.props.store.trigger('app:selected', selectedKey);
  },

  render() {
    return (
      <Nav bsStyle="tabs" activeKey={this.state.activeKey} onSelect={this.handleSelect}>
        {this.props.apps.map(function (app, idx) {
          return <NavItem key={idx} eventKey={app.key}>{app.name}</NavItem>
        })}
      </Nav>
    );
  }
});
