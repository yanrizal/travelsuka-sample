import React from 'react';
import Select from 'react-select';
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectCity, getDestinationsList, getHotelList, setDestination, postBookHotel } from '../../modules/searchHotel';
import queryString from 'query-string';
import { sessionId } from '../../config';
import { history } from '../../store';

let delayTimer = null

class HotelResultWidget extends React.Component {

  state = {
    endDate: moment().add(1, 'days'),
    startDate: moment(),
    guest: 1,
    page: 1,
    roomCount: 1,
    adultCount: 1,
    childCount: 0,    
    destination: 'Jakarta',
    passengers: 'Guest 1, Room 1',
    cityVal: '',
    suggestions: [],
    display: { display: 'none' },
    dropdown: 'dropdown-content',
    getHotelCount: 1
  }

  componentDidMount() {
    const parsed = queryString.parse(window.location.search);
    console.log(parsed);
    this.setState({
      cityVal: parsed.destination,
      startDate: moment(parsed.startDate, 'DD-MM-YYYY'),
      endDate: moment(parsed.endDate, 'DD-MM-YYYY'),
      guest: parsed.guest,
      roomCount: parsed.room,
      page: parsed.page,
      roomCount: parseInt(parsed.room),
      adultCount: parseInt(parsed.adultCount),
      childCount: parseInt(parsed.childCount),
      passengers: `Guest ${parseInt(parsed.adultCount) + parseInt(parsed.childCount)}, Room ${parsed.room}`,
    })
    this.props.selectCity({
      cityCode: parsed.destCityCode,
      countryCode: parsed.destCountryCode,
    })
  }

  duration = (sd, ed) => {
    const std = moment(sd, 'DD-MM-YYYY');
    const edd = moment(ed, 'DD-MM-YYYY');
    return Math.round((edd - std) / (1000 * 60 * 60 * 24));
  }

  handleSearchHotel = e => {
    const { selectedCity } = this.props;
    const parsed = queryString.parse(window.location.search);
    const room = this.state.roomCount;
    const adultCount = this.state.adultCount;
    const childCount = this.state.childCount;
    let occupancy = []
    for (let i = 0; i < room; i++) {
      occupancy.push(`${Math.floor(adultCount/room)}|${Math.floor(childCount/room)}`)
    }
    const payload = {
      destination: this.state.cityVal,
      startDate: moment(this.state.startDate).format('DD-MM-YYYY'),
      endDate: moment(this.state.endDate).format('DD-MM-YYYY'),
      guest: this.state.guest,
      room: this.state.roomCount,
      adultCount: this.state.adultCount,
      childCount: this.state.childCount,
      destCountryCode: selectedCity.countryCode,
      destCityCode: selectedCity.cityCode,
      page: this.state.page,
    }
    this.props.setDestination(this.state.cityVal);
    this.props.postBookHotel({
      duration: this.duration(this.state.startDate, this.state.endDate),
      checkIn: moment(this.state.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      checkOut: moment(this.state.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      noOfRoom: this.state.roomCount
    })
    const stringified = queryString.stringify(payload);
    history.push(`/hotel/search?${stringified}`);
    const obj = {
      paxPassport: "CO0094",
      destCountryCode: selectedCity.countryCode,
      destCityCode: selectedCity.cityCode,
      checkInDate: moment(this.state.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      checkOutDate: moment(this.state.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      bedType: "Empty",
      occupancy: occupancy,
      page: this.state.page,
      //numberOfResults: 30,
      hotelCode: "",
      sessionId: sessionId,
    }
    this.props.selectCity({
      cityName: this.state.cityVal
    })
    this.setState({
      getHotelCount: 1
    })
    console.log(payload)
    this.getHotel(obj)
  }

  getHotel = (payload) => {
    const self = this
    this.props.getHotelList(payload).then((res) => {
      console.log('res', res, this.state.getHotelCount)
      this.setState({
        getHotelCount: this.state.getHotelCount + 1
      })
      if (this.state.getHotelCount <= 3) {
        if (res.hotels == null || res.hotels.length === 0) {
          self.getHotel(payload)
        }
      }
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

  handleChangeKey = e => {
    console.log(e.target.value)
    const self = this;
    const value = e.target.value
    this.setState({
      cityVal: value,
    })
    this.props.selectCity({
      countryCode: '',
      cityCode: '',
      cityName: ''
    })
    if (value.length >= 3) {
      this.setState({ display: { display: 'block' } })
      clearTimeout(delayTimer);
      delayTimer = setTimeout(() => {
        // Do the ajax stuff
        self.props.getDestinationsList({
          keyword: value,
          sessionId: sessionId
        })
      }, 1500); // Will do the ajax stuff after 1000 ms, or 1 s
    } else {
      this.setState({ display: { display: 'none' } })
    }
    
  }

  handleCityClick = (item, e) => {
    console.log(item)
    this.setState({
      cityVal: item.CityName,
    })
    this.props.selectCity({
      countryCode: item.CountryCode,
      cityCode: item.CityCode,
      cityName: item.CityName
    })
    this.setState({ display: { display: 'none' } })
  }

  handleChangeHotel = (name, selectedOption) => {
    this.setState({
      [name]: selectedOption.value
    });
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
    const { destinationList, selectedCity } = this.props;
    //console.log(selectedCity)
    return (
      <div className="hotel-result-widget" style={{padding:'0'}}>
        <h4 style={{ marginTop: '20px' }}>City/Destination</h4>
        <div className="form-group ht-dst" style={{ position: 'relative' }}>
          <span className="glyphicon glyphicon-map-marker mark-wd"></span>
          <input className="form-control input-city" type="text" placeholder="Search city..." onChange={this.handleChangeKey} value={this.state.cityVal} />
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

        <div className="row">
          <div className="col-md-6 date-wg">
            <span className="glyphicon glyphicon-calendar ic-cal" style={{left:'27px'}}></span>
            <span className="glyphicon glyphicon-calendar ic-cal" style={{left:'199px'}}></span>
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
          <div className="col-md-6">
            <div className="form-group" style={{ position: 'relative' }}>
                  <span className="glyphicon glyphicon-user user-wd" ></span>
                  <input onFocus={this.handleFocus}
                    value={this.state.passengers}
                    onChange={() => { }}
                    type="text" className="form-control input-wg" placeholder="Passengers" />
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
        </div>
        <div className="row">
          <div className="col-md-6"></div>
          <div className="col-md-6">
            <br />
            {selectedCity.cityCode !== '' &&
            <button type="button" className="btn change-btn" style={{ marginTop: '0px', marginBottom: '20px', float: 'right' }} onClick={this.handleSearchHotel}>Search Hotel</button>
            }
            {selectedCity.cityCode === '' &&
            <button type="button" className="btn change-btn" style={{ marginTop: '0px', marginBottom: '20px', float: 'right' }} onClick={() => {alert('Please select the city')}}>Search Hotel</button>
            }
          </div>
        </div><br />
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
  selectCity,
  getDestinationsList,
  getHotelList,
  setDestination,
  postBookHotel
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HotelResultWidget)