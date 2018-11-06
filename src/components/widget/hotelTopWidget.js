import React from 'react';
import Select from 'react-select';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getDestinationsList, selectCity } from '../../modules/searchHotel';
import { sessionId } from '../../config';
import queryString from 'query-string';
import { history } from '../../store';

let delayTimer = null

class HotelTopWidget extends React.Component {

  state = {
    endDate: moment().add(2, 'days'),
    startDate: moment().add(1, 'days'),
    guest: 1,
    room: 1,
    roomCount: 1,
    adultCount: 1,
    childCount: 0,
    destination: 'Jakarta',
    cityVal: '',
    suggestions: [],
    passengers: 'Guest 1, Room 1',
    display: {display:'none'},
    destCityCode: '',
    destCountryCode: '',
    dropdown: 'dropdown-content',
  }

  componentDidMount() {
    const parsed = queryString.parse(window.location.search);
    console.log(parsed);
    this.setState({
      cityVal: parsed.destination,
      startDate: moment(parsed.startDate, 'DD-MM-YYYY'),
      endDate: moment(parsed.endDate, 'DD-MM-YYYY'),
      guest: parseInt(parsed.guest),
      roomCount: parseInt(parsed.room),
      adultCount: parseInt(parsed.adultCount),
      childCount: parseInt(parsed.childCount),
      passengers: `Guest ${parseInt(parsed.adultCount) + parseInt(parsed.childCount)}, Room ${parsed.room}`,
      page: parsed.page,
      destCountryCode: parsed.destCountryCode,
      destCityCode: parsed.destCityCode,
    })
  }

  handleSearchHotel = e => {
    const { selectedCity } = this.props;
    const payload = {
      destination: this.state.cityVal,
      startDate: moment(this.state.startDate).format('DD-MM-YYYY'),
      endDate: moment(this.state.endDate).format('DD-MM-YYYY'),
      guest: this.state.guest,
      room: this.state.roomCount,
      adultCount: this.state.adultCount,
      childCount: this.state.childCount,
      destCountryCode: this.state.destCountryCode,
      destCityCode: this.state.destCityCode,
      page: 1,
    }
    const stringified = queryString.stringify(payload);
    history.push(`/hotel/search?${stringified}`);
    //this.props.startSearchHotel(payload)
  }

  handleChangeHotel = (name, selectedOption) => {
    this.setState({ 
      [name]: selectedOption.value
    });
  }

  handleFocus = e => {
    this.setState({
      dropdown: 'dropdown-content show'
    })
  }

  handleBlur = e => {
    this.setState({
      dropdown: 'dropdown-content'
    })
  }

  handleChangeKey = e => {
    const self = this;
    console.log(e.target.value)
    const value = e.target.value
    this.setState({
      cityVal: value,
    })
    if (value.length >= 3) {
      this.setState({display: {display:'block'}})
      clearTimeout(delayTimer);
      delayTimer = setTimeout(() => {
        // Do the ajax stuff
        self.props.getDestinationsList({
          keyword: value,
          sessionId: sessionId
        })
      }, 1500); // Will do the ajax stuff after 1000 ms, or 1 s
    } else {
      this.setState({display: {display:'none'}})
    }
    
  }

  handleCityClick = (item,e) => {
    console.log(item)
    this.setState({
      cityVal: item.CityName,
    })
    this.props.selectCity({
      countryCode: item.CountryCode,
      cityCode: item.CityCode,
      cityName: item.CityName,
    })
    this.setState({display: {display:'none'}})
  }

  handleChangeDate = (date) => {
    this.setState({
      startDate: date
    });
  }

  handleInc = (name, e) => {
    let roomCount = this.state.roomCount;
    let adultCount = this.state.adultCount;
    let childCount = this.state.childCount;

    console.log(name)
    // roomcount = 1 -> max adultcount 2, max childcount 2
    if (name === 'adultCount' && adultCount / roomCount < 2) {
        this.setState({
          [name]: this.state[name] + 1
        }, () => {
          this.setState({
            passengers: `Guest ${this.state.adultCount + this.state.childCount}, Room ${this.state.roomCount}`
          })
        })
    }
    if (name === 'childCount' && childCount / roomCount < 2) {
        this.setState({
          [name]: this.state[name] + 1
        }, () => {
          this.setState({
            passengers: `Guest ${this.state.adultCount + this.state.childCount}, Room ${this.state.roomCount}`
          })
        })
    }
    if (name === 'roomCount') {
      if (this.state.roomCount < 7) {
      this.setState({
        roomCount: this.state.roomCount + 1,
      }, () => {
        this.setState({
          childCount: 0,
          adultCount: this.state.roomCount,
        }, () => {
          this.setState({
            passengers: `Guest ${this.state.adultCount + this.state.childCount}, Room ${this.state.roomCount}`
          })
        })
      })
      }
    }
  }

