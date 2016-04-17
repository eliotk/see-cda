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
    let ccdaSummary;
    const bbCcdaObj = this.props.store.get().bbCcdaObj;
    debugger;
    if(!isEmpty(bbCcdaObj)) {
      ccdaSummary = bbCcdaObj.data.document.title + ' - ' + bbCcdaObj.data.demographics.name.family + ', ' + bbCcdaObj.data.demographics.name.given[0];
    } else {
      ccdaSummary = 'Nothing loaded';
    };
    return(
      <div style={{display: 'flex'}}>
        <form style={{width: '400px'}}>
          <Input type="textarea" label="CCDA XML String" placeholder="Paste CCDA file contents here" ref="ccdaStringInput" />
          <Input type="file" label="File" help="Or select a file" />
          <Button bsStyle="primary" onClick={this.loadCcda.bind(this)}>Load</Button>
        </form>
        <Well style={{marginLeft: '20px', width: '100%'}}>
          <h4>Current CCDA</h4>
          <p>{ccdaSummary}</p>
        </Well>
      </div>
    )
  }
};

export default CcdaLoader;
