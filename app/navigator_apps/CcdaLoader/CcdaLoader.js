import React from 'react';
import { Input, Button, Panel, Well } from 'react-bootstrap';
import BlueButton from 'bluebutton';
import isEmpty from 'lodash/isEmpty';

class CcdaLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ccdaStringInput: ''
    };
  }

  loadCcda() {
    const ccdaString = this.refs.ccdaStringInput.refs.input.value;
    const bbCcdaObj = BlueButton(ccdaString);
    this.props.store.trigger('ccda:load', bbCcdaObj);
  }

  render() {
    return(
      <div style={{display: 'flex'}}>
        <form style={{width: '400px'}}>
          <Input type="textarea" label="CCDA XML String" placeholder="Paste CCDA file contents here" ref="ccdaStringInput" style={{height: '200px'}} />
          <Input type="file" label="File" help="Or select a file" />
          <Button bsStyle="primary" onClick={this.loadCcda.bind(this)}>Load</Button>
        </form>
      </div>
    )
  }
};

export default CcdaLoader;
