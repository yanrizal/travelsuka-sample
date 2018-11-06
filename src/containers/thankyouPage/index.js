import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { getHotelBooking } from '../../modules/searchHotel';
import { setSelectedFlight, setSelectedFlight2, retreiveBookingFlight } from '../../modules/searchFlight';
import queryString from 'query-string';
import formatRp from '../../custom/formatRp';
import ToggleButton from 'react-toggle-button';
import { history } from '../../store';
import Modal from 'react-responsive-modal';
import ModalPopup from '../../components/modal';
import { sessionId } from '../../config';
let countdownTimer;

class ThankYouPage extends React.Component {

  state = {
    voucher: false,
    countdown: '',
    time: 30,
  }

  componentDidMount() {
    const { getHotelBooking } = this.props;
    const self = this;
    this.onOpenModal2();
    this.props.retreiveBookingFlight({
      transactionId: this.props.match.params.id,
      phoneNumber: this.props.match.params.phone,
      sessionId: sessionId,
    }).then(() => {
      this.onCloseModal2();
    }).catch(() => {
      this.onOpenModal();
      this.setState({
        errorMsg: 'transaction ID wrong'
      })
    })
    countdownTimer = setInterval(() => {
      self.timer();
    }, 1000)
  }

  onOpenModal2 = () => {
    this.setState({ open2: true });
  };

  onCloseModal2 = () => {
    this.setState({ open2: false });
  };

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
    history.push('/retreive/booking')
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
    const { bookingSummary, twoway } = this.props;

    const bkSummary = bookingSummary.bookingsSummary[0];
    const bkSummary2 = (bookingSummary.bookingsSummary.length > 1) ? bookingSummary.bookingsSummary[1] : bookingSummary.bookingsSummary[0];
    
    return (
      <div className="jumbotron" style={{marginBottom:0}}>
      <div className="container">
        <div className="thanks-page">
          <h2>Thank You</h2>
          <p style={{fontSize:'18px',textAlign:'center'}}>Your Payment completed successfully</p>
          <img src="/img/iconmodal.png" width="85" style={{display:'block',margin:'auto'}} /><br/>
          {/* One way */}
          {bookingSummary.bookingsSummary.length == 1 && bkSummary.flightJourneys.length == 1 &&
          <div className="book-form price-detail-box">
            <div className="total-top">
              <h3>Rp {formatRp(bkSummary.totalCost)}</h3>
              <span style={{fontSize:'12px'}}>Grand Total</span>
            </div>
            <div className="book-form pd-box" style={{boxShadow:'none',border:'1px solid rgba(204, 204, 204, 0.2)'}}>
              <p>Transaction Id: <span className="pull-right">{bookingSummary.transactionId}</span></p>
              <hr/>
              {bkSummary.passengers.map((contact) => (
                <p>{contact.title} {contact.firstName} {contact.lastName}<span className="pull-right">{contact.paxType}</span></p>
              ))}
              <hr/>
              <p>Basic Fare: <span className="pull-right">Rp {formatRp(bkSummary.basicFare)}</span></p>
              <p>Tax and Fee:  <span className="pull-right">Rp {formatRp(bkSummary.taxAndFee)}</span></p>
            </div>
            <div className="total-bot">
              <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bkSummary.totalCost)}</span></p>
            </div>
             
          </div>
          }
        
           {/* Two way same flight */}
          {bookingSummary.bookingsSummary.length == 1 && bkSummary.flightJourneys.length > 1 &&
          <div className="book-form price-detail-box">
            <div className="total-top">
              <h3>Rp {formatRp(bkSummary.totalCost)}</h3>
              <span style={{fontSize:'12px'}}>Grand Total Pulang Pergi</span>
            </div>
            <div className="book-form pd-box" style={{boxShadow:'none',border:'1px solid rgba(204, 204, 204, 0.2)'}}>
              <p>Transaction Id: <span className="pull-right">{bookingSummary.transactionId}</span></p>
              <hr/>
              {bkSummary.passengers.map((contact) => (
                <p>{contact.title} {contact.firstName} {contact.lastName}<span className="pull-right">{contact.paxType}</span></p>
              ))}
              <hr/>
              <p>Basic Fare: <span className="pull-right">Rp {formatRp(bkSummary.basicFare)}</span></p>
              <p>Tax and Fee:  <span className="pull-right">Rp {formatRp(bkSummary.taxAndFee)}</span></p>
            </div>
            <div className="total-bot">
              <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bkSummary.totalCost)}</span></p>
            </div>
             
          </div>
          }

          {/* Two way diff flight */}
          {typeof bookingSummary.bookingsSummary[1] !== 'undefined' &&
          <div className="book-form price-detail-box">
            <div className="total-top">
              <h3>Rp {formatRp(bkSummary2.totalCost + bkSummary.totalCost)}</h3>
              <span style={{fontSize:'12px'}}>Grand Total Pulang Pergi</span>
            </div>
            <div className="book-form pd-box">
              <p>Transaction Id: <span className="pull-right">{bookingSummary.transactionId}</span></p>
              <hr/>
              {bkSummary.passengers.map((contact) => (
                <p>{contact.title} {contact.firstName} {contact.lastName}<span className="pull-right">{contact.paxType}</span></p>
              ))}
              <hr/>
              <p>Basic Fare: <span className="pull-right">Rp {formatRp(bkSummary2.basicFare + bkSummary.basicFare)}</span></p>
              <p>Pax Service Charge (PSC):  <span className="pull-right">Rp {formatRp(bkSummary2.taxAndFee + bkSummary.taxAndFee)}</span></p>
            </div>
            <div className="total-bot">
              <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bkSummary2.totalCost + bkSummary.totalCost)}</span></p>
            </div>
          </div>
          }
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
  bookingSummary: state.searchFlight.bookingSummary,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  retreiveBookingFlight
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThankYouPage)
