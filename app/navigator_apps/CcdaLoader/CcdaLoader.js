import React from 'react';
import { Input, Button, Panel, Well, ButtonGroup } from 'react-bootstrap';
import BlueButton from 'bluebutton';
import isEmpty from 'lodash/isEmpty';

class CcdaLoader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ccdaStringInput: '',
      sampleCcdas: [
        {
          description: 'Community Health and Hospitals: Health Summary - Jones, Myra',
          file: 'sample_ccdas/myra_jones.xml'
        },
        {
          description: 'Mayo Clinic Outpatient Summary-Prelim Rochester Minnesota - BLUE, Test (Many Events)',
          file: 'sample_ccdas/mayo_many_events.xml'
        },
        {
          description: 'Patient Chart Summary - Betterhalf, Eve',
          file: 'sample_ccdas/C-CDA_R2-1_CCD.xml'
        },
        {
          description: 'Summary of Care - Everyman, Adam',
          file: 'sample_ccdas/Final_Task_Force_Full_Sample_R1.1.xml'
        }
      ]
    };
  }

  submitCcda() {
    let ccdaString = this.refs.ccdaStringInput.refs.input.value;
    debugger;

    this.loadCcda(ccdaString);
  };

  loadCcda(ccdaString) {
    // replace v2 ccda w/ v1 documnet code or else bluebuttonjs blows up
    ccdaString = ccdaString.replace('2.16.840.1.113883.10.20.22.1.2', '2.16.840.1.113883.10.20.22.1.1');

    try {
      const bbCcdaObj = BlueButton(ccdaString);
      this.props.store.trigger('ccda:load', bbCcdaObj);
    } catch (e) {
      console.error(e.message);
      alert('There was a problem processing that CDA file. Check the dev tools console for debugging info.');
      // trigger alert
    };
  };

  loadSampleCcda(event) {
    const ccdaKey = event.target.getAttribute('data-key');
    const selectedCcda = this.state.sampleCcdas[ccdaKey];

    var xhr = new XMLHttpRequest();
    xhr.open('get', './' + selectedCcda.file, false);
    xhr.send();

    this.loadCcda(xhr.responseText);
  };

  render() {
    const sampleCcdaButtons = this.state.sampleCcdas.map((ccda, key) => {
      return <Button data-key={key} onClick={this.loadSampleCcda.bind(this)}>{ccda.description}</Button>;
    });

    // disabled file input for now <Input type="file" label="File" ref="ccdaFileInput" help="Or select a file"  />

    return(
      <div style={{display: 'flex'}}>
        <form style={{width: '400px', borderRight: '1px solid #DDDDDD', paddingRight: '20px', marginRight: '20px'}}>
          <Input type="textarea" label="C-CDA XML String" placeholder="Paste C-CDA file contents here" ref="ccdaStringInput" style={{height: '200px'}} />
          <Button bsStyle="primary" onClick={this.submitCcda.bind(this)}>Load</Button>
        </form>
        <div>
          <h5><strong>Or load an existing C-CDA</strong></h5>
          <ButtonGroup vertical block>
            {sampleCcdaButtons}
          </ButtonGroup>
        </div>
      </div>
    )
  }
};

export default CcdaLoader;
