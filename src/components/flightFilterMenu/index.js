import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { setSelectedFlight, setSelectedFlight2 } from '../../modules/searchFlight';
import moment from 'moment';
import formatRp from '../../custom/formatRp';
import { Link } from 'react-router-dom';
import Popover from 'react-popover';
import _ from 'lodash';
import InputRange from 'react-input-range';

class FlightFilterMenu extends React.Component {

  state = {
    seat: {
      E: 'Economy',
      B: 'Business',
      F: 'First Class'
    },
    value: { min: 100000, max: 500000 },
    pop1: false,
    pop2: false,
    pop3: false,
    pop4: false,
    checkedAirline: [],
    checkedTransit: [],
    checkedPrice: [],
    checkedDeparture: [],
    checkedArrival: []
  }

  handleFilterAirline = (name, type, e) => {
    console.log(name, type)
    let checkedAirline = this.state.checkedAirline
    let indexCheckedAirline = checkedAirline.indexOf(name)
    if (indexCheckedAirline == -1) {
      checkedAirline.push(name)
    } else {
      checkedAirline.splice(indexCheckedAirline, 1);
    }
    console.log(name, type, checkedAirline)
    this.setState({
      [name]: !this.state[name],
      checkedAirline
    }, () => { 
      this.props.applyFilter({
        type: type,
        data: checkedAirline
      })
    })

    this.setState({
        price1000: false,
        price1000k: false,
        price500: false,
    })
  }

  handleFilterPrice = (name, e) => {
    //console.log(name)

    this.setState({
      [name]: !this.state[name],
    }, () => { 
      this.props.applyFilter({
        type: 'price',
        data: (this.state[name]) ? this.state.value : 0
      })
    })    
  }

  handleFilterDeparture = (name, e) => {
    //console.log(name)
    let checkedDeparture = this.state.checkedDeparture
    let indexCheckedDeparture = checkedDeparture.indexOf(name)
    if (indexCheckedDeparture === -1) {
      checkedDeparture.push(name)
    } else {
      checkedDeparture.splice(indexCheckedDeparture, 1);
    }

    if (name === 'departure1') {
      this.setState({
        departure2: false,
        departure3: false,
        departure4: false,
        arrival1: false,
        arrival2: false,
        arrival3: false,
        arrival4: false,
      })
      const index = checkedDeparture.indexOf('departure2');
      if (index !== -1) checkedDeparture.splice(index, 1);
      const index2 = checkedDeparture.indexOf('departure3');
      if (index2 !== -1) checkedDeparture.splice(index2, 1);
      const index3 = checkedDeparture.indexOf('departure4');
      if (index3 !== -1) checkedDeparture.splice(index3, 1);
    }

    if (name === 'departure2') {
      this.setState({
        departure1: false,
        departure3: false,
        departure4: false,
        arrival1: false,
        arrival2: false,
        arrival3: false,
        arrival4: false,
      })
      const index = checkedDeparture.indexOf('departure1');
      if (index !== -1) checkedDeparture.splice(index, 1);
      const index2 = checkedDeparture.indexOf('departure3');
      if (index2 !== -1) checkedDeparture.splice(index2, 1);
      const index3 = checkedDeparture.indexOf('departure4');
      if (index3 !== -1) checkedDeparture.splice(index3, 1);
    }

    if (name === 'departure3') {
      this.setState({
        departure1: false,
        departure2: false,
        departure4: false,
        arrival1: false,
        arrival2: false,
        arrival3: false,
        arrival4: false,
      })
      const index = checkedDeparture.indexOf('departure1');
      if (index !== -1) checkedDeparture.splice(index, 1);
      const index2 = checkedDeparture.indexOf('departure2');
      if (index2 !== -1) checkedDeparture.splice(index2, 1);
      const index3 = checkedDeparture.indexOf('departure4');
      if (index3 !== -1) checkedDeparture.splice(index3, 1);
    }

    if (name === 'departure4') {
      this.setState({
        departure1: false,
        departure2: false,
        departure3: false,
        arrival1: false,
        arrival2: false,
        arrival3: false,
        arrival4: false,
      })
      const index = checkedDeparture.indexOf('departure1');
      if (index !== -1) checkedDeparture.splice(index, 1);
      const index2 = checkedDeparture.indexOf('departure2');
      if (index2 !== -1) checkedDeparture.splice(index2, 1);
      const index3 = checkedDeparture.indexOf('departure3');
      if (index3 !== -1) checkedDeparture.splice(index3, 1);
    }

    this.setState({
      [name]: !this.state[name],
      checkedDeparture
    }, () => { 
      this.props.applyFilter({
        type: 'departure',
        data: checkedDeparture
      })
    })
  }

