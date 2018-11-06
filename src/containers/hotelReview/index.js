import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { getHotelBooking } from '../../modules/searchHotel';
import queryString from 'query-string';
import formatRp from '../../custom/formatRp';
import { history } from '../../store';
import { sessionId } from '../../config';
import moment from 'moment';

class HotelBooking extends React.Component {

  state = {
    errors:{},
    firstName: '',
    lastName: ''
  }

  componentDidMount(){
    console.log('transactionNo', this.props.transactionNo)
    window.scrollTo(0, 0);
    const { transactionNo } = this.props;
    this.props.getHotelBooking({
      transactionNo: transactionNo,
      sessionId: sessionId, 
    }).then((result) => {
      console.log(result)
    }).catch((err) => {
      alert(err)
    })
  }

  handleChangeInput = (name, e) => {
    this.setState({
      [name]: e.target.value
    })
  }


  render() {
    const { hotel, hotelBook, hotelReview, bookingData } = this.props;
    const checkIn = moment(hotelBook.checkIn, 'YYYY-MM-DD');
    const checkOut = moment(hotelBook.checkOut, 'YYYY-MM-DD');

    return (
      <div className="jumbotron" style={{marginBottom:0,background:'#FFF'}}>
      <div className="top-book">
        <div className="container">
        <div className="row">
        <div className="col-md-12">
          <h1>Hotel Review</h1>
        </div>
        </div>
        </div>
      </div>
      <div className="container">
          <br/>
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-6">
               <img src={hotel.heroImage} style={{width:'100%'}}/>
            </div>
            <div className="col-md-6 ht-book-detail">
              <h2>Booking Detail</h2>
              <span>{hotel.hotelName}</span>
              <p>
                Room Type
              </p>
              <span>{hotel.roomsCategory[0].name}</span>

              <div className="row">
                <div className="col-md-4">
                  <p>No. Room</p>
                  <span>{hotelBook.noOfRoom} Room</span>
                </div>
                <div className="col-md-4">
                  <p>Guest</p>
                  <span>1 Guest</span>
                </div>
                <div className="col-md-4">
                  <p>Duration</p>
                  <span>{hotelBook.duration} night</span>
                </div>
              </div>

              <div className="row">
                <div className="col-md-5">
                  <p>Check-in</p>
                  <div class="media">
                  <div class="media-left">
                    <span className="sp-check">{checkIn.format('D')}</span>
                  </div>
                  <div class="media-body">
                    <h4 class="media-heading">{checkIn.format('MMM')}</h4>
                    <p style={{margin:0}}>{checkIn.format('dddd')}</p>
                  </div>
                </div>
                </div>
                <div className="col-md-2" >
                  <div style={{borderTop:'1px solid #CCC',marginTop:'60px'}}></div>
                </div>
                <div className="col-md-5">
                  <p>Check-out</p>
                  <div class="media">
                  <div class="media-left">
                    <span className="sp-check">{checkOut.format('D')}</span>
                  </div>
                  <div class="media-body">
                    <h4 class="media-heading">{checkOut.format('MMM')}</h4>
                    <p style={{margin:0}}>{checkOut.format('dddd')}</p>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="your-i">Your Information</h3>
          <div className="clear"></div>
          <div className="book-form">

            <div className="row">
              <div className="col-md-4">
              <div className="form-group">
                <label>First name</label>
                <h4>{bookingData.customer.firstName}</h4>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Last name</label>
                <h4>{bookingData.customer.lastName}</h4>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Phone Number</label>
                <h4>{bookingData.customer.phoneNumber}</h4>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-group">
                <label>Email</label>
                <h4>{bookingData.customer.email}</h4>
              </div>
            </div>
          </div>
          </div>

          <button type="button" onClick={() => {history.push(`/booking/hotel/${this.props.transactionNo}`)}} className="btn btn-choose pull-right">Continue To Payment</button>

        </div>
        <div className="col-md-4">
          <div className="book-form price-detail-box">
            <div className="total-top">
              <h3>Rp {formatRp(hotelBook.room.netPrice)}</h3>
            </div>
            <div className="book-form pd-box">
              <p>{hotelBook.room.bfTypeName}</p>
              <p>Cancellation Policy</p>
              {hotelBook.room.isRefundable == false &&
                <p>This reservation is non-refundable</p>
              }
              {hotelBook.room.isRefundable == true &&
                <p>This reservation is refundable</p>
              }
              <hr style={{color:'#CCC',background:'#CCC'}}/>
              <p>{hotelBook.room.name} ({hotelBook.duration} Night) x {hotelBook.noOfRoom} 
              <span className="pull-right">Rp {formatRp(hotelBook.room.netPrice)}</span></p>
              <div className="clear"></div>
              <p>Tax <span className="pull-right">Rp {formatRp(hotelBook.room.commPrice)}</span></p>
              <div className="clear"></div>
            </div>
            <div className="total-bot">
              <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(hotelBook.room.netPrice)}</span></p>
            </div>
            {/*<div className="row">
              <div className="col-md-4">
                <img src={hotel.heroImage} style={{width:'100%'}}/>
              </div>
              <div className="col-md-8">
                <p>{hotel.hotelName}</p>
              </div>
            </div>
            <hr style={{color:'#CCC',background:'#CCC'}}/>
            <div className="row book-detail">
              <div className="col-md-12">
                <p><span>Duration</span>{hotelBook.duration}</p>
                <p><span>Check-in</span>{hotelBook.checkIn}</p>
                <p><span>Check-out</span>{hotelBook.checkOut}</p>
                <p><span>No. of rooms</span>{hotelBook.noOfRoom}</p>
              </div>
            </div>*/}
          </div>
        </div>
      </div>
     </div>
    );
  }
}

const mapStateToProps = state => ({
  hotel: state.searchHotel.hotelDetail.hotel,
  hotelBook: state.searchHotel.hotelBook,
  hotelReview: state.searchHotel.hotelReview,
  bookingData: state.searchHotel.bookingData,
  transactionNo: state.searchHotel.transactionNo,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getHotelBooking
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HotelBooking)
