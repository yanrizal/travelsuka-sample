import React from 'react';
import Select from "react-virtualized-select";
import { SingleDatePicker } from 'react-dates';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { startSearchFlight, getAirports, startSearchFlightTwoWay } from '../../modules/searchFlight';
import moment from 'moment';
import queryString from 'query-string';
import { history } from '../../store';
import { sessionId } from '../../config';
import createFilterOptions from "react-select-fast-filter-options";

class FlightResultWidget extends React.Component {

  state = {
    from: '',
    to: '',
    dropdown: 'dropdown-content',
    adultCount: 0,
    childCount: 0,
    infantCount: 0,
    return: 'false',
    departureDate: moment().add(1, 'days'),
    returnDate: moment().add(2, 'days'),
    passengers: '',
    seat: 'E',
  }

  componentDidMount(){
    const parsed = queryString.parse(window.location.search);
    this.props.getAirports();
    let returnDate = '';
    if (parsed.return === 'true') {
      returnDate = moment(parsed.returnDate, 'DD-MM-YYYY');
    } else {
      returnDate = moment().add(2, 'days')
    }
    this.setState({
      from: parsed.from,
      to: parsed.to,
      adultCount: parseInt(parsed.adultCount, 0),
      childCount: parseInt(parsed.childCount, 0),
      infantCount: parseInt(parsed.infantCount, 0),
      departureDate: moment(parsed.departureDate, 'DD-MM-YYYY'),
      returnDate: returnDate,
      return: parsed.return,
      seat: parsed.cabin,
      passengers: 'Adult ' + (parsed.adultCount) + ', Child ' + (parsed.childCount) + ', Infant ' + (parsed.infantCount)
    })
  }

  handleSearchFlight = e => {
    const obj = {
      from: this.state.from,
      to: this.state.to,
      adultCount: this.state.adultCount,
      childCount: this.state.childCount,
      infantCount: this.state.infantCount,
      departureDate: moment(this.state.departureDate).format('DD-MM-YYYY'),
      returnDate: (this.state.return) ? moment(this.state.returnDate).format('DD-MM-YYYY') : '',
      return: this.state.return,
      cabin: this.state.seat,
    }
    const stringified = queryString.stringify(obj);
    this.props.handleChangeSearch({
      obj
    })
    history.push(`/flight/search?${stringified}`);
    const parsed = queryString.parse(window.location.search);
    let returnDate = '';
    if (parsed.return === 'true') {
      returnDate = moment(parsed.returnDate, 'DD-MM-YYYY').format('MM-DD-YYYY');
    } else {
      returnDate = ""
    }

    let i = 0;
    this.props.airlinesCode.map((item, index) => {
      let payload = {
        departureAirport: {
          code: this.state.from
        },
        arrivalAirport: {
          code: this.state.to
        },
        departureDate: moment(this.state.departureDate, 'DD-MM-YYYY').format('MM-DD-YYYY'),
        returnDate: returnDate,
        promotionCode: "",
        currency: "IDR",
        airlines: [
          {
            code: item.code
          }
        ],
        noOfAdt: this.state.adultCount,
        noOfChd: this.state.childCount,
        noOfInf: this.state.infantCount,
        cabin: this.state.seat,
        sessionId: sessionId,
        platform: "",
        appVersion: ""
      }
      //console.log(payload)
      if (parsed.return === 'true') {
        this.props.startSearchFlightTwoWay(payload, index).then((result) => {
          
          this.props.onSuccess({
            i: i
          })
          i++;
        });
      } else {
        this.props.startSearchFlight(payload, index).then((result) => {
          
          this.props.onSuccess({
            i: i
          })
          i++;
        });
      }
      return false;
    })
  }

  handleChangeFlight = (name, selectedOption) => {
    this.setState({ 
      [name]: selectedOption.value
    });
  }

  handleChangeDate = (date) => {
    this.setState({
      startDate: date
    });
  }

  handleBlur = e => {
    this.setState({
      dropdown: 'dropdown-content'
    })
  }

  handleFocus = e => {
    this.setState({
      dropdown: 'dropdown-content show'
    })

  }

  handleInc = (name, e) => {
    if (this.state['adultCount'] + this.state['childCount'] === 7) {
      if (name === 'infantCount' && (this.state['infantCount'] + 1) <= this.state['adultCount']) {
        this.setState({
          [name]: this.state[name] + 1
        })
      }
    }
    else if (name === 'infantCount' && (this.state['infantCount'] + 1) > this.state['adultCount']) {
      
    } else {
      this.setState({
        [name]: this.state[name] + 1
      })
    }
    setTimeout(() => {
      this.setState({
        passengers: 'Adult ' + (this.state.adultCount) + ', Child ' + (this.state.childCount) + ', Infant ' + (this.state.infantCount)
      })
    }, 50)
    
  }

  handleDec = (name, e) => {
    if (this.state[name] !== 0) {
      if (name === 'adultCount' && this.state['adultCount'] === 1) {
      
      } 
      else if (name === 'adultCount' && (this.state['adultCount'] - 1) < this.state['infantCount']) {
        
      }
      else {
        this.setState({
          [name]: this.state[name] - 1
        })
      }
      
      setTimeout(() => {
      this.setState({
        passengers: 'Adult ' + (this.state.adultCount) + ', Child ' + (this.state.childCount) + ', Infant ' + (this.state.infantCount)
      })
    }, 50)
    }
  }