  handleFilterArrival = (name, e) => {
    //console.log(name)
    let checkedArrival = this.state.checkedArrival
    let indexCheckedArrival = checkedArrival.indexOf(name)
    if (indexCheckedArrival === -1) {
      checkedArrival.push(name)
    } else {
      checkedArrival.splice(indexCheckedArrival, 1);
    }

    if (name === 'arrival1') {
      this.setState({
        arrival2: false,
        arrival3: false,
        arrival4: false,
        departure1: false,
        departure2: false,
        departure3: false,
        departure4: false,
      })
      const index = checkedArrival.indexOf('arrival2');
      if (index !== -1) checkedArrival.splice(index, 1);
      const index2 = checkedArrival.indexOf('arrival3');
      if (index2 !== -1) checkedArrival.splice(index2, 1);
      const index3 = checkedArrival.indexOf('arrival4');
      if (index3 !== -1) checkedArrival.splice(index3, 1);
    }

    if (name === 'arrival2') {
      this.setState({
        arrival1: false,
        arrival3: false,
        arrival4: false,
        departure1: false,
        departure2: false,
        departure3: false,
        departure4: false,
      })
      const index = checkedArrival.indexOf('arrival1');
      if (index !== -1) checkedArrival.splice(index, 1);
      const index2 = checkedArrival.indexOf('arrival3');
      if (index2 !== -1) checkedArrival.splice(index2, 1);
      const index3 = checkedArrival.indexOf('arrival4');
      if (index3 !== -1) checkedArrival.splice(index3, 1);
    }

    if (name === 'arrival3') {
      this.setState({
        arrival1: false,
        arrival2: false,
        arrival4: false,
        departure1: false,
        departure2: false,
        departure3: false,
        departure4: false,
      })
      const index = checkedArrival.indexOf('arrival1');
      if (index !== -1) checkedArrival.splice(index, 1);
      const index2 = checkedArrival.indexOf('arrival2');
      if (index2 !== -1) checkedArrival.splice(index2, 1);
      const index3 = checkedArrival.indexOf('arrival4');
      if (index3 !== -1) checkedArrival.splice(index3, 1);
    }

    if (name === 'arrival4') {
      this.setState({
        arrival1: false,
        arrival2: false,
        arrival3: false,
        departure1: false,
        departure2: false,
        departure3: false,
        departure4: false,
      })
      const index = checkedArrival.indexOf('arrival1');
      if (index !== -1) checkedArrival.splice(index, 1);
      const index2 = checkedArrival.indexOf('arrival2');
      if (index2 !== -1) checkedArrival.splice(index2, 1);
      const index3 = checkedArrival.indexOf('arrival3');
      if (index3 !== -1) checkedArrival.splice(index3, 1);
    }

    this.setState({
      [name]: !this.state[name],
      checkedArrival
    }, () => { 
      this.props.applyFilter({
        type: 'arrival',
        data: checkedArrival
      })
    })
  }

  handleFilterTransit = (name, e) => {
    //console.log(name)
    let checkedTransit = this.state.checkedTransit
    let indexCheckedTransit = checkedTransit.indexOf(name)
    if (indexCheckedTransit === -1) {
      checkedTransit.push(name)
    } else {
      checkedTransit.splice(indexCheckedTransit, 1);
    }

    if (name === 'direct') {
      this.setState({
        transit1: false,
        transit2: false,
      })
      const index = checkedTransit.indexOf('transit1');
      if (index !== -1) checkedTransit.splice(index, 1);
      const index2 = checkedTransit.indexOf('transit2');
      if (index2 !== -1) checkedTransit.splice(index2, 1);
    }

    if (name === 'transit1') {
      this.setState({
        direct: false,
        transit2: false,
      })
      const index = checkedTransit.indexOf('direct');
      if (index !== -1) checkedTransit.splice(index, 1);
      const index2 = checkedTransit.indexOf('transit2');
      if (index2 !== -1) checkedTransit.splice(index2, 1);
    }

    if (name === 'transit2') {
      this.setState({
        direct: false,
        transit1: false,
      })
      const index = checkedTransit.indexOf('direct');
      if (index !== -1) checkedTransit.splice(index, 1);
      const index2 = checkedTransit.indexOf('transit1');
      if (index2 !== -1) checkedTransit.splice(index2, 1);
    }

    this.setState({
      [name]: !this.state[name],
      checkedTransit
    }, () => { 
      this.props.applyFilter({
        type: 'transit',
        data: checkedTransit
      })
    })
  }

