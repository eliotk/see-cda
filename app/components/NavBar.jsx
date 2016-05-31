import React from 'react';
import { Nav, NavItem } from 'react-bootstrap';
import Tooltip from 'rc-tooltip';

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
        {this.props.apps.map(function (app, idx) {
          const tooltip = <Tooltip placement="left" trigger={['click']} overlay={<span>tooltip</span>}>?</Tooltip>;

          return <NavItem key={idx} eventKey={app.key}>{app.name}</NavItem>;
        })}
      </Nav>
    );
  }
});
