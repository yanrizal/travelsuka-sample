import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { getPriceChanged, getHotelBooking } from '../../modules/searchHotel';
import queryString from 'query-string';
import formatRp from '../../custom/formatRp';
import ToggleButton from 'react-toggle-button';
import ModalPopup from '../../components/modal';
import { sessionId } from '../../config';
import { history } from '../../store';
import Modal from 'react-responsive-modal';
import { snapTokenRequest, saveOfflinePayment } from '../../modules/auth';
import snap from 'snap';
import moment from 'moment';
let countdownTimer;


class HotelPayment extends React.Component {

  state = {
    voucher: false,
    countdown: '',
    time: 0,
    open: false,
    open2: false,
    open3: false,
    errorMsg: '',
    bankTransfer: '',
    oldPrice: '',
    newPrice: '',
    payload: {},
    duration: ''
  }

  componentDidMount(){
    window.scrollTo(0, 0);
    const self = this;
    this.onOpenModal();
    this.props.getHotelBooking({
      transactionNo: this.props.match.params.id,
      sessionId: sessionId,
    }).then((result) => {
      this.onCloseModal();
      console.log(result.hotelBookingInfo.checkInDate, result.hotelBookingInfo.checkOutDate)
      const d1 = moment(result.bookingDate);
      const d2 = moment(result.paymentTimeLimit)
      const mm = d2.diff(d1, 'seconds');
      this.setState({
        time: mm,
        duration: self.duration(result.hotelBookingInfo.checkInDate, result.hotelBookingInfo.checkOutDate)
      })
      countdownTimer = setInterval(() => {
        self.timer();
      }, 1000)
    }).catch(() => {
      this.onOpenModal2();
      this.setState({
        errorMsg: 'transaction No wrong'
      })
    })

    
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

  onOpenModal3 = () => {
    this.setState({ open3: true });
  };

  onCloseModal3 = () => {
    this.setState({ open3: false });
    this.midtrans(this.state.payload);
  };

  onBankTransferChanged = (e) => {
    this.setState({
      bankTransfer: e.currentTarget.value
    });
  }

  duration = (sd, ed) => {
    const std = moment(sd, 'YYYY-MM-DD');
    const edd = moment(ed, 'YYYY-MM-DD');
    return Math.round((edd - std) / (1000 * 60 * 60 * 24));
  }

  handlePaymentCC = (name, e) => {
    const { transactionNo, hotelSummary } = this.props;
    let payload = {
      PaymentChannel : name,
      PaymentCode: hotelSummary.transactionNo,
      Amount: hotelSummary.totalPrice,
      CreditCardFee: null,
      TimeLimit: hotelSummary.paymentTimeLimit,
      PaymentType:"PAYMENT",
    }
    console.log(payload)
    this.onOpenModal();
    this.props.getPriceChanged({
      transactionNo: transactionNo,
      sessionId: sessionId, 
    }).then((result) => {
      this.onCloseModal();
      console.log(result)
      if (result.priceChanged == false) {
        this.midtrans(payload);
      } else {
        this.onOpenModal3();
        this.setState({
          oldPrice: result.oldPrice,
          newPrice: result.newPrice,
          payload: payload
        },() => {
          
        })
      }
    }).catch((err) => {
      this.onCloseModal();
      this.onOpenModal2();
      this.setState({errorMsg:err})
    })
    
  }

  handlePayment = (channel, e) => {
    const { transactionNo, hotelSummary } = this.props;
    this.props.saveOfflinePayment({
      offlinechannel : channel,
      transId: hotelSummary.transactionNo,
    }).then((response) => {
        console.log(response)
        if (response.data.Code === "01") {
          history.push('/hotel/thankyou/' + hotelSummary.transactionNo)
        } else {
          alert(response.data.Description)
        }
    })
    
  }

  midtrans = (payload) => {
    const { hotelSummary } = this.props;
    this.props.snapTokenRequest(payload).then((token) => {
        snap.pay(token, 
        {
          // TODO implement these callbacks
          onSuccess: function(result){
            console.log(result);
            history.push('/hotel/thankyou/' + hotelSummary.transactionNo)
            //changeResult('success', result);
          },
          onPending: function(result){
            console.log(result);
            //changeResult('pending', result);
          },
          onError: function(result){
            console.log(result);
            //changeResult('error', result);
          },
          onClose: function (result) {
          
          }
        })
    })
  }

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
      countdown: `${hours}:${minutes}:${remainingSeconds}`
    })
    // document.getElementById('countdown').innerHTML = days + ":" + hours + ":" + minutes + ":" + remainingSeconds;
    if (time == 0) {
        clearInterval(countdownTimer);
        //document.getElementById('countdown').innerHTML = "Completed";
    } else {
        this.setState({
          time: time - 1
        })
    }
}

  render() {
    const { hotel, hotelBook, hotelSummary } = this.props
    return (
      <div className="jumbotron" style={{marginBottom:0, background:'#FFF'}}>
      <div className="top-book">
        <div className="container">
        <div className="row">
        <div className="col-md-12">
          <h1>Payment</h1>
        </div>
        </div>
        </div>
      </div>
      <div className="container">

        <div className="col-md-8">
          <div className="book-form">
          <div className="row" style={{margin:0}}>
            <ul className="nav nav-pills nav-stacked col-md-2">
              <li className="active"><a href="#tab_b" data-toggle="pill">CC</a></li>
              <li><a href="#tab_a" data-toggle="pill">Bank Transfer</a></li>
              {/*<li><a href="#tab_c" data-toggle="pill">Virtual Account</a></li>*/}
            </ul>
            <div className="tab-content col-md-10">
              <p>Complete payment in {this.state.countdown}</p>
              <div className="tab-pane" id="tab_a">
                  <h4>Bank Transfer</h4>
                  <div className="alert alert-info" role="alert">
                    You can transfer from any banking channel (m-banking, SMS banking or ATM).
                  </div>
                  <p>Select a Destination Account</p>
                  <div className="radio">
                    <label className="pull-left">
                    <input type="radio" name="optradio" value={"004102"}  
                      checked={this.state.bankTransfer === "004102"} 
                      onChange={this.onBankTransferChanged}/>    
                    <span className="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>BCA</label>
                    <img src="/img/bca.png"  className="pull-right" />
                    <div className="clear"></div>
                  </div>
                  {this.state.bankTransfer === "004102" &&
                    <div className="radio">
                      <p>Transfer (melalui ATM/Internet Banking/SMS Banking) dengan tujuan</p>
                      <div className="alert alert-warning">
                        <p>Informasi Penting<br/>
                        mengikuti regulasi bank terkait, proses bank transfer hanya dapat di lakukan antara pukul 06:00 - 21:00</p>
                      </div>
                      <p>Klik "Process To Payment" dan lanjutkan dengan melakukan pembayaran melalui transfer bank dengan nominal disamping.</p>
                      <div className="clear"></div>
                    </div>
                  }
                  <div className="radio">
                    <label className="pull-left">
                    <input type="radio" name="optradio" value={"004101"}  
                      checked={this.state.bankTransfer === "004101"} 
                      onChange={this.onBankTransferChanged}/>
                    <span className="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>Mandiri</label>
                    <img src="/img/mandiri.png" className="pull-right" />
                    <div className="clear"></div>
                  </div>
                  {this.state.bankTransfer === "004101" &&
                    <div className="radio">
                      <p>Transfer (melalui ATM/Internet Banking/SMS Banking) dengan tujuan</p>
                      <div className="alert alert-warning">
                        <p>Informasi Penting<br/>
                        mengikuti regulasi bank terkait, proses bank transfer hanya dapat di lakukan antara pukul 06:00 - 21:00</p>
                      </div>
                      <p>Klik "Process To Payment" dan lanjutkan dengan melakukan pembayaran melalui transfer bank dengan nominal disamping.</p>
                      <div className="clear"></div>
                    </div>
                  }
                  {/*<div className="radio">
                    <label className="pull-left">
                    <input type="radio" name="optradio" value={"bri_epay"}  
                      checked={this.state.bankTransfer === "bri_epay"} 
                      onChange={this.onBankTransferChanged}/>
                    <span className="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>BRI</label>
                    <img src="/img/bri.png" className="pull-right" />
                    <div className="clear"></div>
                  </div>*/}
                  <button type="button" className="btn btn-choose pull-right" onClick={this.handlePayment.bind(this, this.state.bankTransfer)}>Process To Payment</button>
              </div>
              <div className="tab-pane active" id="tab_b">
                   <h4>Credit Card 
                   <span className="pull-right" style={{marginTop:'-20px'}}>
                   <img src="/img/secure.png" width="100"/>&nbsp;
                   <img src="/img/visa.png" width="50"/>&nbsp;
                   <img src="/img/mastercard.png" width="50"/></span></h4>
                   <div className="clear"></div>
                   <button type="button" onClick={this.handlePaymentCC.bind(this, "credit_card")} className="btn btn-choose pull-right">Process To Payment</button>
                  
              </div>
              <div className="tab-pane" id="tab_c">
                  <h4>Virtual Account 
                   <span className="pull-right" style={{marginTop:'-10px'}}>
                   <img src="/img/atm1.png" width="30"/>&nbsp;
                   <img src="/img/prima.png" width="30"/>&nbsp;
                   <img src="/img/alto.png" width="30"/></span></h4>
                   <div className="clear"></div>
                  <span>Read Before You Pay</span>
                  <ul style={{border:'1px solid #CCC',padding:'20px 20px 20px 40px',marginTop:'10px'}}>
                    <li>This method is only for payments from ATM machines in ATM Bersama, PRIMA, and ALTO networks.</li>
                    <li>Choose Bank Transfer method (not Automatic ATM), If you want to make payment via SMS Banking, Internet Banking, or teller.</li>
                  </ul>
                  <button type="button" onClick={this.handlePaymentCC.bind(this, "bank_transfer")} className="btn btn-choose pull-right" style={{marginTop:'20px'}}>Process To Payment</button>
              </div>
              <div className="tab-pane" id="tab_d">
                   <h4>VA</h4>
              </div>

              
            <br/>
          
          <div className="clear"></div>
            <hr/>
            <div style={{float:'left'}}>
              <ToggleButton
                inactiveLabel={<span></span>}
                activeLabel={<span></span>}
                value={this.state.voucher}
                onToggle={(voucher) => {
                  this.setState({
                    voucher: !voucher,
                  })
                }} />
                </div>&nbsp;
              <span>Add Voucher/Promo Code</span>
              {this.state.voucher &&
                <form class="form-inline">
                  <br/>
                  <div class="form-group">
                    <input type="text" class="form-control" placeholder="Example:CHEAP" style={{marginRight:'20px'}}/>
                  </div>
                  <button type="submit" class="btn btn-primary">Use Voucher</button>
                </form>
              }
            </div>
          </div>

          </div>
          
        </div>
        <div className="col-md-4">
          <div className="book-form">
            <h3>Booking Detail</h3><hr style={{height:'1px',color:'#CCC',background:'#CCC'}}/>
            <div className="row">
              <div className="col-md-4">
                <img src={hotelSummary.hotelBookingInfo.heroImage} style={{width:'100%'}}/>
              </div>
              <div className="col-md-8">
                <p style={{marginBottom:0}}>{hotelSummary.hotelBookingInfo.hotelName}</p>
                <p style={{fontSize:'12px'}}>{hotelSummary.hotelBookingInfo.address1}</p>
              </div>
            </div>
            <hr style={{color:'#CCC',background:'#CCC'}}/>
            <div className="row book-detail">
              <div className="col-md-12">
                <p><span>Duration</span>{this.state.duration} Night(s)</p>
                <p><span>Check-in</span>{hotelSummary.hotelBookingInfo.checkInDate}</p>
                <p><span>Check-out</span>{hotelSummary.hotelBookingInfo.checkOutDate}</p>
                <p><span>No. of rooms</span>{hotelSummary.hotelBookingInfo.roomInfo.roomList.length}</p>
                <p><span>Customer</span>{hotelSummary.customer.firstName} {hotelSummary.customer.lastName}</p>
              </div>
            </div>
          </div>
          <br/>
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
        </div>
      </div>
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
  getPriceChanged,
  snapTokenRequest,
  getHotelBooking,
  saveOfflinePayment
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HotelPayment)
