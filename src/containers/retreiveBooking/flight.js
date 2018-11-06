import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { setSelectedFlight, setSelectedFlight2, retreiveBookingFlight } from '../../modules/searchFlight';
import { snapTokenRequest, saveOfflinePayment, addDiscount, removeDiscount } from '../../modules/auth';
import moment from 'moment';
import formatRp from '../../custom/formatRp';
import { Link } from 'react-router-dom';
import ToggleButton from 'react-toggle-button';
import { history } from '../../store';
import Modal from 'react-responsive-modal';
import snap from 'snap';
import { sessionId } from '../../config';
import ModalPopup from '../../components/modal';
const momenttz = require('moment-timezone');
let countdownTimer;

class RetreiveBookingFlight extends React.Component {

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
    basicFare: '',
    promoAdded: false,
  }

  componentDidMount(){
    const self = this;
    window.scrollTo(0, 0);
    this.onOpenModal2();
    this.props.retreiveBookingFlight({
      transactionId: this.props.match.params.id,
      phoneNumber: this.props.match.params.phone,
      sessionId: sessionId,
    }).then((result) => {
      const d1 = moment(result.bookingDate);
      const d2 = moment(result.paymentTimeLimit)
      const mm = d2.diff(d1, 'seconds');
      this.setState({
        time: mm
      })
      countdownTimer = setInterval(() => {
        self.timer();
      }, 1000)
      this.onCloseModal2();
    }).catch(() => {
      this.onOpenModal();
      this.setState({
        errorMsg: 'transaction ID wrong'
      })
    })
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

  handlePaymentCC = (name, e) => {
    const { bookingSummary } = this.props;
    let amount = bookingSummary.bookingsSummary[0].totalCost;
    //pp same flight
    if (bookingSummary.bookingsSummary[0].flightJourneys.length > 1) {
      amount = bookingSummary.bookingsSummary[0].totalCost;
    } 
    //pp diff flight
    if (typeof bookingSummary.bookingsSummary[1] !== 'undefined') {
      amount = bookingSummary.bookingsSummary[0].totalCost + bookingSummary.bookingsSummary[1].totalCost;
    }

    console.log({
      PaymentChannel : name,
      PaymentCode: bookingSummary.transactionId,
      Amount: (this.state.promoAdded) ? bookingSummary.balanceDue : amount,
      CreditCardFee: null,
      TimeLimit: bookingSummary.paymentTimeLimit,
      PaymentType:"PAYMENT",
    })
    this.props.snapTokenRequest({
      PaymentChannel : name,
      PaymentCode: bookingSummary.transactionId,
      Amount: (this.state.promoAdded) ? bookingSummary.balanceDue : amount,
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
            console.log('err', result);
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
    const { bookingSummary } = this.props;

    console.log({
      offlinechannel : channel,
      transId: bookingSummary.transactionId,
    })

    this.props.saveOfflinePayment({
      offlinechannel : channel,
      transId: bookingSummary.transactionId,
    }).then((response) => {
        console.log(response)
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

  handleRemoveVoucher = e => {
    const { bookingSummary } = this.props;
    const self = this;
    this.onOpenModal2();
    this.props.removeDiscount({
     sessionId: sessionId,
     transactionId: bookingSummary.transactionId,
     discountCode: this.state.usedPromoCode
    }).then((result) => {
      this.setState({
        voucher: false,
      })
      this.onOpenModal2();
      this.props.retreiveBookingFlight({
        transactionId: this.props.match.params.id,
        phoneNumber: this.props.match.params.phone,
        sessionId: sessionId,
      }).then((result) => {
        this.setState({
          promoAdded: false
        })
        this.onCloseModal2();
      }).catch(() => {
        this.onOpenModal();
        this.setState({
          errorMsg: 'transaction ID wrong'
        })
      })
    }).catch((err) => {
      this.onCloseModal2();
      alert(err.message)
    })
  }

  handleAddVoucher = e => {
    const { bookingSummary } = this.props;
    const self = this;
    this.onOpenModal2();
    this.props.addDiscount({
     sessionId: sessionId,
     transactionId: bookingSummary.transactionId,
     discountCode: this.state.promoCode
    }).then((result) => {
      this.setState({
        usedPromoCode: this.state.promoCode,
      })
      this.onOpenModal2();
      this.props.retreiveBookingFlight({
        transactionId: this.props.match.params.id,
        phoneNumber: this.props.match.params.phone,
        sessionId: sessionId,
      }).then((result) => {
        this.setState({
          promoAdded: true
        })
        this.onCloseModal2();
      }).catch(() => {
        this.onOpenModal();
        this.setState({
          errorMsg: 'transaction ID wrong'
        })
      })
    }).catch((err) => {
      this.onCloseModal2();
      alert(err.message)
    })
  }

  render() {
    const { bookingSummary, twoway } = this.props;
    // console.log('bookingSummary', bookingSummary)
    const bkSummary = bookingSummary.bookingsSummary[0];
    // console.log(bkSummary.flightJourneys[0].flightSegments)
    const bkSummary2 = (bookingSummary.bookingsSummary.length > 1) ? bookingSummary.bookingsSummary[1] : bookingSummary.bookingsSummary[0];
    
    const timeLimit = moment().tz("Asia/Jakarta").format('HH');

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
                {bookingSummary.paymentStatus !== "Paid" &&
                <div className="book-form">
                  <div className="row" style={{margin:0}}>
                    <ul className="nav nav-pills nav-stacked col-md-2">
                      <li><a href="#tab_b" data-toggle="pill">CC</a></li>
                      <li  className="active"><a href="#tab_a" data-toggle="pill">Bank Transfer</a></li>
                      {/*<li><a href="#tab_c" data-toggle="pill">Virtual Account</a></li>*/}
                    </ul>
                    <div className="tab-content col-md-10">
                      <p>Complete payment in {this.state.countdown}</p>
                      <div className="tab-pane active" id="tab_a">
                          <h4>Bank Transfer</h4>
                          <div className="alert alert-info" role="alert">
                            You can transfer from any banking channel (m-banking, SMS banking or ATM).
                          </div>
                          <p>Select a Destination Account</p>
                          <div className="radio">
                            <label className="pull-left">
                            <input type="radio" name="optradio" value={"004105"}  
                            checked={this.state.bankTransfer === "004105"} 
                            onChange={this.onBankTransferChanged}/>    
                            <span className="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>BCA</label>
                            <img src="/img/bca.png"  className="pull-right" />
                            <div className="clear"></div>
                          </div>
                           {this.state.bankTransfer === "004105" &&
                            <div className="radio">
                              <p>Transfer (melalui ATM/Internet Banking/SMS Banking) dengan tujuan</p>
                              <ul className="info-bank">
                                <li><span>Bank</span> : BCA</li>
                                <li><span>No Rekening</span> : 627 024 4431</li>
                                <li> <span>Pemilik</span> : PT Kaha Holiday Internasional</li>
                                <li><span>Kode Unik Transfer</span> : Rp {formatRp(bookingSummary.uniqueChargeAmount)}</li>
                                {bookingSummary.bookingsSummary.length == 1 && bkSummary.flightJourneys.length == 1 &&
                                <li style={{fontWeight:'600',color:'red'}}><span>Total Transfer</span> : Rp {(this.state.promoAdded) ? formatRp(bookingSummary.balanceDue + bookingSummary.uniqueChargeAmount) : formatRp(bkSummary.totalCost + bookingSummary.uniqueChargeAmount)}</li>
                                }
                                {bookingSummary.bookingsSummary.length == 1 && bkSummary.flightJourneys.length > 1 &&
                                <li style={{fontWeight:'600',color:'red'}}><span>Total Transfer</span> : Rp {(this.state.promoAdded) ? formatRp(bookingSummary.balanceDue + bookingSummary.uniqueChargeAmount) : formatRp(bkSummary.totalCost + bookingSummary.uniqueChargeAmount)}</li>
                                }
                                {typeof bookingSummary.bookingsSummary[1] !== 'undefined' &&
                                <li style={{fontWeight:'600',color:'red'}}><span>Total Transfer</span> : Rp {(this.state.promoAdded) ? formatRp(bookingSummary.balanceDue + bookingSummary.uniqueChargeAmount) : formatRp(bkSummary2.totalCost + bkSummary.totalCost + bookingSummary.uniqueChargeAmount)}</li>
                                }
                              </ul>
                              <div className="alert alert-warning">
                                <p>Informasi Penting<br/>
                                mengikuti regulasi bank terkait, proses bank transfer hanya dapat di lakukan antara pukul 06:00 - 21:00</p>
                              </div>
                              {timeLimit < 21 && timeLimit >= 6 &&
                              <p>Klik "Process To Payment" dan lanjutkan dengan melakukan pembayaran melalui transfer bank dengan nominal disamping.</p>
                              }
                              <div className="clear"></div>
                            </div>
                          }
                          <div className="radio">
                            <label className="pull-left">
                            <input type="radio" name="optradio" value={"004104"}  
                            checked={this.state.bankTransfer === "004104"} 
                            onChange={this.onBankTransferChanged}/>
                            <span className="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>Mandiri</label>
                            <img src="/img/mandiri.png" className="pull-right" />
                            <div className="clear"></div>
                          </div>
                           {this.state.bankTransfer === "004104" &&
                            <div className="radio">
                              <p>Transfer (melalui ATM/Internet Banking/SMS Banking) dengan tujuan</p>
                              <ul className="info-bank">
                                <li><span>Bank</span> : Mandiri</li>
                                <li><span>No Rekening</span> : 0700 00 0889952 3</li>
                                <li> <span>Pemilik</span> : KAHA HOLIDAY INTERNATIONAL</li>
                                <li><span>Kode Unik Transfer</span> : Rp {formatRp(bookingSummary.uniqueChargeAmount)}</li>
                                {bookingSummary.bookingsSummary.length == 1 && bkSummary.flightJourneys.length == 1 &&
                                <li style={{fontWeight:'600',color:'red'}}><span>Total Transfer</span> : Rp {(this.state.promoAdded) ? formatRp(bookingSummary.balanceDue + bookingSummary.uniqueChargeAmount) : formatRp(bkSummary.totalCost + bookingSummary.uniqueChargeAmount)}</li>
                                }
                                {bookingSummary.bookingsSummary.length == 1 && bkSummary.flightJourneys.length > 1 &&
                                <li style={{fontWeight:'600',color:'red'}}><span>Total Transfer</span> : Rp {(this.state.promoAdded) ? formatRp(bookingSummary.balanceDue + bookingSummary.uniqueChargeAmount) : formatRp(bkSummary.totalCost + bookingSummary.uniqueChargeAmount)}</li>
                                }
                                {typeof bookingSummary.bookingsSummary[1] !== 'undefined' &&
                                <li style={{fontWeight:'600',color:'red'}}><span>Total Transfer</span> : Rp {(this.state.promoAdded) ? formatRp(bookingSummary.balanceDue + bookingSummary.uniqueChargeAmount) : formatRp(bkSummary2.totalCost + bkSummary.totalCost + bookingSummary.uniqueChargeAmount)}</li>
                                }
                              </ul>
                              <div className="alert alert-warning">
                                <p>Informasi Penting<br/>
                                mengikuti regulasi bank terkait, proses bank transfer hanya dapat di lakukan antara pukul 06:00 - 21:00</p>
                              </div>
                              {timeLimit < 21 && timeLimit >= 6 &&
                              <p>Klik "Process To Payment" dan lanjutkan dengan melakukan pembayaran melalui transfer bank dengan nominal disamping.</p>
                              }
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
                          {timeLimit < 21 && timeLimit >= 6 &&
                          <button type="button" onClick={this.handlePayment.bind(this, this.state.bankTransfer)} className="btn btn-choose pull-right" style={{marginTop:'20px'}}>Process To Payment</button>
                          }
                      </div>
                      <div className="tab-pane " id="tab_b">
                           <h4>Credit Card 
                           <span className="pull-right" style={{marginTop:'-20px'}}>
                           <img src="/img/secure.png" width="100"/>&nbsp;
                           <img src="/img/visa.png" width="50"/>&nbsp;
                           <img src="/img/mastercard.png" width="50"/></span></h4>
                           <div className="clear"></div>
                           <img src="/img/comingsoon.png" style={{width:'100%'}}/>
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
                          </div>

                          <button type="button" onClick={this.handlePaymentCC.bind(this, "credit_card")} className="btn btn-choose pull-right" style={{marginTop:'20px'}}>Process To Payment</button>*/}
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
                          <div class="form-inline">
                            <br/>
                            <div class="form-group">
                              <input type="text" className="form-control" placeholder="Example:CHEAP" style={{marginRight:'20px'}}
                              onChange={this.handleChangeInput.bind(this, 'promoCode')} value={this.state.promoCode}/>
                            </div>
                            <button className="btn btn-primary" onClick={this.handleAddVoucher}>Use Voucher</button>
                          </div>
                        }
                        {this.state.promoAdded &&
                          <p style={{fontSize:'16px',color:'#ffb000',fontWeight:'600',marginTop:'20px'}}>Promo Code : {this.state.usedPromoCode} 
                          <span onClick={this.handleRemoveVoucher} style={{color:'red',fontSize:'12px',marginLeft:'20px',cursor:'pointer'}}>Remove</span></p>
                        }
                      </div>
                    <br/><br/> 
  
                  </div>
                
              </div>
              }
              {bookingSummary.paymentStatus === "Paid" &&
                <p>Payment Status: Paid</p>
              }
              </div>
            

              <div className="col-md-4">
                {/* One way */}
                {bookingSummary.bookingsSummary.length == 1 && bkSummary.flightJourneys.length == 1 &&
                <div className="book-form price-detail-box">
                  <div className="total-top">
                    {!this.state.promoAdded &&
                    <h3>Rp {formatRp(bkSummary.totalCost)}</h3>
                    }
                    {this.state.promoAdded &&
                      <h3>Rp {formatRp(bookingSummary.balanceDue)}</h3>
                    }
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
                    {this.state.promoAdded &&
                      <p>Discount: <span className="pull-right">- Rp {formatRp(bookingSummary.discountAmount)}</span></p>
                    }
                  </div>
                  <div className="total-bot">
                    {!this.state.promoAdded &&
                      <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bkSummary.totalCost)}</span></p>
                    }
                    {this.state.promoAdded &&
                      <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bookingSummary.balanceDue)}</span></p>
                    }
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
                    {this.state.promoAdded &&
                      <p>Discount: <span className="pull-right">- Rp {formatRp(bookingSummary.discountAmount)}</span></p>
                    }
                  </div>
                  <div className="total-bot">
                    {!this.state.promoAdded &&
                    <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bkSummary.totalCost)}</span></p>
                    }
                    {this.state.promoAdded &&
                      <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bookingSummary.balanceDue)}</span></p>
                    }
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
                    <p>Tax and Fee:  <span className="pull-right">Rp {formatRp(bkSummary2.taxAndFee + bkSummary.taxAndFee)}</span></p>
                    {this.state.promoAdded &&
                      <p>Discount: <span className="pull-right">- Rp {formatRp(bookingSummary.discountAmount)}</span></p>
                    }
                  </div>
                  <div className="total-bot">
                    {!this.state.promoAdded &&
                    <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bkSummary2.totalCost + bkSummary.totalCost)}</span></p>
                    }
                    {this.state.promoAdded &&
                      <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(bookingSummary.balanceDue)}</span></p>
                    }
                  </div>
                </div>
                }


                 <div className="clear"></div>
                   <div className="book-form" style={{marginTop:'40px'}}>
                    <h3>Your Booking</h3><br/>
                    {bkSummary.flightJourneys[0].flightSegments.map((flight, index) => (
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

                {/* Two way same flight */}
                {bookingSummary.bookingsSummary.length == 1 && bkSummary.flightJourneys.length > 1 &&
                <div>
                {bkSummary.flightJourneys[1].flightSegments.map((flight, index) => (
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

                {typeof bookingSummary.bookingsSummary[1] !== 'undefined' &&
                <div>
                {bkSummary2.flightJourneys[0].flightSegments.map((flight, index) => (
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
        <ModalPopup open={this.state.open2} 
              onCloseModal={() => {console.log('')}} 
              onOpenModal={this.onOpenModal2}/>
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  bookingSummary: state.searchFlight.bookingSummary,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setSelectedFlight,
  snapTokenRequest,
  setSelectedFlight2,
  retreiveBookingFlight,
  saveOfflinePayment,
  addDiscount,
  removeDiscount
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RetreiveBookingFlight)
