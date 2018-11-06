import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { postBookHotel, getHotelDetail } from '../../modules/searchHotel';
import queryString from 'query-string';
import formatRp from '../../custom/formatRp';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps";
import { history } from '../../store';
import moment from 'moment';
import { sessionId } from '../../config';
import { Link } from 'react-router-dom';
import ImageGallery from 'react-image-gallery';
import HotelTopWidget from '../../components/widget/hotelTopWidget';
import Modal from 'react-responsive-modal';
import Popover from 'react-popover';
import {
  FacebookShareButton,
  FacebookIcon,
  WhatsappIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  GooglePlusShareButton,
  GooglePlusIcon,
} from 'react-share';
import _ from 'lodash';

const  MyMapComponent = withScriptjs(withGoogleMap((props) =>
  <GoogleMap
    defaultZoom={16}
    defaultCenter={{ lat: props.lat, lng: props.lng }}
  >
    {props.isMarkerShown && <Marker position={{ lat: props.lat, lng: props.lng }} />}
  </GoogleMap>
))


class HotelDetail extends React.Component {

  state = {
    percent: 0,
    open: false,
    errorMsg: '',
    pop1: false,
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
    history.push('/');
  };

  componentDidMount(){
    window.scrollTo(0, 0);
    const self = this
    const int = setInterval(() => {
      self.setState({
        percent: self.state.percent + 10
      })
      if (self.state.percent >= 90) {
        clearInterval(int)
      }
    }, 500)
    const parsed = queryString.parse(window.location.search);
    console.log('parsed', parsed);
    let occupancy = []
    const room = parsed.room;
    const adultCount = parsed.adultCount;
    const childCount = parsed.childCount;
    for (let i = 0; i < room; i++) {
      occupancy.push(`${Math.floor(adultCount/room)}|${Math.floor(childCount/room)}`)
    }
    const payload = {
      "roomCode": "",
      "oldPrice": "",
      "paxPassport": "CO0189",
      "destCountryCode": parsed.destCountryCode,
      "destCityCode": parsed.destCityCode,
      "hotelCode": parsed.code,
      "checkInDate": moment(parsed.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      "checkOutDate": moment(parsed.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      "bedType": "Empty",
      "occupancy": occupancy,
      "numberOfResults": 0,
      "page": 0,
      "sessionId": sessionId
    }
    console.log('payload', payload)
    this.props.getHotelDetail(payload).then((res) => {
      this.onOpenModal();
      console.log(res)
      this.setState({errorMsg:res.Message})
      //history.push('/');
    })
  }

  duration = (sd, ed) => {
    const std = moment(sd, 'DD-MM-YYYY');
    const edd = moment(ed, 'DD-MM-YYYY');
    return Math.round((edd - std) / (1000 * 60 * 60 * 24));
  }

  handleBook = (index, e) => {
    const parsed = queryString.parse(window.location.search);
    const { hotelBook, hotel } = this.props;
    const duration = this.duration(parsed.startDate, parsed.endDate);
    let roomsCat = []
    if (hotel.roomsCategory !== null) {
      roomsCat = _.orderBy(hotel.roomsCategory, function (e) { return e.netPrice }, 'asc');
    }
    // console.log({
    //   duration: duration,
    //   checkIn: moment(parsed.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    //   checkOut: moment(parsed.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    //   noOfRoom: parsed.room,
    //   room: roomsCat[index],
    //   guest: parsed.guest,
    // })
    this.props.postBookHotel({
      duration: duration,
      checkIn: moment(parsed.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      checkOut: moment(parsed.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      noOfRoom: parsed.room,
      room: roomsCat[index],
      guest: parsed.guest,
    })
    history.push('/hotel/booking');

  }

  handleBookTop = e => {
    window.scrollBy(0, 1500);
  }

  render() {
    const { hotel } = this.props
    let roomsCat = []
    if (hotel.roomsCategory !== null) {
      roomsCat = _.orderBy(hotel.roomsCategory, function (e) { return e.netPrice }, 'asc');
    }
    let images = [];
    if (typeof hotel.images !== 'undefined') {
      hotel.images.map((val) => {
        const obj = {
          original: val,
          thumbnail: val,
        }
        images.push(obj);
      })
    }
    

    return (
      <div style={{background:'#FFF'}}>
      <div className="top-wg">
        <div className="container">
            <HotelTopWidget/>
        </div>
      </div>
      <div className="container">
        <div className="hotel-detail">
          <div className="row">
            <div className="col-md-6 ">
              {hotel.hotelName !== '' &&
              <ol className="breadcrumb">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/">Hotel&nbsp;</Link></li>
                <li className="active">{hotel.hotelName}</li>
              </ol>
              }
            </div>
            <div className="col-md-6 hidden-xs hidden-sm">
              {hotel.hotelName !== '' &&
              <span className="top-badge pull-right">Great Price Today</span>
              }
            </div>
          {hotel.hotelName == '' && this.state.errorMsg == '' &&
           <section>
            <br/><br/>
              <div className="col-md-12">
                <div className="animate-flicker4"></div>
                <div className="animate-flicker4"></div>
                <div className="animate-flicker4"></div>
              </div><div className="clear"></div><br/>
              <div className="col-md-8">
                <div className="animate-flicker3"></div>
              </div>
              <div className="col-md-4">
                <div className="animate-flicker4"></div>
                <div className="animate-flicker4"></div>
                <div className="animate-flicker4"></div>
              </div>
              <div className="clear"></div>
              <div className="col-md-8">
                <div className="animate-flicker3"></div>
              </div>
              <div className="col-md-4">
                <div className="animate-flicker4"></div>
                <div className="animate-flicker4"></div>
                <div className="animate-flicker4"></div>
              </div>
            
            <div className="clear"></div>
            <br/><br/><br/><br/><br/><br/>
           </section>
          }
          </div>
          {hotel.hotelName !== '' &&
            <div className="row">
              <div className="col-md-8">
                <h2 className="hotel-title pull-left" style={{marginTop:'7px'}}>{hotel.hotelName}</h2>
                <div className="str">
                {[...Array(parseInt(hotel.rating))].map((x, i) => (
                <svg style={{marginTop:'9px'}} fill="black" stroke="none" viewBox="0 0 15 12" className="star" height="18" stroke-linecap="round" width="18"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                ))}
                </div>
                <div className="clear"></div>
                <p className="hotel-addr"><span className="glyphicon glyphicon-map-marker"></span>&nbsp;{hotel.address1}, {hotel.countryName}</p>
                <div className="media pull-left">
                  {/*<div className="media-left">
                    <a href="#">
                      <div className="circle blue" style={{fontSize:'12px'}}>{Math.floor(hotel.rating)}/5</div>
                    </a>
                  </div>
                  <div className="media-body" style={{width:'110px'}}>
                    <h4 className="media-heading">{hotel.roomCount} Room</h4>
                    <p>Score: {hotel.hotelScore}</p>
                  </div>*/}
                </div>
                {/*<img src="/img/favhotel.png" style={{marginTop:'10px'}}/>&nbsp;&nbsp;&nbsp;*/}
                <Popover
                  isOpen={this.state.pop1}
                  preferPlace="above"
                  onOuterAction={()=> this.setState({ pop1: false})} 
                  body={
                    <div className="pop1">
                      <FacebookShareButton url={window.location.href} style={{display:'inline-block'}}>
                        <FacebookIcon size={42} round={true}/>
                      </FacebookShareButton>&nbsp;
                      <WhatsappShareButton url={window.location.href} style={{display:'inline-block'}}>
                        <WhatsappIcon size={42} round={true}/>
                      </WhatsappShareButton>&nbsp;
                      <TwitterShareButton url={window.location.href} style={{display:'inline-block'}}>
                        <TwitterIcon size={42} round={true}/>
                      </TwitterShareButton>&nbsp;
                      <GooglePlusShareButton url={window.location.href} style={{display:'inline-block'}}>
                        <GooglePlusIcon size={42} round={true}/>
                      </GooglePlusShareButton>
                    </div>
                  }
                  children={
                    <img src="/img/connect.png" onClick={()=> this.setState({ pop1: true})} style={{marginTop:'10px',cursor:'pointer'}}/>
                  }
                />
                
              </div>
              <div className="col-md-4 hidden-xs hidden-sm">
                <span className="pull-right">Price per night</span><br/>
                {hotel.roomsCategory !== null &&
                  <span className="hotel-price pull-right">Rp {formatRp(roomsCat[0].roomType.totalPrice)}</span>
                }
                <div className="clear"></div>
                <button type="button" onClick={this.handleBookTop} className="btn btn-book pull-right">Book Now</button>
              </div>
              <div className="clear"></div>
              <div className="image-detail" style={{marginTop:'20px'}}>
              <div className="col-md-8">
                <ImageGallery items={images} />
              </div>
              <div className="col-md-4">
                <div className="name-big">
                  <span>{hotel.hotelName}</span>
                </div>
                <div className="row mainf">
                  {hotel.facility.map((item, index) => {
                    if(item.category.trim() === 'Swimming Pool') {
                      return (
                       <div className="col-md-4" style={{marginBottom:'10px'}}>
                          <img src="/img/swim.png"/>
                          <span>{item.facility_name}</span>
                        </div>
                      )
                    }

                    if(item.facility_name.trim() === 'Free WiFi' && item.type.trim() === 'PropertyAmenity') {
                      return (
                        <div className="col-md-4" style={{marginBottom:'10px'}}>
                          <img src="/img/wifi.png"/>
                          <span>Free Wifi</span>
                        </div>
                      )
                    }

                    if(item.facility_name.trim() === '24-hour front desk') {
                      return (
                        <div className="col-md-4" style={{marginBottom:'10px'}}>
                          <img src="/img/24.png"/>
                          <span>24/7 Frontdesk</span>
                        </div>
                      )
                    }
                  
                  
                  
                  })
            
                  }
                  
                  <div className="col-md-12">
                    <hr/>
                    <p>{hotel.description || hotel.address1}</p>
                    <hr/>
                  </div>
                  {/*
                  <div className="col-md-12">
                    <h4 style={{marginTop:'0px',fontWeight:'600'}}>Hotel Score</h4>
                  </div>   
                  <div className="col-md-6">
                    <caption>
                      <div class="media" style={{width:'145px'}}>
                        <div class="media-left">
                          <div className="score" style={{background:'#c4d1da',color:'#FFF'}}>
                            {hotel.hotelScore}
                          </div>
                        </div>
                        <div class="media-body" >
                          <h4 class="media-heading" style={{marginTop:'10px'}}>Very Good</h4>
                        </div>
                      </div>
                  </caption>
                  </div> 
                  <div className="col-md-3">
                    <p style={{marginTop:'5px'}}>Clean<br/>9.0</p>
                  </div>
                  <div className="col-md-3">
                    <p style={{marginTop:'5px'}}>Staff<br/>8.0</p>
                  </div>*/}
                </div>
                {hotel.tripAdvisorRatingUrl &&
                <div>
                <img width="80" src={hotel.tripAdvisorRatingUrl}/>
                <span style={{color:'#808080',fontSize:'14px',marginLeft:'10px'}}>Based on {hotel.tripAdvisorReviewCount} guest reviews</span>
                </div>
                }
              </div>
              </div>
              <div className="clear"></div>

              <hr style={{height:'1px',color:'#CCC',background:'#CCC'}}/>
              <div className="col-md-6">
                <MyMapComponent isMarkerShown 
                googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyAq1K9Zp2z7Wp1PnXOz2RyveR53_lMpF5M&v=3.exp&libraries=geometry,drawing,places"
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `400px` }} />}
                mapElement={<div style={{ height: `100%` }} />}
                lat={hotel.latitude}
                lng={hotel.longitude}
                />
              </div>
              <div className="col-md-6">
                <p style={{fontSize:'14px',margin:0}}>{hotel.cityName}</p>
                <p style={{fontWeight:'600',fontSize:'15px',margin:0}}>{hotel.hotelName}</p>
                <span style={{fontSize:'14px',margin:0}}>{hotel.website}</span>
                
                <br/><br/><br/><br/>
                <p style={{fontSize:'14px'}}>Nearby Interest</p>
                <p style={{fontSize:'14px'}}>{hotel.locationName}</p>
                {/*<ul style={{padding:0,listStyle:'none',fontSize:'14px'}}>
                  <li style={{width:'250px'}}>Plaza Glodok <span className="pull-right">0.6 km</span></li>
                  <li style={{width:'250px'}}>Plaza Glodok <span className="pull-right">0.6 km</span></li>
                  <li style={{width:'250px'}}>Plaza Glodok Lorem<span className="pull-right">0.6 km</span></li>
                  <li style={{width:'250px'}}>Plaza Glodok <span className="pull-right">0.6 km</span></li>
                  <li style={{width:'250px'}}>Plaza Glodok <span className="pull-right">0.6 km</span></li>
                  <li style={{width:'250px'}}>Plaza Glodok <span className="pull-right">0.6 km</span></li>
                  <li style={{width:'250px'}}>Plaza Glodok Ipsum<span className="pull-right">0.6 km</span></li>
                </ul>*/}
              </div>
          </div>
          }
        </div>
      </div>
        {hotel.roomsCategory !== null && hotel.hotelName != '' &&
        <div className="room-cat">
        <div className="container">
        <div className="row">
           <div className="col-md-12">
            <h4>Room Category</h4>
          </div>
        </div>
        <div className="row">
         
          {roomsCat.map((item, index) => (
            <div className="room-card">
              {item.roomImage !== null &&
              <div className="col-md-2">
                <img src={item.roomImage[0]} style={{width:'100%'}}/>
              </div>
              }
              {item.roomImage == null &&
              <div className="col-md-2">
                {index < images.length &&
                <img src={images[index].thumbnail} style={{width:'100%'}}/>
                }
              </div>
              }
              <div className="col-md-3">
                <h3>{item.name}</h3>
                {item.roomList !== null &&
                <p style={{fontSize:'15px',color:'#808080'}}>Max Guest {item.roomList[0].maxOccupancy} person(s)</p>
                }
                <p>{(item.isRefundable) ? 'Refundable': 'Non Refundable'}<br/>
                {item.bfTypeName.toLowerCase()}
                </p>
               
              </div>
              <div className="col-md-4">
                {item.cancellationPolicies.length > 0 &&
                  <span style={{fontSize:'15px',color:'#808080'}}>{item.cancellationPolicies[0].description}</span>
                }
                {!item.cancellationPolicies.length > 0 &&
                  <span style={{fontSize:'15px',color:'#808080'}}>x Cancellation Policy Applies</span>
                }
              </div>
              <div className="col-md-1">

              </div>
              <div className="col-md-2">
                <span className="pull-right room-price">Rp {formatRp(item.netPrice)}</span><br/>
                <button type="button" onClick={this.handleBook.bind(this, index)} className="btn btn-book">Book Now</button>
              </div>
              <div className="clear"></div>
            </div>
          ))}
        </div>
        </div>
        </div>
        }
        <div className="modal-loading" >
        <Modal open={this.state.open} onClose={this.onCloseModal} little showCloseIcon={false}>
          <img src="/img/iconmodal.png" width="85" />
          <p>{this.state.errorMsg}</p>
          <button className="btn btn-choose" style={{float:'none',display:'block',margin:'auto'}}
          onClick={() => history.push('/')}>Ok</button>
        </Modal>
      </div>      
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hotel: state.searchHotel.hotelDetail.hotel,
  hotelBook: state.searchHotel.hotelBook
})

const mapDispatchToProps = dispatch => bindActionCreators({
  postBookHotel,
  getHotelDetail
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HotelDetail)
