import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { setSelectedFlight, setSelectedFlight2 } from '../../modules/searchFlight';
import moment from 'moment';
import formatRp from '../../custom/formatRp';
import { Link } from 'react-router-dom';
import ToggleButton from 'react-toggle-button';
import { history } from '../../store';
import { veritransServerKey, veritransClientKey, veritransUrl } from '../../config';
import Veritrans from 'Veritrans';
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
    time: 20000,
    cardNumber: '',
    cardExpMonth: '',
    cardExpYear: '',
    cardCvv: '',
    secure: '',
    grossAmount: '',
    cardName: '',
  }

  componentDidMount(){
    const { getHotelBooking } = this.props;
    window.scrollTo(0, 0);
    const self = this;
    countdownTimer = setInterval(() => {
      self.timer();
    }, 1000)
    Veritrans.client_key = veritransClientKey;

    // API Url for Sandbox 
    Veritrans.url = veritransUrl;

  }

  callback = e => {
    console.log(e)
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

  handlePaymentCC = e => {
    const payload = {
      card_number: this.state.cardNumber,
      card_exp_month: this.state.cardExpMonth,
      card_exp_year: this.state.cardExpYear,
      card_cvv: this.state.cardCvv,
      secure: true,
      gross_amount: 0
    }
    console.log(payload)
    // {
    //   card_number: "4111 1111 1111 1111",
    //   card_cvv: "123",
    //   card_exp_month: "12",
    //   card_exp_year: "2018",
    //   secure: true,
    //   gross_amount: 20000,
    // }
    Veritrans.token(this.card, this.callback);
  }

  handleChangeInput = (name, e) => {
    this.setState({
      [name]: e.target.value
    })
  }

  handlePayment = e => {
    history.push('/hotel/thankyou')
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
    //console.log('selectedFlight', this.props.selectedFlight)
    const item = this.props.selectedFlight
    const item2 = this.props.selectedFlight2
    const totalAdultFare = this.props.adultCount * item.flightSegments[0].fares[0].basicFare;
    const totalChildFare = this.props.childCount * item.flightSegments[0].fares[0].childFare;
    const totalInfantFare = this.props.infantCount * item.flightSegments[0].fares[0].infantFare;
    const tax = item.flightSegments[0].fares[0].airportTax;
    const totalAdultFare2 = this.props.adultCount * item2.flightSegments[0].fares[0].basicFare;
    const totalChildFare2 = this.props.childCount * item2.flightSegments[0].fares[0].childFare;
    const totalInfantFare2 = this.props.infantCount * item2.flightSegments[0].fares[0].infantFare;
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
              <h1>Payment</h1>
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
              <li className="active"><a href="#tab_a" data-toggle="pill">Transfer</a></li>
              <li><a href="#tab_b" data-toggle="pill">CC</a></li>
              <li><a href="#tab_c" data-toggle="pill">ATM</a></li>
              <li><a href="#tab_d" data-toggle="pill">VA</a></li>
            </ul>
            <div className="tab-content col-md-10">
              <p>Complete payment in {this.state.countdown}</p>
              <div className="tab-pane active" id="tab_a">
                  <h4>Transfer</h4>
                  <div className="alert alert-info" role="alert">
                    You can transfer from any banking channel (m-banking, SMS banking or ATM).
                  </div>
                  <p>Select a Destination Account</p>
                  <div className="radio">
                    <label className="pull-left"><input type="radio" name="optradio"/>    
                    <span className="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>BCA</label>
                    <img src="/img/bca.png"  className="pull-right" />
                    <div className="clear"></div>
                  </div>
                  <div className="radio">
                    <label className="pull-left"><input type="radio" name="optradio"/>
                    <span className="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>Mandiri</label>
                    <img src="/img/mandiri.png" className="pull-right" />
                    <div className="clear"></div>
                  </div>
                  <div className="radio">
                    <label className="pull-left"><input type="radio" name="optradio"/>
                    <span className="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>BRI</label>
                    <img src="/img/bri.png" className="pull-right" />
                    <div className="clear"></div>
                  </div>
                  <div className="radio">
                    <label className="pull-left"><input type="radio" name="optradio"/>
                    <span className="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>BNI</label>
                    <img src="/img/bni.png" className="pull-right" />
                    <div className="clear"></div>
                  </div>
                  <button type="button" onClick={this.handlePayment} className="btn btn-choose pull-right" style={{marginTop:'20px'}}>Process To Payment</button>
              </div>
              <div className="tab-pane" id="tab_b">
                   <h4>Credit Card 
                   <span className="pull-right" style={{marginTop:'-20px'}}>
                   <img src="/img/secure.png" width="100"/>&nbsp;
                   <img src="/img/visa.png" width="50"/>&nbsp;
                   <img src="/img/mastercard.png" width="50"/></span></h4>
                   <div className="clear"></div>

                  <div className="row">
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
                  <button type="button" onClick={this.handlePaymentCC} className="btn btn-choose pull-right" style={{marginTop:'20px'}}>Process To Payment</button>
              </div>
              <div className="tab-pane" id="tab_c">
                  <h4>ATM 
                   <span className="pull-right" style={{marginTop:'-10px'}}>
                   <img src="/img/atm1.png" width="30"/>&nbsp;
                   <img src="/img/prima.png" width="30"/>&nbsp;
                   <img src="/img/alto.png" width="30"/></span></h4>
                   <div className="clear"></div>
                  <span>Read Before You Pay</span>
                  <ul style={{border:'1px solid #CCC',padding:'20px 20px 20px 40px',marginTop:'10px'}}>
                    <li>Payment is via ATM machine only</li>
                    <li>A transaction fee of Rp6.500 - Rp7.500 will be charged by the bank</li>
                  </ul>
                  <button type="button" onClick={this.handlePayment} className="btn btn-choose pull-right" style={{marginTop:'20px'}}>Process To Payment</button>
              </div>
              <div className="tab-pane" id="tab_d">
                   <h4>VA</h4>
                   <button type="button" onClick={this.handlePayment} className="btn btn-choose pull-right" style={{marginTop:'20px'}}>Process To Payment</button>
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
                    <div className="book-form price-detail-box" style={{marginBottom:'20px'}}>
                    <div className="total-top">
                      <h3>Rp {formatRp(totalAdultFare + totalChildFare + totalInfantFare + tax + totalAdultFare2 + totalChildFare2 + totalInfantFare2 + tax2)}</h3>
                      <span style={{fontSize:'12px'}}>Grand Total</span>
                    </div>
                    </div>
                }
                <div className="book-form price-detail-box" style={{marginBottom:'20px'}}>
                  <div className="total-top">
                    <h3>Rp {formatRp(totalAdultFare + totalChildFare + totalInfantFare + tax)}</h3>
                    <span style={{fontSize:'12px'}}>{this.props.twoway ? `Summary Pergi` : `Grand Total`}</span>
                  </div>
                  <div className="book-form pd-box" style={{boxShadow:'none',border:'1px solid rgba(204, 204, 204, 0.2)'}}>
                    {this.props.adultCount > 0 &&
                    <p>Adult Basic Fare ({this.props.adultCount}x): <span className="pull-right">Rp {formatRp(totalAdultFare)}</span></p>
                    }
                    {this.props.childCount > 0 &&
                    <p>Child Basic Fare ({this.props.childCount}x): <span className="pull-right">Rp {formatRp(totalChildFare)}</span></p>
                    }
                    {this.props.infantCount > 0 &&
                    <p>Infant Basic Fare ({this.props.infantCount}x): <span className="pull-right">Rp {formatRp(totalInfantFare)}</span></p>
                    }
                    <p>Airport Tax:  <span className="pull-right">Rp {formatRp(tax)}</span></p>
                  </div>
                  <div className="total-bot">
                    <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(totalAdultFare + totalChildFare + totalInfantFare + tax)}</span></p>
                  </div>
                </div>
                {this.props.twoway &&
                <div className="book-form price-detail-box">
                 <div className="total-top">
                  <h3>Rp {formatRp(totalAdultFare2 + totalChildFare2 + totalInfantFare2 + tax2)}</h3>
                  <span style={{fontSize:'12px'}}>Summary Pulang</span>
                </div>
                  <div className="book-form pd-box">
                    {this.props.adultCount > 0 &&
                    <p>Adult Basic Fare ({this.props.adultCount}x): <span className="pull-right">Rp {formatRp(totalAdultFare2)}</span></p>
                    }
                    {this.props.childCount > 0 &&
                    <p>Child Basic Fare ({this.props.childCount}x): <span className="pull-right">Rp {formatRp(totalChildFare2)}</span></p>
                    }
                    {this.props.infantCount > 0 &&
                    <p>Infant Basic Fare ({this.props.infantCount}x): <span className="pull-right">Rp {formatRp(totalInfantFare2)}</span></p>
                    }
                    <p>Airport Tax:  <span className="pull-right">Rp {formatRp(tax)}</span></p>
                  </div>
                  <div className="total-bot">
                    <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(totalAdultFare2 + totalChildFare2 + totalInfantFare2 + tax2)}</span></p>
                  </div>
                </div>
                }
                <br/>
                 <div className="book-form">
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
              </div>
            </div>
          </div>
        </div>
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
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setSelectedFlight,
  setSelectedFlight2
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlightPayment)
