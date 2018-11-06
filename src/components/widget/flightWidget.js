import React from 'react';
import Select from "react-virtualized-select";
import { SingleDatePicker } from 'react-dates';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { startSearchFlight, getAirports } from '../../modules/searchFlight';
import moment from 'moment';
import queryString from 'query-string';
import { history } from '../../store';
import createFilterOptions from "react-select-fast-filter-options";
import { withLocalize, Translate, setActiveLanguage } from "react-localize-redux";

class FlightWidget extends React.Component {

  state = {
    from: 'CGK',
    to: 'DPS',
    dropdown: 'dropdown-content',
    adultCount: 1,
    childCount: 0,
    infantCount: 0,
    departureDate: moment().add(1, 'days'),
    returnDate: moment().add(2, 'days'),
    passengers: 'Adult 1, Child 0, Infant 0',
    return: false,
    seat: 'E'
  }

  componentDidMount() {
    this.props.getAirports();
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
    history.push(`/flight/search?${stringified}`);
    //this.props.startSearchFlight(payload, obj);
    // this.props.startSearchFlight({
    //   noOfAdt: this.state.adultCount,
    //   noOfChd: this.state.childCount,
    //   noOfInf: this.state.infantCount,
    // }, obj);
  }

  handleChangeFlight = (name, selectedOption) => {
    console.log(selectedOption)
    if (selectedOption !== null) {
      this.setState({
        [name]: selectedOption.value
      });
    }
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

  handleCheckReturn = (n,e) => {
    this.setState({
      return: n
    })
  }

  render() {
    const airportsValue = [];
    const { airports } = this.props;
    airports.map((item) => {
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
      <div>
        <div className="row">
          <div className="col-md-12">
            <h3 style={{ margin: '20px 0 5px', fontWeight: '600' }}><Translate id="home.fWidget" /></h3>
            <p style={{ margin: 0 }}>and new deals every day</p>
            <ul className="nav nav-pills widget-pills">
                <li role="presentation" className={(this.state.return) ? "" : "active"} 
                onClick={this.handleCheckReturn.bind(this,false)}><a href="#"><Translate id="home.oneWay" /></a></li>
                <li role="presentation" className={(!this.state.return) ? "" : "active"} 
                onClick={this.handleCheckReturn.bind(this,true)}><a href="#"><Translate id="home.return" /></a></li>
              </ul>
          </div>
          <div className="clear"></div>

        </div>
        <div className="row">
          <div className="col-md-3 fl-from" style={{paddingRight:'5px'}}>
            <span className="glyphicon glyphicon-map-marker mark-wd mark-fl"></span>
            <Select
              name="from"
              value={this.state.from}
              onChange={this.handleChangeFlight.bind(this, 'from')}
              options={airportsValue}
              className="sel-wg"
            />
          </div>
          <div className="col-md-3 fl-to" style={{paddingRight:'5px',paddingLeft:0}}>
            <span className="glyphicon glyphicon-map-marker mark-wd mark-fl" style={{left:'8px'}}></span>
            <Select
              name="to"
              value={this.state.to}
              onChange={this.handleChangeFlight.bind(this, 'to')}
              options={airportsValue}
              className="sel-wg"
            />
          </div>
          <div className="col-md-3 date-wg" style={{paddingRight:'5px',paddingLeft:0}}>
            <span className="glyphicon glyphicon-calendar ic-cal"></span>
            <SingleDatePicker
              displayFormat="DD MMM YYYY"
              date={this.state.departureDate} // momentPropTypes.momentObj or null
              onDateChange={departureDate => this.setState({ departureDate, returnDate: moment(departureDate).add(0, 'days') })} // PropTypes.func.isRequired
              focused={this.state.focused} // PropTypes.bool
              onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
            />
          </div>
          
          <div className="col-md-3 date-wg fl-rd" style={{paddingLeft:0}}>
            <span className="glyphicon glyphicon-calendar ic-cal"></span>
              <SingleDatePicker
                displayFormat="DD MMM YYYY"
                date={this.state.returnDate} // momentPropTypes.momentObj or null
                onDateChange={returnDate => this.setState({ returnDate })} // PropTypes.func.isRequired
                focused={this.state.focused2} // PropTypes.bool
                onFocusChange={({ focused: focused2 }) => this.setState({ focused2 })} // PropTypes.func.isRequired
                isOutsideRange={(day) => day.isBefore(this.state.departureDate)}
                disabled={(this.state.return) ? false : true}
              />  
          </div>
          
          <div className="clear"></div>
          <div className="col-md-6 fl-psg" style={{paddingRight:'5px'}}>
            <div className="form-group" style={{ position: 'relative' }}>
              <span className="glyphicon glyphicon-user user-wd" ></span>
              <input onFocus={this.handleFocus}
                value={this.state.passengers}
                onChange={() => { }}
                type="text" className="form-control input-wg" placeholder="Passengers" />
              <div className={this.state.dropdown} onBlur={this.handleBlur} tabIndex="1">
                <div className="row">
                  <div className="col-md-6">
                    <span><Translate id="home.adult" /></span>
                  </div>
                  <div className="col-md-6">
                    <div>
                      <span className="dec" onClick={this.handleDec.bind(this, 'adultCount')}>-</span>
                      <span className="count" style={{width:'40px',display:'inlineBlock',paddingLeft:'18px'}}>{this.state.adultCount}</span>
                      <span className="inc" onClick={this.handleInc.bind(this, 'adultCount')}>+</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <span><Translate id="home.child" /></span>
                  </div>
                  <div className="col-md-6">
                    <div>
                      <span className="dec" onClick={this.handleDec.bind(this, 'childCount')}>-</span>
                      <span className="count" style={{width:'40px',display:'inlineBlock',paddingLeft:'15px'}}>{this.state.childCount}</span>
                      <span className="inc" onClick={this.handleInc.bind(this, 'childCount')}>+</span>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <span><Translate id="home.infant" /></span>
                  </div>
                  <div className="col-md-6">
                    <div>
                      <span className="dec" onClick={this.handleDec.bind(this, 'infantCount')}>-</span>
                      <span className="count" style={{width:'40px',display:'inlineBlock',paddingLeft:'15px'}}>{this.state.infantCount}</span>
                      <span className="inc" onClick={this.handleInc.bind(this, 'infantCount')}>+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 fl-seat" style={{paddingLeft:0}}>
            <Select

              name="from"
              value={this.state.seat}
              onChange={this.handleChangeFlight.bind(this, 'seat')}
              className="sel-wg sel-seat"
              options={[{
                label: 'Economy', value: 'E'
              }, {
                label: 'Business', value: 'B'
              }, {
                label: 'First Class', value: 'F'
              }]}
            />
          </div>
        </div>
        <button type="button" className="btn btn-search" onClick={this.handleSearchFlight}>
        <span className="glyphicon glyphicon-search" style={{marginRight:'5px',marginTop:'3px',float:'left'}}></span><Translate id="home.search" /></button>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    airports: state.searchFlight.airports,
    airlinesCode: state.searchFlight.airlinesCode,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  startSearchFlight,
  getAirports
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlightWidget)