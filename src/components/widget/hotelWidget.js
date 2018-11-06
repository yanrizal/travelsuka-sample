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
import { Translate } from "react-localize-redux";

let delayTimer = null

class HotelWidget extends React.Component {

  state = {
    endDate: moment().add(2, 'days'),
    startDate: moment().add(1, 'days'),
    guest: 1,
    destination: 'Jakarta',
    dropdown: 'dropdown-content',
    roomCount: 1,
    adultCount: 1,
    childCount: 0,
    cityVal: '',
    suggestions: [],
    passengers: 'Guest 1, Room 1',
    display: {display:'none'}
  }

  componentDidMount(){
    this.props.selectCity({
      cityCode: '',
      countryCode: '',
    })
  }

  handleSearchHotel = e => {
    const { selectedCity } = this.props;
    const payload = {
      destination: this.state.cityVal,
      startDate: moment(this.state.startDate).format('DD-MM-YYYY'),
      endDate: moment(this.state.endDate).format('DD-MM-YYYY'),
      guest: this.state.adultCount + this.state.childCount,
      room: this.state.roomCount,
      adultCount: this.state.adultCount,
      childCount: this.state.childCount,
      destCountryCode: selectedCity.countryCode,
      destCityCode: selectedCity.cityCode,
      page: 1,
    }
    const stringified = queryString.stringify(payload);
    history.push(`/hotel/search?${stringified}`);
    //this.props.startSearchHotel(payload)
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

  handleChangeHotel = (name, selectedOption) => {
    this.setState({ 
      [name]: selectedOption.value
    });
  }

  handleChangeKey = e => {
    const self = this;
    const value = e.target.value
    this.setState({
      cityVal: value,
    })
    this.props.selectCity({
      countryCode: '',
      cityCode: '',
      cityName: '',
    })
    if (e.target.value !== '') {
      this.setState({display: {display:'block'}})
    } else {
      this.setState({display: {display:'none'}})
    }
    clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
      // Do the ajax stuff
      self.props.getDestinationsList({
        keyword: value,
        sessionId: sessionId
      })
    }, 1500); // Will do the ajax stuff after 1000 ms, or 1 s
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
          passengers: `Guest ${this.state.roomCount + this.state.childCount}, Room ${this.state.roomCount}`
        })
      })
      }
    }

    // this.setState({
    //   [name]: this.state[name] + 1
    // }
    // setTimeout(() => {
    //   this.setState({
    //     passengers: 'Adult ' + (this.state.adultCount) + ', Child ' + (this.state.childCount) + ', Infant ' + (this.state.infantCount)
    //   })
    // }, 50)

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
          passengers: `Guest ${this.state.roomCount + this.state.childCount}, Room ${this.state.roomCount}`
        })
      })
      }
    }
  }

  render() {
    const { destinationList, selectedCity } = this.props;
    let dl = destinationList
    if (destinationList == null) {
      dl = []
    }
    return (
      <div>
          <div className="row">
            <div className="col-md-12">
              <h3 style={{margin:'20px 0 5px',fontWeight:'600'}}><Translate id="home.hWidget"/></h3>
              <p style={{margin:0}}>and new deals every day</p>
            </div>
            <div className="col-md-12 ht-dst">
              <div className="form-group" style={{position:'relative',marginBottom:0}}>
                <span className="glyphicon glyphicon-map-marker mark-wd"></span>
                <input className="form-control input-city" type="text" placeholder="Search city..." onChange={this.handleChangeKey} value={this.state.cityVal}/>
                <div className="drop-content" style={this.state.display}>
                  <ul className="list-group">
                    {dl.length == 0 &&
                      <li className="list-group-item">Loading...</li>
                    }
                    {dl.map((item, index) => (
                      <li className="list-group-item" key={index} onClick={this.handleCityClick.bind(this, item)}>{item.CityName}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            </div>
            <div className="clear"></div>
            <div className="row">
              <div className="col-md-6 date-wg ht-date">
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
                  <div className={this.state.dropdown} onBlur={this.handleBlur} tabIndex="1">
                    <div className="row">
                      <div className="col-md-6">
                        <span><Translate id="home.room" /></span>
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
                          <span className="count" style={{width:'40px',display:'inlineBlock',paddingLeft:'18px'}}>{this.state.childCount}</span>
                          <span className="inc" onClick={this.handleInc.bind(this, 'childCount')}>+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*<div className="col-md-3" style={{paddingRight:'5px'}}>
                <span className="glyphicon glyphicon-user user-wd2" ></span>
                <Select
                  className="sel-wg"
                  name="form-field-name"
                  value={this.state.guest}
                  onChange={this.handleChangeHotel.bind(this, 'guest')}
                  options={[
                    { value: '1', label: '1 guest' },
                    { value: '2', label: '2 guest' },
                    { value: '3', label: '3 guest' },
                    { value: '4', label: '4 guest' },
                    { value: '5', label: '5 guest' },
                  ]}
                /> 
              </div>
              <div className="col-md-3" style={{paddingLeft:0}}>
                <img src="/img/bed.png" className="ic-bed"/>
                <Select
                  className="sel-wg"
                  name="form-field-name"
                  value={this.state.room}
                  onChange={this.handleChangeHotel.bind(this, 'room')}
                  options={[
                    { value: '1', label: '1 room' },
                    { value: '2', label: '2 room' },
                    { value: '3', label: '3 room' },
                    { value: '4', label: '4 room' },
                    { value: '5', label: '5 room' },
                  ]}
                />  
              </div>*/}
             
            </div>
            <div className="clear"></div><br/>
            {selectedCity.cityCode !== '' &&
              <button type="button" style={{marginTop:0}} className="btn btn-search" onClick={this.handleSearchHotel}>
              <span className="glyphicon glyphicon-search" style={{marginRight:'5px',marginTop:'3px',float:'left'}}></span><Translate id="home.search" /></button>
            }
            {selectedCity.cityCode === '' && this.state.cityVal !== '' &&
              <button type="button" style={{marginTop:0}} className="btn btn-search" onClick={() => {alert('Please select the city')}} >
              <span className="glyphicon glyphicon-search" style={{marginRight:'5px',marginTop:'3px',float:'left'}}></span><Translate id="home.search" /></button>
            }
            {this.state.cityVal === '' &&
              <button type="button" style={{marginTop:0}} className="btn btn-search" onClick={() => {alert('destination cannot be empty')}}>
              <span className="glyphicon glyphicon-search" style={{marginRight:'5px',marginTop:'3px',float:'left'}}></span><Translate id="home.search" /></button>
            }
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
)(HotelWidget)