  render() {
    const { flight, modal, twoway, airAvailability, load, gsaData } = this.props;
    //console.log('av', airAvailability, gsaData)
    let airData = airAvailability.concat(gsaData);
    airData = _.uniqBy(airData, 'code');
    const self = this;
    return (
      <div className={(twoway) ? "filter-btn btn-group pull-right" : "filter-btn btn-group pull-right"} role="group" aria-label="...">
        <Popover
          isOpen={this.state.pop1}
          onOuterAction={()=> this.setState({ pop1: false})} 
          body={
            <div className="pop1">
              <div className="checkbox" >
                <label>
                  <input type="checkbox" value={this.state.direct} checked={this.state.direct} 
                  onClick={this.handleFilterTransit.bind(this, 'direct')}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt">Direct</span>
                </label>
              </div>
              <div className="checkbox" >
                <label>
                  <input type="checkbox" value={this.state.transit1} checked={this.state.transit1} 
                  onClick={this.handleFilterTransit.bind(this, 'transit1')}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt">1 Transit</span>
                </label>
              </div>
              <div className="checkbox" >
                <label>
                  <input type="checkbox" value={this.state.transit2} checked={this.state.transit2} 
                  onClick={this.handleFilterTransit.bind(this, 'transit2')}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt">2 Transit</span>
                </label>
              </div>
            </div>
          }
          children={
            <button type="button" onClick={()=> this.setState({ pop1: true})} 
            className="btn btn-default btn-fil-left" style={{borderRadius:'15px 0 0 15px'}}>
            <img src="/img/ic-transit.png" />&nbsp;Transit</button>
          }
        />

        <Popover
          isOpen={this.state.pop2}
          onOuterAction={()=> this.setState({ pop2: false})} 
          body={
            <div className="pop2">
              <div className="row">
                <div className="col-md-6">
                  <p>Departure Time</p>
                  <div className="checkbox" >
                    <label>
                      <input type="checkbox" value={this.state.departure1} checked={this.state.departure1} 
                      onClick={this.handleFilterDeparture.bind(this, 'departure1')}/>
                      <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                      &nbsp;<span className="crt">00.00 - 06.00</span>
                    </label>
                  </div>
                  <div className="checkbox" >
                    <label>
                      <input type="checkbox" value={this.state.departure2} checked={this.state.departure2} 
                      onClick={this.handleFilterDeparture.bind(this, 'departure2')}/>
                      <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                      &nbsp;<span className="crt">06.00 - 12.00</span>
                    </label>
                  </div>
                  <div className="checkbox" >
                    <label>
                      <input type="checkbox" value={this.state.departure3} checked={this.state.departure3} 
                      onClick={this.handleFilterDeparture.bind(this, 'departure3')}/>
                      <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                      &nbsp;<span className="crt">12.00 - 18.00</span>
                    </label>
                  </div>
                  <div className="checkbox" >
                    <label>
                      <input type="checkbox" value={this.state.departure4} checked={this.state.departure4} 
                      onClick={this.handleFilterDeparture.bind(this, 'departure4')}/>
                      <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                      &nbsp;<span className="crt">18.00 - 00.00</span>
                    </label>
                  </div>
                </div>
                <div className="col-md-6">
                  <p>Arrival Time</p>
                  <div className="checkbox" >
                    <label>
                      <input type="checkbox" value={this.state.arrival1} checked={this.state.arrival1} 
                      onClick={this.handleFilterArrival.bind(this, 'arrival1')}/>
                      <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                      &nbsp;<span className="crt">00.00 - 06.00</span>
                    </label>
                  </div>
                  <div className="checkbox" >
                    <label>
                      <input type="checkbox" value={this.state.arrival2} checked={this.state.arrival2} 
                      onClick={this.handleFilterArrival.bind(this, 'arrival2')}/>
                      <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                      &nbsp;<span className="crt">06.00 - 12.00</span>
                    </label>
                  </div>
                  <div className="checkbox" >
                    <label>
                      <input type="checkbox" value={this.state.arrival3} checked={this.state.arrival3} 
                      onClick={this.handleFilterArrival.bind(this, 'arrival3')}/>
                      <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                      &nbsp;<span className="crt">12.00 - 18.00</span>
                    </label>
                  </div>
                  <div className="checkbox" >
                    <label>
                      <input type="checkbox" value={this.state.arrival4} checked={this.state.arrival4} 
                      onClick={this.handleFilterArrival.bind(this, 'arrival4')}/>
                      <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                      &nbsp;<span className="crt">18.00 - 00.00</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          }
          children={
            <button type="button" onClick={()=> this.setState({ pop2: true})} 
            className="btn btn-default">
            <img src="/img/ic-time.png" />&nbsp;Time</button>
          }
        />
        <Popover
          isOpen={this.state.pop3}
          onOuterAction={()=> this.setState({ pop3: false})} 
          body={
            <div className="pop1">
              {airData.map((item, index) => {
                if (item.code === 'JT') {
                  return (
                  <div>
                  <div className="checkbox" >
                    <label>
                      <input type="checkbox" value={this.state[item.code]} onChange={this.handleFilterAirline.bind(this, item.code, 'airline')} checked={this.state[item.code]}/>
                      <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                      &nbsp;<span className="crt">{item.name}</span>
                    </label>
                  </div>
                  <div className="checkbox" >
                    <label>
                      <input type="checkbox" value={this.state['ID']} onChange={this.handleFilterAirline.bind(this, 'ID', 'airline')} checked={this.state['ID']}/>
                      <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                      &nbsp;<span className="crt">Batik Air</span>
                    </label>
                  </div>
                  </div>
                )
                }
                return (
                  <div className="checkbox" >
                    <label>
                      <input type="checkbox" value={this.state[item.code]} onChange={this.handleFilterAirline.bind(this, item.code, 'airline')} checked={this.state[item.code]}/>
                      <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                      &nbsp;<span className="crt">{item.name}</span>
                    </label>
                  </div>
                )
              })}
              {/*<div className="checkbox" >
                <label>
                  <input type="checkbox" value={this.state.ID} onChange={this.handleFilterAirline.bind(this, 'ID','airline')} checked={this.state.ID}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt">Batik Air</span>
                </label>
              </div>
              <div className="checkbox" >
                <label>
                  <input type="checkbox" value={this.state.QG} onClick={this.handleFilterAirline.bind(this, 'QG','airline')} checked={this.state.QG}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt">Citilink</span>
                </label>
              </div>
              <div className="checkbox" >
                <label>
                  <input type="checkbox" value={this.state.GA} checked={this.state.GA} onClick={this.handleFilterAirline.bind(this, 'GA','airline')}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt">Garuda Indonesia</span>
                </label>
              </div>
              <div className="checkbox" >
                <label>
                  <input type="checkbox" value={this.state.JT} checked={this.state.JT} onClick={this.handleFilterAirline.bind(this, 'JT','airline')}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt">Lion Air</span>
                </label>
              </div>
              <div className="checkbox" >
                <label>
                  <input type="checkbox" value={this.state.SJ} checked={this.state.SJ} onClick={this.handleFilterAirline.bind(this, 'SJ','airline')}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt">Sriwijaya Air</span>
                </label>
              </div>
              <div className="checkbox" >
                <label>
                  <input type="checkbox" value={this.state.IW} checked={this.state.IW} onClick={this.handleFilterAirline.bind(this, 'IW','airline')}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt">Wings Air</span>
                </label>
              </div>*/}
            </div>
          }
          children={
            <button type="button" onClick={() => this.setState({ pop3: true})} 
            className="btn btn-default">
            <img src="/img/ic-airline.png" />&nbsp;Airline</button>
          }
        />

        <Popover
          isOpen={this.state.pop4}
          onOuterAction={()=> this.setState({ pop4: false})} 
          body={
            <div className="pop1" style={{width:'350px',padding:'31px 35px 20px 20px'}}>
              <InputRange
                maxValue={1000000}
                minValue={0}
                value={this.state.value}
                step={50000}
                onChange={value => this.setState({ value })} />
                <div className="checkbox" style={{marginBottom:0,marginTop:'24px'}}>
                <label>
                  <input type="checkbox" onClick={this.handleFilterPrice.bind(this, 'price500')} checked={this.state.price500}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt"
                   style={{
                    color: '#333',
                    marginTop: '3px',
                    display: 'inlineBlock',
                    float: 'left',
                    marginLeft: '0px',
                    fontSize: '14px'
                   }}>Apply</span>
                </label>
              </div>
              {/*<div className="checkbox" >
                <label>
                  <input type="checkbox" onClick={this.handleFilterPrice.bind(this, 'price500')} checked={this.state.price500}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt">{`< 600000`}</span>
                </label>
              </div>
              <div className="checkbox" >
                <label>
                  <input type="checkbox" onClick={this.handleFilterPrice.bind(this, 'price1000')} checked={this.state.price1000}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt">600000 - 1000000</span>
                </label>
              </div>
              <div className="checkbox" >
                <label>
                  <input type="checkbox" onClick={this.handleFilterPrice.bind(this, 'price1000k')} checked={this.state.price1000k}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  &nbsp;<span className="crt">> 1000000</span>
                </label>
              </div>*/}
            </div>
          }
          children={
            <button type="button" onClick={()=> this.setState({ pop4: true})} 
            className="btn btn-default">
            <img src="/img/ic-transit.png" />&nbsp;Price</button>
          }
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  twoway: state.searchFlight.twoway,
  flightSchedule: state.searchFlight.airlanesSchedule,
  airAvailability: state.searchFlight.airAvailability,
  gsaData: state.searchFlight.gsaData,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setSelectedFlight,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlightFilterMenu)
