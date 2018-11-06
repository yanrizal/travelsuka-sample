import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { getPriceChanged, getHotelBooking } from '../../modules/searchHotel';
import queryString from 'query-string';
import formatRp from '../../custom/formatRp';
import ToggleButton from 'react-toggle-button';
import { history } from '../../store';
import ModalPopup from '../../components/modal';
import { sessionId } from '../../config';
import Modal from 'react-responsive-modal';

let countdownTimer;


class ThankYouPage extends React.Component {

  state = {
    voucher: false,
    countdown: '',
    time: 30,
  }

  componentDidMount(){
    const { getHotelBooking } = this.props;
    const self = this;
    this.onOpenModal();
    this.props.getHotelBooking({
      transactionNo: this.props.match.params.id,
      sessionId: sessionId,
    }).then((result) => {
      this.onCloseModal();
      console.log(result.hotelBookingInfo.checkInDate, result.hotelBookingInfo.checkOutDate)
      // this.setState({
      //   duration: self.duration(result.hotelBookingInfo.checkInDate, result.hotelBookingInfo.checkOutDate)
      // })
    })
    countdownTimer = setInterval(() => {
      self.timer();
    }, 1000)
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  onOpenModal2 = () => {
    this.setState({ open2: true });
  };

  onCloseModal2 = () => {
    this.setState({ open2: false });
  };

  timer() {
    const { time } = this.state;
    var days        = Math.floor(time/24/60/60);
    var hoursLeft   = Math.floor((time) - (days*86400));
    var hours       = Math.floor(hoursLeft/3600);
    var minutesLeft = Math.floor((hoursLeft) - (hours*3600));
    var minutes     = Math.floor(minutesLeft/60);
    var remainingSeconds = time % 60;
    if (remainingSeconds < 10) {
        remainingSeconds = "0" + remainingSeconds; 
    }
    this.setState({
      countdown: `${remainingSeconds}`
    })
    // document.getElementById('countdown').innerHTML = days + ":" + hours + ":" + minutes + ":" + remainingSeconds;
    if (time == 0) {
        clearInterval(countdownTimer);
        history.push('/')
        //document.getElementById('countdown').innerHTML = "Completed";
    } else {
        this.setState({
          time: time - 1
        })
    }
}

  render() {
    const { hotelSummary } = this.props
    return (
      <div className="jumbotron" style={{marginBottom:0}}>
      <div className="container">
        <div className="thanks-page">
          <h2>Thank You</h2>
          <p style={{fontSize:'18px',textAlign:'center'}}>Your Payment completed successfully</p>
          <img src="/img/iconmodal.png" width="85" style={{display:'block',margin:'auto'}} /><br/>
          <div className="book-form price-detail-box">
            <div className="book-form pd-box" style={{boxShadow:'none',border:'1px solid rgba(204, 204, 204, 0.2)'}}>
              <p><span className="pull-left" style={{width:'150px',display:'block'}}>Transaction No:</span>
              <span className="pull-right">{hotelSummary.transactionNo}</span></p>
              <div className="clear"></div>
              <p>{hotelSummary.hotelBookingInfo.roomInfo.bfTypeName}</p>
              <p>Cancellation Policy</p>
              {hotelSummary.hotelBookingInfo.roomInfo.isRefundable == false &&
                <p>This reservation is non-refundable</p>
              }
              {hotelSummary.hotelBookingInfo.roomInfo.isRefundable == true &&
                <p>This reservation is refundable</p>
              }

              <hr style={{color:'#CCC',background:'#CCC',height:'1px'}}/>
              <p><span className="pull-left" style={{width:'200px',display:'block'}}>
              {hotelSummary.hotelBookingInfo.roomInfo.name} ({this.state.duration} Night) x {hotelSummary.hotelBookingInfo.roomInfo.roomList.length} </span>
              <span className="pull-right">Rp {formatRp(hotelSummary.hotelBookingInfo.roomInfo.grossPrice)}</span></p>
              <div className="clear"></div>
              <p>{hotelSummary.hotelBookingInfo.roomInfo.additionalFees[0].type}<span className="pull-right">Rp {formatRp(hotelSummary.hotelBookingInfo.roomInfo.additionalFees[0].amount)}</span></p>
              <div className="clear"></div>
            </div>
            <div className="total-bot">
              <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(hotelSummary.totalPrice)}</span></p>
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
            <div className="modal-loading" >
              <Modal open={this.state.open2} onClose={this.onCloseModal2} little showCloseIcon={false}>
                <img src="/img/iconmodal.png" width="85" />
                <p>{this.state.errorMsg}</p>
                <button className="btn btn-choose" style={{float:'none',display:'block',margin:'auto'}}
                onClick={this.onCloseModal2}>Ok</button>
              </Modal>
            </div> 
            <div className="modal-loading" >
              <Modal open={this.state.open3} onClose={this.onCloseModal3} little showCloseIcon={false}>
                <img src="/img/iconmodal.png" width="85" />
                <p>Price Changed from {formatRp(this.state.oldPrice)} to {formatRp(this.state.newPrice)}</p>
                <button className="btn btn-choose" style={{float:'none',display:'block',margin:'auto'}}
                onClick={this.onCloseModal3}
                >Ok</button>
              </Modal>
            </div> 
            <ModalPopup open={this.state.open} 
              onCloseModal={this.onCloseModal} 
              onOpenModal={this.onOpenModal}/>
          </div>
          <br/>
          <div class="alert alert-warning" role="alert">
            <p style={{textAlign:'center'}}>Payment procedures will be attached via email</p>
          </div>
          <p style={{textAlign:'center'}}>you will be redirected in 30 seconds</p>
          <p style={{textAlign:'center'}}>{this.state.countdown}</p>
        </div>
      </div>
      <br/><br/><br/><br/><br/><br/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
 hotelBook: state.searchHotel.hotelBook,
  hotelReview: state.searchHotel.hotelReview,
  hotelSummary: state.searchHotel.hotelSummary,
  hotel: state.searchHotel.hotelDetail.hotel,
  transactionNo: state.searchHotel.transactionNo,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getHotelBooking
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThankYouPage)
