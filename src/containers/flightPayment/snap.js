import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { setSelectedFlight, setSelectedFlight2 } from '../../modules/searchFlight';
import { snapTokenRequest, saveOfflinePayment } from '../../modules/auth';
import moment from 'moment';
import formatRp from '../../custom/formatRp';
import { Link } from 'react-router-dom';
import ToggleButton from 'react-toggle-button';
import { history } from '../../store';
import Modal from 'react-responsive-modal';
import snap from 'snap';
let countdownTimer;

class FlightPayment extends React.Component {

  state = {
    seat: {
      E: 'Economy',
      B: 'Business',
      F: 'First Class'
    },
    voucher: false,
    countdown: '',
    time: 0,
    cardNumber: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardCvv: '',
    secure: '',
    grossAmount: '',
    cardName: '',
    transfer: '',
    bankTransfer: '',
    basicFare: ''
  }

  componentDidMount(){
    const { bookingSummary, selectedFlight, selectedFlight2, twoway, sameFlight } = this.props;
    console.log('bookingSummary', bookingSummary.bookingsSummary[1]);
    console.log('selectedFlight', selectedFlight);
    window.scrollTo(0, 0);
    const item = this.props.selectedFlight
    const item2 = this.props.selectedFlight2
    let totalNewPrice = bookingSummary.bookingsSummary[0].totalCost;
    const tax = selectedFlight.flightSegments[0].fares[0].airportTax;
    let basicFare = bookingSummary.bookingsSummary[0].basicFare;
    // let totalAdultFare = this.props.adultCount * (item.flightSegments[0].fares[0].basicFare + item.flightSegments[0].fares[0].basicVat + item.flightSegments[0].fares[0].iwjr + item.flightSegments[0].fares[0].fuelSurcharge + item.flightSegments[0].fares[0].airportTax + item.flightSegments[0].fares[0].otherFee);
    // let totalChildFare = this.props.childCount * (item.flightSegments[0].fares[0].childFare + item.flightSegments[0].fares[0].basicVat + item.flightSegments[0].fares[0].iwjr + item.flightSegments[0].fares[0].fuelSurcharge + item.flightSegments[0].fares[0].airportTax + item.flightSegments[0].fares[0].otherFee);
    // let totalInfantFare = this.props.infantCount * (item.flightSegments[0].fares[0].infantFare + item.flightSegments[0].fares[0].infantVat + item.flightSegments[0].fares[0].iwjr);
    let totalAdultFare = 0
    let totalChildFare = 0
    let totalInfantFare = 0
    item.flightSegments.map((x, index) => {
      totalAdultFare = totalAdultFare + this.props.adultCount * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
      totalChildFare = totalChildFare + this.props.childCount * (x.fares[0].childFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
      totalInfantFare = totalInfantFare + this.props.infantCount * (x.fares[0].infantFare + x.fares[0].infantVat + x.fares[0].iwjr);
    })

    const bkSummary = bookingSummary.bookingsSummary[0];
    const bkSummary2 = (bookingSummary.bookingsSummary.length > 1) ? bookingSummary.bookingsSummary[1] : bookingSummary.bookingsSummary[0];
    let totalOldPrice =  totalAdultFare + totalChildFare + totalInfantFare;

    if (twoway && sameFlight) {
      const tax2 = selectedFlight2.flightSegments[0].fares[0].airportTax;
      basicFare = bookingSummary.bookingsSummary[0].basicFare;
      //let totalAdultFare2 = this.props.adultCount * (item2.flightSegments[0].fares[0].basicFare + item2.flightSegments[0].fares[0].basicVat + item2.flightSegments[0].fares[0].iwjr + item2.flightSegments[0].fares[0].fuelSurcharge + item2.flightSegments[0].fares[0].airportTax + item2.flightSegments[0].fares[0].otherFee);
      //let totalChildFare2 = this.props.childCount * (item2.flightSegments[0].fares[0].childFare + item2.flightSegments[0].fares[0].basicVat + item2.flightSegments[0].fares[0].iwjr + item2.flightSegments[0].fares[0].fuelSurcharge + item2.flightSegments[0].fares[0].airportTax + item2.flightSegments[0].fares[0].otherFee);
      //let totalInfantFare2 = this.props.infantCount * (item2.flightSegments[0].fares[0].infantFare + item2.flightSegments[0].fares[0].infantVat + item2.flightSegments[0].fares[0].iwjr);
      let totalAdultFare2 = 0
      let totalChildFare2 = 0
      let totalInfantFare2 = 0
      item2.flightSegments.map((x, index) => {
        totalAdultFare2 = totalAdultFare2 + this.props.adultCount * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
        totalChildFare2 = totalChildFare2 + this.props.childCount * (x.fares[0].childFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
        totalInfantFare2 = totalInfantFare2 + this.props.infantCount * (x.fares[0].infantFare + x.fares[0].infantVat + x.fares[0].iwjr);
      })
      totalOldPrice = totalOldPrice + totalAdultFare2 + totalChildFare2 + totalInfantFare2
    }

    if (twoway && !sameFlight) {
      if (bookingSummary.bookingsSummary.length > 1) {
        totalNewPrice = bookingSummary.bookingsSummary[0].totalCost + bkSummary2.totalCost;
      } else {
        totalNewPrice = bookingSummary.bookingsSummary[0].totalCost;
      }
      
      const tax2 = selectedFlight2.flightSegments[0].fares[0].airportTax;
      basicFare = bookingSummary.bookingsSummary[0].basicFare +  bkSummary2.basicFare;;
      //let totalAdultFare2 = this.props.adultCount * (item2.flightSegments[0].fares[0].basicFare + item2.flightSegments[0].fares[0].basicVat + item2.flightSegments[0].fares[0].iwjr + item2.flightSegments[0].fares[0].fuelSurcharge + item2.flightSegments[0].fares[0].airportTax + item2.flightSegments[0].fares[0].otherFee);
      //let totalChildFare2 = this.props.childCount * (item2.flightSegments[0].fares[0].childFare + item2.flightSegments[0].fares[0].basicVat + item2.flightSegments[0].fares[0].iwjr + item2.flightSegments[0].fares[0].fuelSurcharge + item2.flightSegments[0].fares[0].airportTax + item2.flightSegments[0].fares[0].otherFee);
      //let totalInfantFare2 = this.props.infantCount * (item2.flightSegments[0].fares[0].infantFare + item2.flightSegments[0].fares[0].infantVat + item2.flightSegments[0].fares[0].iwjr);
      let totalAdultFare2 = 0
      let totalChildFare2 = 0
      let totalInfantFare2 = 0
      item2.flightSegments.map((x, index) => {
        totalAdultFare2 = totalAdultFare2 + this.props.adultCount * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
        totalChildFare2 = totalChildFare2 + this.props.childCount * (x.fares[0].childFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
        totalInfantFare2 = totalInfantFare2 + this.props.infantCount * (x.fares[0].infantFare + x.fares[0].infantVat + x.fares[0].iwjr);
      })
      totalOldPrice = totalOldPrice + totalAdultFare2 + totalChildFare2 + totalInfantFare2
    }

    if (totalNewPrice !== totalOldPrice) {
      this.setState({
        open: true,
        errorMsg: `There is Update Total Price from Rp ${formatRp(totalOldPrice)} to Rp ${formatRp(totalNewPrice)}`,
      })
    }

    
    const d1 = moment(bookingSummary.bookingDate);
    const d2 = moment(bookingSummary.paymentTimeLimit)
    const mm = d2.diff(d1, 'seconds');
    this.setState({
      time: mm,
      basicFare: basicFare
    })
    const self = this;
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

  callback = e => {
    console.log(e)
  }

  onBankTransferChanged = (e) => {
    this.setState({
      bankTransfer: e.currentTarget.value
    });
  }

  card = e => {
    return {
      card_number: "4111111111111111",
      card_cvv: "123",
      card_exp_month: "12",
      card_exp_year: "2018",
      secure: true,
      gross_amount: 20000,
    }
  }

  handlePaymentCC = (name,e) => {
    const { bookingSummary, twoway, sameFlight } = this.props;
    let amount = bookingSummary.bookingsSummary[0].totalCost;
    if (twoway) {
      if (sameFlight) {
        amount = bookingSummary.bookingsSummary[0].totalCost;
      } else {
        amount = bookingSummary.bookingsSummary[0].totalCost + bookingSummary.bookingsSummary[1].totalCost;
      }
    }
    console.log({
      PaymentChannel : name,
      PaymentCode: bookingSummary.transactionId,
      Amount: amount,
      CreditCardFee: null,
      TimeLimit: bookingSummary.paymentTimeLimit,
      PaymentType:"PAYMENT",
    })
    this.props.snapTokenRequest({
      PaymentChannel : name,
      PaymentCode: bookingSummary.transactionId,
      Amount: amount,
      CreditCardFee: null,
      TimeLimit: bookingSummary.paymentTimeLimit,
      PaymentType:"PAYMENT",
    }).then((token) => {
        snap.pay(token, 
        {
          // TODO implement these callbacks
          onSuccess: function(result){
            console.log(result);
            history.push('/thankyou/' + bookingSummary.transactionId)
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
    // const payload = {
    //   card_number: this.state.cardNumber,
    //   card_exp_month: this.state.cardExpMonth,
    //   card_exp_year: this.state.cardExpYear,
    //   card_cvv: this.state.cardCvv,
    //   secure: true,
    //   gross_amount: 0
    // }
    // console.log(payload)
  }

  handleChangeInput = (name, e) => {
    this.setState({
      [name]: e.target.value
    })
  }

  handlePayment = (channel, e) => {
    const { bookingSummary, twoway, sameFlight } = this.props;
    let amount = bookingSummary.bookingsSummary[0].totalCost;
    if (twoway) {
      if (sameFlight) {
        amount = bookingSummary.bookingsSummary[0].totalCost;
      } else {
        amount = bookingSummary.bookingsSummary[0].totalCost + bookingSummary.bookingsSummary[1].totalCost;
      }
    }

    console.log(channel)

    this.props.saveOfflinePayment({
      offlinechannel : channel,
      transId: bookingSummary.transactionId,
    }).then((response) => {
      if (response.data.Code === "01") {
        history.push('/thankyou/' + bookingSummary.transactionId)
      } else {
        alert(response.data.Description)
      }
    })
  }

  timer() {
    const { time } = this.state;
    //console.log(time)
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
    const { bookingSummary, twoway } = this.props;
    //console.log('bookingSummary', bookingSummary)
    const bkSummary = bookingSummary.bookingsSummary[0];
    const bkSummary2 = (bookingSummary.bookingsSummary.length > 1) ? bookingSummary.bookingsSummary[1] : bookingSummary.bookingsSummary[0];
    //console.log('bkSummary2', bkSummary2)
    //console.log('selectedFlight', this.props.selectedFlight)
    const item = this.props.selectedFlight
    const item2 = this.props.selectedFlight2
    let totalAdultFare = this.props.adultCount * (item.flightSegments[0].fares[0].basicFare + item.flightSegments[0].fares[0].basicVat + item.flightSegments[0].fares[0].iwjr + item.flightSegments[0].fares[0].fuelSurcharge + item.flightSegments[0].fares[0].airportTax + item.flightSegments[0].fares[0].otherFee);
    let totalChildFare = this.props.childCount * (item.flightSegments[0].fares[0].childFare + item.flightSegments[0].fares[0].basicVat + item.flightSegments[0].fares[0].iwjr + item.flightSegments[0].fares[0].fuelSurcharge + item.flightSegments[0].fares[0].airportTax + item.flightSegments[0].fares[0].otherFee);
    let totalInfantFare = this.props.infantCount * (item.flightSegments[0].fares[0].infantFare + item.flightSegments[0].fares[0].infantVat + item.flightSegments[0].fares[0].iwjr);
    const tax = item.flightSegments[0].fares[0].airportTax;
    let totalAdultFare2 = this.props.adultCount * (item2.flightSegments[0].fares[0].basicFare + item2.flightSegments[0].fares[0].basicVat + item2.flightSegments[0].fares[0].iwjr + item2.flightSegments[0].fares[0].fuelSurcharge + item2.flightSegments[0].fares[0].airportTax + item2.flightSegments[0].fares[0].otherFee);
    let totalChildFare2 = this.props.childCount * (item2.flightSegments[0].fares[0].childFare + item2.flightSegments[0].fares[0].basicVat + item2.flightSegments[0].fares[0].iwjr + item2.flightSegments[0].fares[0].fuelSurcharge + item2.flightSegments[0].fares[0].airportTax + item2.flightSegments[0].fares[0].otherFee);
    let totalInfantFare2 = this.props.infantCount * (item2.flightSegments[0].fares[0].infantFare + item2.flightSegments[0].fares[0].infantVat + item2.flightSegments[0].fares[0].iwjr);
    const tax2 = item2.flightSegments[0].fares[0].airportTax;


    // const d1 = moment(item.flightSegments[0].std);
    // const d2 = moment(item.flightSegments[item.flightSegments.length - 1].sta)
    // const mm = d2.diff(d1, 'minutes');
    return (
      <div>
        <div className="jumbotron" style={{marginBottom:0,background:'#FFF'}}>
          <div className="top-book">
            <div className="container">
            <div className="row">
            <div className="col-md-12">
              <h1 style={{marginLeft:0}}>Payment</h1>
            </div>
            </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
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
                          <button type="button" onClick={this.handlePayment.bind(this, this.state.bankTransfer)} className="btn btn-choose pull-right" style={{marginTop:'20px'}}>Process To Payment</button>
                      </div>
                      <div className="tab-pane active" id="tab_b">
                           <h4>Credit Card 
                           <span className="pull-right" style={{marginTop:'-20px'}}>
                           <img src="/img/secure.png" width="100"/>&nbsp;
                           <img src="/img/visa.png" width="50"/>&nbsp;
                           <img src="/img/mastercard.png" width="50"/></span></h4>
                           <div className="clear"></div>

                          {/*<div className="row">
                            <div className="col-md-12">
                              <div className="form-group">
                                <label>Card number</label>
                                <input type="text" value={this.state.cardNumber} className="form-control" onChange={this.handleChangeInput.bind(this, 'cardNumber')}/>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Valid until</label>
                                <div className="row">
                                  <div className="col-md-6">
                                    <input type="text" value={this.state.cardExpMonth} className="form-control" onChange={this.handleChangeInput.bind(this, 'cardExpMonth')}/>
                                  </div>
                                  <div className="col-md-6">
                                    <input type="text" value={this.state.cardExpYear} className="form-control" onChange={this.handleChangeInput.bind(this, 'cardExpYear')}/>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>CVV</label>
                                <input type="text" value={this.state.cardCvv} className="form-control" onChange={this.handleChangeInput.bind(this, 'cardCvv')} />
                              </div>
                            </div>
                            <div className="col-md-12">
                              <div className="form-group">
                                <label>Name on Card</label>
                                <input type="text" value={this.state.cardName} className="form-control" onChange={this.handleChangeInput.bind(this, 'cardName')} />
                              </div>
                            </div>
                          </div>*/}
                          <button type="button" onClick={this.handlePaymentCC.bind(this, "credit_card")} className="btn btn-choose pull-right" style={{marginTop:'20px'}}>Process To Payment</button>
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
                    <br/><br/> 
  
                  </div>
              </div>
              </div>
            

              <div className="col-md-4">
             
              
              {this.props.twoway &&
                    <div className="book-form price-detail-box">
                    <div className="total-top">
                      <h3>Rp {formatRp(bookingSummary.total)}</h3>
                      <span style={{fontSize:'12px'}}>Grand Total</span>
                    </div>
                    </div>
                }
                {!this.props.sameFlight && bookingSummary.bookingsSummary.length > 1 &&
                <div className="book-form price-detail-box">
                  <div className="total-top">
                    <h3>Rp {formatRp(bkSummary.totalCost)}</h3>
                    <span style={{fontSize:'12px'}}>{this.props.twoway ? `Summary Pergi` : `Grand Total`}</span>
                  </div>
                  <div className="book-form pd-box" style={{boxShadow:'none',border:'1px solid rgba(204, 204, 204, 0.2)'}}>
                    {/*this.props.adultCount > 0 &&
                    <p>Adult Basic Fare ({this.props.adultCount}x): <span className="pull-right">Rp {formatRp(totalAdultFare)}</span></p>
                    }
                    {this.props.childCount > 0 &&
                    <p>Child Basic Fare ({this.props.childCount}x): <span className="pull-right">Rp {formatRp(totalChildFare)}</span></p>
                    }
                    {this.props.infantCount > 0 &&
                    <p>Infant Basic Fare ({this.props.infantCount}x): <span className="pull-right">Rp {formatRp(totalInfantFare)}</span></p>
                    */}
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
                {this.props.twoway && !this.props.sameFlight && bookingSummary.bookingsSummary.length > 1 &&
                <div className="book-form price-detail-box">
                 <div className="total-top">
                  <h3>Rp {formatRp(bkSummary2.totalCost)}</h3>
                  <span style={{fontSize:'12px'}}>Summary Pulang</span>
                </div>
                  <div className="book-form pd-box">
                    {/*this.props.adultCount > 0 &&
                    <p>Adult Basic Fare ({this.props.adultCount}x): <span className="pull-right">Rp {formatRp(totalAdultFare2)}</span></p>
                    }
                    {this.props.childCount > 0 &&
                    <p>Child Basic Fare ({this.props.childCount}x): <span className="pull-right">Rp {formatRp(totalChildFare2)}</span></p>
                    }
                    {this.props.infantCount > 0 &&
                    <p>Infant Basic Fare ({this.props.infantCount}x): <span className="pull-right">Rp {formatRp(totalInfantFare2)}</span></p>
                    */}
                    <p>Transaction Id: <span className="pull-right">{bookingSummary.transactionId}</span></p>
                    <hr/>
                    {bkSummary2.passengers.map((contact) => (
                      <p>{contact.title} {contact.firstName} {contact.lastName}<span className="pull-right">{contact.paxType}</span></p>
                    ))}
                    <hr/>
                    <p>Basic Fare: <span className="pull-right">Rp {formatRp(bkSummary2.basicFare)}</span></p>
                    <p>Pax Service Charge (PSC):  <span className="pull-right">Rp {formatRp(bkSummary2.taxAndFee)}</span></p>
                  </div>
                  <div className="total-bot">
                    <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bkSummary2.totalCost)}</span></p>
                  </div>
                </div>
                }
                {this.props.twoway && this.props.sameFlight && 
                <div className="book-form price-detail-box">
                  <div className="book-form pd-box">
                    {/*this.props.adultCount > 0 &&
                    <p>Adult Basic Fare ({this.props.adultCount}x): <span className="pull-right">Rp {formatRp(totalAdultFare2)}</span></p>
                    }
                    {this.props.childCount > 0 &&
                    <p>Child Basic Fare ({this.props.childCount}x): <span className="pull-right">Rp {formatRp(totalChildFare2)}</span></p>
                    }
                    {this.props.infantCount > 0 &&
                    <p>Infant Basic Fare ({this.props.infantCount}x): <span className="pull-right">Rp {formatRp(totalInfantFare2)}</span></p>
                    */}
                    <p>Transaction Id: <span className="pull-right">{bookingSummary.transactionId}</span></p>
                    <hr/>
                    {bkSummary.passengers.map((contact) => (
                      <p>{contact.title} {contact.firstName} {contact.lastName}<span className="pull-right">{contact.paxType}</span></p>
                    ))}
                    <hr/>
                    <p>Basic Fare: <span className="pull-right">Rp {formatRp(bkSummary.basicFare)}</span></p>
                    <p>Pax Service Charge (PSC):  <span className="pull-right">Rp {formatRp(bkSummary.taxAndFee)}</span></p>
                  </div>
                  <div className="total-bot">
                    <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bkSummary.totalCost)}</span></p>
                  </div>
                </div>
                }
                {this.props.twoway && bookingSummary.bookingsSummary.length === 1 && !this.props.sameFlight &&
                <div className="book-form price-detail-box">
                  <div className="book-form pd-box">
                    {/*this.props.adultCount > 0 &&
                    <p>Adult Basic Fare ({this.props.adultCount}x): <span className="pull-right">Rp {formatRp(totalAdultFare2)}</span></p>
                    }
                    {this.props.childCount > 0 &&
                    <p>Child Basic Fare ({this.props.childCount}x): <span className="pull-right">Rp {formatRp(totalChildFare2)}</span></p>
                    }
                    {this.props.infantCount > 0 &&
                    <p>Infant Basic Fare ({this.props.infantCount}x): <span className="pull-right">Rp {formatRp(totalInfantFare2)}</span></p>
                    */}
                    <p>Transaction Id: <span className="pull-right">{bookingSummary.transactionId}</span></p>
                    <hr/>
                    {bkSummary.passengers.map((contact) => (
                      <p>{contact.title} {contact.firstName} {contact.lastName}<span className="pull-right">{contact.paxType}</span></p>
                    ))}
                    <hr/>
                    <p>Basic Fare: <span className="pull-right">Rp {formatRp(bkSummary.basicFare)}</span></p>
                    <p>Pax Service Charge (PSC):  <span className="pull-right">Rp {formatRp(bkSummary.taxAndFee)}</span></p>
                  </div>
                  <div className="total-bot">
                    <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bkSummary.totalCost)}</span></p>
                  </div>
                </div>
                }
                {!this.props.twoway &&
                  <div>
                <div className="book-form price-detail-box">
                  <div className="total-top">
                    <h3>Rp {formatRp(bookingSummary.total)}</h3>
                    <span style={{fontSize:'12px'}}>Grand Total</span>
                  </div>
                  </div>
                <div className="book-form price-detail-box">
                  <div className="book-form pd-box">
                    {/*this.props.adultCount > 0 &&
                    <p>Adult Basic Fare ({this.props.adultCount}x): <span className="pull-right">Rp {formatRp(totalAdultFare2)}</span></p>
                    }
                    {this.props.childCount > 0 &&
                    <p>Child Basic Fare ({this.props.childCount}x): <span className="pull-right">Rp {formatRp(totalChildFare2)}</span></p>
                    }
                    {this.props.infantCount > 0 &&
                    <p>Infant Basic Fare ({this.props.infantCount}x): <span className="pull-right">Rp {formatRp(totalInfantFare2)}</span></p>
                    */}
                    <p>Transaction Id: <span className="pull-right">{bookingSummary.transactionId}</span></p>
                    <hr/>
                    {bkSummary.passengers.map((contact) => (
                      <p>{contact.title} {contact.firstName} {contact.lastName}<span className="pull-right">{contact.paxType}</span></p>
                    ))}
                    <hr/>
                    <p>Basic Fare: <span className="pull-right">Rp {formatRp(bkSummary.basicFare)}</span></p>
                    <p>Pax Service Charge (PSC):  <span className="pull-right">Rp {formatRp(bkSummary.taxAndFee)}</span></p>
                  </div>
                  <div className="total-bot">
                    <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bkSummary.totalCost)}</span></p>
                  </div>
                </div>
                </div>
                }
                
                 <div className="clear"></div>
                   <div className="book-form" style={{marginTop:'40px'}}>
              <h3>Your Booking</h3><br/>
              {this.props.selectedFlight.flightSegments.map((flight, index) => (
                <div className="row" style={{marginBottom:'30px'}}>
                <div className="col-md-3">
                  <img src={`/img/${flight.airline.code}.png`} width="50" alt="" /><br/>
                      <span style={{marginTop:'10px',display:'block'}}>{flight.airline.name} {flight.flightDesignator.carrierCode} - {flight.flightDesignator.flightNumber}<br/>
                      {this.state.seat[flight.cabin]}</span>
                  </div>
                  <div className="col-md-9 fl-book-detail">
                    {index == 0 &&
                      <h2>Pergi</h2>
                    }
                    <div>
                      <span>{moment(flight.std).format("hh:mm")}</span>&nbsp;
                      <span>{flight.departureAirport.city} ({flight.departureAirport.code})</span><br/>
                      <span>{moment(flight.std).format("DD MMM YYYY")}</span>&nbsp;
                      <span>{flight.departureAirport.name}</span><br/>
                    </div>
                    <br/>
                    <div>
                      <span>{moment(flight.sta).format("hh:mm")}</span>&nbsp;
                      <span>{flight.arrivalAirport.city} ({flight.arrivalAirport.code})</span><br/>
                      <span>{moment(flight.sta).format("DD MMM YYYY")}</span>&nbsp;
                      <span>{flight.arrivalAirport.name}</span><br/>
                    </div>
                    </div>
                </div>
                ))}
                {this.props.twoway &&
                <div>
                {this.props.selectedFlight2.flightSegments.map((flight, index) => (
                <div className="row" style={{marginBottom:'30px'}}>
                <div className="col-md-3">
                  <img src={`/img/${flight.airline.code}.png`} width="50" alt="" /><br/>
                      <span style={{marginTop:'10px',display:'block'}}>{flight.airline.name} {flight.flightDesignator.carrierCode} - {flight.flightDesignator.flightNumber}<br/>
                      {this.state.seat[flight.cabin]}</span>
                  </div>
                  <div className="col-md-9 fl-book-detail">
                    {index == 0 &&
                    <h2>Pulang</h2>
                    }
                    <div>
                      <span>{moment(flight.std).format("hh:mm")}</span>&nbsp;
                      <span>{flight.departureAirport.city} ({flight.departureAirport.code})</span><br/>
                      <span>{moment(flight.std).format("DD MMM YYYY")}</span>&nbsp;
                      <span>{flight.departureAirport.name}</span><br/>
                    </div>
                    <br/>
                    <div>
                      <span>{moment(flight.sta).format("hh:mm")}</span>&nbsp;
                      <span>{flight.arrivalAirport.city} ({flight.arrivalAirport.code})</span><br/>
                      <span>{moment(flight.sta).format("DD MMM YYYY")}</span>&nbsp;
                      <span>{flight.arrivalAirport.name}</span><br/>
                    </div>
                    </div>
                    
                </div>
                ))}
                </div>
                }

              </div>
                 {/*<button type="button" onClick={this.handlePayment} className="btn btn-choose pull-right" style={{marginTop:'20px'}}>Process To Payment</button>*/}
              </div>
            </div>
          </div>
        </div>
        <Modal open={this.state.open} onClose={this.onCloseModal} little showCloseIcon={false}>
          <img src="/img/iconmodal.png" width="85" />
          <p>{this.state.errorMsg}</p>
          <button className="btn btn-choose" style={{float:'none',display:'block',margin:'auto'}}
          onClick={this.onCloseModal}>Ok</button>
        </Modal>
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  flightSchedule: state.searchFlight.airlanesSchedule,
  selectedFlight: state.searchFlight.selectedFlight,
  selectedFlight2: state.searchFlight.selectedFlight2,
  adultCount: state.searchFlight.adultCount,
  childCount: state.searchFlight.childCount,
  infantCount: state.searchFlight.infantCount,
  twoway: state.searchFlight.twoway,
  sameFlight: state.searchFlight.sameFlight,
  bookingSummary: state.searchFlight.bookingSummary,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setSelectedFlight,
  snapTokenRequest,
  setSelectedFlight2,
  saveOfflinePayment
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlightPayment)