  handleDec = (name, e) => {
    if (name === 'adultCount' && this.state.adultCount !== 1 && this.state.adultCount !== this.state.roomCount) {
        this.setState({
          [name]: this.state[name] - 1
        }, () => {
          this.setState({
            passengers: `Guest ${this.state.adultCount + this.state.childCount}, Room ${this.state.roomCount}`
          })
        })
    }
    if (name === 'childCount' && this.state.childCount !== 0) {
        this.setState({
          [name]: this.state[name] - 1
        }, () => {
          this.setState({
            passengers: `Guest ${this.state.adultCount + this.state.childCount}, Room ${this.state.roomCount}`
          })
        })
    }
    if (name === 'roomCount') {
      if (this.state.roomCount !== 1) {
      this.setState({
        roomCount: this.state.roomCount - 1,
      }, () => {
        this.setState({
          childCount: 0,
          adultCount: this.state.roomCount,
        }, () => {
          this.setState({
            passengers: `Guest ${this.state.adultCount + this.state.childCount}, Room ${this.state.roomCount}`
          })
        })
      })
      }
    }
  }

  render() {
    const { destinationList } = this.props;
    return (
      <div className="row top-widget-row hidden-xs hidden-sm">
        <div className="col-md-2 ht-dst2" style={{position:'relative'}}>
          <span className="glyphicon glyphicon-map-marker mark-wd"></span>
          <input className="form-control input-city" type="text" placeholder="Search city..." onChange={this.handleChangeKey} value={this.state.cityVal}/>
          <div className="drop-content" style={this.state.display}>
            <ul className="list-group">
              {destinationList.length == 0 &&
                <li className="list-group-item">Loading...</li>
              }
              {destinationList.map((item, index) => (
                <li className="list-group-item" key={index} onClick={this.handleCityClick.bind(this, item)}>{item.CityName}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-4">
          <span className="glyphicon glyphicon-calendar ic-cal" style={{left:'27px'}}></span>
            <DateRangePicker
              displayFormat="DD MMM YYYY"
              startDate={this.state.startDate} // momentPropTypes.momentObj or null,
              startDateId="your_unique_start_date_id" // PropTypes.string.isRequired,
              endDate={this.state.endDate} // momentPropTypes.momentObj or null,
              endDateId="your_unique_end_date_id" // PropTypes.string.isRequired,
              onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
              focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
            />
        </div>
        <div className="col-md-4">
          <div className="form-group" style={{ position: 'relative' }}>
                  <span className="glyphicon glyphicon-user user-wd" style={{top:'7px',left:'12px'}}></span>
                  <input onFocus={this.handleFocus}
                    value={this.state.passengers}
                    onChange={() => { }}
                    type="text" className="form-control input-wg" placeholder="Passengers" 
                    style={{marginTop:0}}/>
                  <div className={this.state.dropdown} onBlur={this.handleBlur} tabIndex="1" style={{zIndex:'9999'}}>
                    <div className="row">
                      <div className="col-md-6">
                        <span>Room</span>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <span className="dec" onClick={this.handleDec.bind(this, 'roomCount')}>-</span>
                          <span className="count" style={{width:'40px',display:'inlineBlock',paddingLeft:'18px'}}>{this.state.roomCount}</span>
                          <span className="inc" onClick={this.handleInc.bind(this, 'roomCount')}>+</span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <span>Adult</span>
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
                        <span>Child</span>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <span className="dec" onClick={this.handleDec.bind(this, 'childCount')}>-</span>
                          <span className="count" style={{width:'40px',display:'inlineBlock',paddingLeft:'18px'}}>{this.state.childCount}</span>
                          <span className="inc" onClick={this.handleInc.bind(this, 'childCount')}>+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
        </div>
        <div className="col-md-2">
          <button className="btn btn-refine pull-right" onClick={this.handleSearchHotel}>Change Search</button>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    destinationList: state.searchHotel.destinationList,
    selectedCity: state.searchHotel.selectedCity
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  getDestinationsList,
  selectCity,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HotelTopWidget)