  handleCheckReturn = e => {
    this.setState({
      return: (this.state.return === 'false') ? 'true' : 'false'
    })
  }

  render() {
    const airportsValue = []
    this.props.airports.map((item) => {
      Object.defineProperty(item, 'label', {
        value: `${item.name} ${item.code}`,
        writable: true
      });
      Object.defineProperty(item, 'value', {
        value: item.code,
        writable: true
      });
      airportsValue.push(item)
      return false;
    })

    const filterOptions = createFilterOptions({
      airportsValue
    });

    return (
      <div className="fl-result-widget">
            <div className="row">
              <div className="col-md-6">
                <span className="glyphicon glyphicon-map-marker mark-wd mark-fl"></span>
                <Select
                  name="from"
                  value={this.state.from}
                  onChange={this.handleChangeFlight.bind(this, 'from')}
                  options={airportsValue}
                  className="sel-wg"
                />  
              </div>
              <div className="col-md-6">
                <span className="glyphicon glyphicon-map-marker mark-wd mark-fl" style={{left:'22px'}}></span>
                <Select
                  name="to"
                  value={this.state.to}
                  onChange={this.handleChangeFlight.bind(this, 'to')}
                  options={airportsValue}
                  className="sel-wg"
                />  
              </div>
            </div>
            <h4 style={{marginTop:'20px'}}><input type="checkbox" onClick={this.handleCheckReturn} value={this.state.return}/>&nbsp;Return</h4>
            <div className="row">
              <div className="col-md-6 date-wg">
                <span className="glyphicon glyphicon-calendar ic-cal" style={{left:'27px',top:'22px'}}></span>
                <SingleDatePicker
                  displayFormat="DD MMM YYYY"
                  date={this.state.departureDate} // momentPropTypes.momentObj or null
                  onDateChange={departureDate => this.setState({ departureDate, returnDate: moment(departureDate).add(0, 'days') })} // PropTypes.func.isRequired
                  focused={this.state.focused} // PropTypes.bool
                  onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                />
              </div>
              <div className="col-md-6 date-wg">
                <span className="glyphicon glyphicon-calendar ic-cal" style={{left:'27px',top:'22px'}}></span>
                <SingleDatePicker
                  displayFormat="DD MMM YYYY"
                  date={this.state.returnDate} // momentPropTypes.momentObj or null
                  onDateChange={returnDate => this.setState({ returnDate })} // PropTypes.func.isRequired
                  focused={this.state.focused2} // PropTypes.bool
                  onFocusChange={({ focused: focused2 }) => this.setState({ focused2 })} // PropTypes.func.isRequired
                  isOutsideRange={(day) => day.isBefore(this.state.departureDate)}
                  disabled={(this.state.return === 'true') ? false : true}
                />
              </div>
              <div className="clear"></div>
              <div className="col-md-6">
                <h4 style={{marginTop:'20px'}}>No. of Passengers</h4>
                 <div className="form-group" style={{position:'relative'}}>
                    <input onFocus={this.handleFocus} 
                      value={this.state.passengers}
                      type="text" className="form-control" placeholder="Passengers"/>
                    <div className={this.state.dropdown} onBlur={this.handleBlur} tabIndex="1">
                      <div className="row">
                        <div className="col-md-6">
                          <span>Adult</span>
                        </div>
                        <div className="col-md-6">
                        <div>
                          <span className="dec" onClick={this.handleDec.bind(this, 'adultCount')}>-</span>
                          <span className="count">{this.state.adultCount}</span>
                          <span className="inc" onClick={this.handleInc.bind(this, 'adultCount')}>+</span>
                        </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <span>Child</span>
                        </div>
                        <div className="col-md-6">
                        <div>
                          <span className="dec" onClick={this.handleDec.bind(this, 'childCount')}>-</span>
                          <span className="count">{this.state.childCount}</span>
                          <span className="inc" onClick={this.handleInc.bind(this, 'childCount')}>+</span>
                        </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <span>Infant</span>
                        </div>
                        <div className="col-md-6">
                        <div>
                          <span className="dec" onClick={this.handleDec.bind(this, 'infantCount')}>-</span>
                          <span className="count">{this.state.infantCount}</span>
                          <span className="inc" onClick={this.handleInc.bind(this, 'infantCount')}>+</span>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </div>
              <div className="col-md-6">
                 <h4 style={{marginTop:'20px'}}>Seat Class</h4>
                 <Select
                  name="from"
                  value={this.state.seat}
                  onChange={this.handleChangeFlight.bind(this, 'seat')}
                  options={[{
                    label:'Economy', value:'E'
                  }, {
                    label:'Business', value:'B'
                  }, {
                    label:'First Class', value:'F'
                  }]}
                /> 
              </div>
            </div>
            <button type="button" className="btn change-btn" style={{marginTop:'10px',marginBottom:'20px'}} onClick={this.handleSearchFlight}>Search Flight</button>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    airports: state.searchFlight.airports,
    airlinesCode: state.searchFlight.airlinesCode,
    departureAirportName: state.searchFlight.departureAirportName,
    arrivalAirportName: state.searchFlight.arrivalAirportName,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  startSearchFlight,
  getAirports,
  startSearchFlightTwoWay
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlightResultWidget)