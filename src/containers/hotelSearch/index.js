import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { getHotelList, postBookHotel, setDestination } from '../../modules/searchHotel';
import HotelResultWidget from '../../components/widget/hotelResultWidget';
import queryString from 'query-string';
import HotelList from './hotelList';
import moment from 'moment';
import { sessionId } from '../../config';

class HotelSearch extends React.Component {

  state = {
    destination: '',
    duration: 1,
    room: 1,
    unmount: false,
    getHotelCount: 1
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const parsed = queryString.parse(window.location.search);
    const startDate = parsed.startDate;
    const endDate = parsed.endDate;
    const duration = this.duration(startDate, endDate);
    let occupancy = []
    const room = parsed.room;
    const adultCount = parsed.adultCount;
    const childCount = parsed.childCount;
    for (let i = 0; i < room; i++) {
      occupancy.push(`${Math.floor(adultCount/room)}|${Math.floor(childCount/room)}`)
    }
    this.props.setDestination(parsed.destination);
    //console.log(occupancy)
    this.setState({
      destination: parsed.destination,
      duration: duration,
      room: parsed.room,
      getHotelCount: 1
    })
    this.props.postBookHotel({
      duration: duration,
      checkIn: moment(parsed.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      checkOut: moment(parsed.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      noOfRoom: parsed.room
    })
    const payload = {
      paxPassport: "CO0094",
      destCountryCode: parsed.destCountryCode,
      destCityCode: parsed.destCityCode,
      checkInDate: moment(parsed.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      checkOutDate: moment(parsed.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      bedType: "Empty",
      occupancy: occupancy,
      page: 0,
      numberOfResults: 0,
      hotelCode: null,
      roomInfo: null,
      sessionId: sessionId,
    }
    this.getHotel(payload)
  }

  componentWillUnmount(){

  }

  getHotel = (payload) => {
    const self = this
    this.props.getHotelList(payload).then((res) => {
      //console.log('res', res, this.state.getHotelCount)
      this.setState({
        getHotelCount: this.state.getHotelCount + 1
      })
      if (this.state.getHotelCount <= 3) {
        if (res.hotels == null || res.hotels.length === 0) {
          if (window.location.pathname === '/hotel/search')
          self.getHotel(payload)
        }
      }
      
    });
  }

  duration = (sd, ed) => {
    const std = moment(sd, 'DD-MM-YYYY');
    const edd = moment(ed, 'DD-MM-YYYY');
    return Math.round((edd - std) / (1000 * 60 * 60 * 24));
  }

  render() {
    const { selectedCity, hotelBook } = this.props;
    const checkIn = moment(hotelBook.checkIn, 'YYYY-MM-DD');
    const checkOut = moment(hotelBook.checkOut, 'YYYY-MM-DD');
    return (
      <div>
        <div className="jumbotron search-bg">
          <div className="container">
            <div className="row hotel-search">
              <div className="col-md-8 col-sm-7">
                <h2>Find a best place <br /><span>for your trip</span> </h2>
                {/*<h2>Your search result for {selectedCity.cityName}</h2>*/}
              </div>
              <div className="col-md-3 col-sm-4">
                <img src="/img/searchimg2.png" width="300" style={{marginTop:'20px',marginBottom:'20px'}}/>
              </div>
            </div>
          </div>
        </div>
        <div className="change-hotel">
          <div className="container">
            <div className="row">
              <div className="col-md-9">
                <div className="hotel-title">
                  <p>Your search result for</p>
                    <h3 className="pull-left">{this.props.destination}: {(this.props.hotelList === null || this.props.hotelList.length === 0) ? ' Searching... ': this.props.hotelList.length + ' Hotels found '}    {/*234 travel deals!*/}</h3>
                    <h3 className="pull-left">&nbsp;&nbsp;| Checkin: {checkIn.format('D')} {checkIn.format('MMM')} - Checkout: {checkOut.format('D')} {checkOut.format('MMM')}</h3>
                    <div className="clear"></div>
                </div>
              </div>
              <div className="col-md-3 stripe-bl">
                <button type="button" className="btn pull-right change-btn"
                  data-toggle="collapse" href="#collapseExample" aria-expanded="false"
                  aria-controls="collapseExample">Change Search</button>
              </div>
              <div className="col-md-12">
                <div className="collapse hotelColl" id="collapseExample">
                  <HotelResultWidget />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <ol className="breadcrumb">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/">Hotel</Link></li>
                <li className="active">{this.props.destination}</li>
              </ol>
              <p style={{ color: '#595959' }}>{this.props.destination} vacation, holiday, hotel, village, apartement  for rent </p>
            </div>
            <div className="col-md-6">

            </div>
          </div>
          <hr style={{ borderColor: '#2094b9' }} />

          <HotelList duration={this.state.duration} room={this.state.room} destination={this.props.destination}/>
        </div>
        <br />
        <br />
        <br />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  room: state.searchHotel.room,
  hotelList: state.searchHotel.hotelList.hotels,
  selectedCity: state.searchHotel.selectedCity,
  hotelBook: state.searchHotel.hotelBook,
  destination: state.searchHotel.destination
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getHotelList,
  postBookHotel,
  setDestination
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HotelSearch)
