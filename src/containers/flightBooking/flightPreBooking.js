import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { setSelectedFlight, setSelectedFlight2 } from '../../modules/searchFlight';
import moment from 'moment';
import formatRp from '../../custom/formatRp';
import { Link } from 'react-router-dom';

class FlightPreBooking extends React.Component {

  state = {
    seat: {
      E: 'Economy',
      B: 'Business',
      F: 'First Class'
    }
  }

  componentDidMount() {
    const self = this;
    window.scrollTo(0, 0);
    const { flightSchedule, twoway } = this.props;
    if (twoway) {
      const fs = flightSchedule[0].flightJourneys.filter((item) => {
        return item.uid === self.props.match.params.id
      });
      const fs2 = flightSchedule[1].flightJourneys.filter((item) => {
        return item.uid === self.props.match.params.id2
      });
      this.props.setSelectedFlight(fs[0]);
      this.props.setSelectedFlight2(fs2[0]);
    } else {
      const fs = flightSchedule[0].flightJourneys.filter((item) => {
        return item.uid === self.props.match.params.id
      });
      this.props.setSelectedFlight(fs[0]);
    }
    
  }

  render() {
    console.log('selectedFlight', this.props.selectedFlight)
    const item = this.props.selectedFlight
    const item2 = this.props.selectedFlight2
    //let totalAdultFare = this.props.adultCount * (item.flightSegments[0].fares[0].basicFare + item.flightSegments[0].fares[0].basicVat + item.flightSegments[0].fares[0].iwjr + item.flightSegments[0].fares[0].fuelSurcharge + item.flightSegments[0].fares[0].airportTax + item.flightSegments[0].fares[0].otherFee);
    //let totalChildFare = this.props.childCount * (item.flightSegments[0].fares[0].childFare + item.flightSegments[0].fares[0].basicVat + item.flightSegments[0].fares[0].iwjr + item.flightSegments[0].fares[0].fuelSurcharge + item.flightSegments[0].fares[0].airportTax + item.flightSegments[0].fares[0].otherFee);
    //let totalInfantFare = this.props.infantCount * (item.flightSegments[0].fares[0].infantFare + item.flightSegments[0].fares[0].infantVat + item.flightSegments[0].fares[0].iwjr);
    const tax = item.flightSegments[0].fares[0].airportTax;
    const iwjr = item.flightSegments[0].fares[0].iwjr;
    const vat = item.flightSegments[0].fares[0].basicVat;
    //let totalAdultFare2 = this.props.adultCount * (item2.flightSegments[0].fares[0].basicFare + item2.flightSegments[0].fares[0].basicVat + item2.flightSegments[0].fares[0].iwjr + item2.flightSegments[0].fares[0].fuelSurcharge + item2.flightSegments[0].fares[0].airportTax + item2.flightSegments[0].fares[0].otherFee);
    //let totalChildFare2 = this.props.childCount * (item2.flightSegments[0].fares[0].childFare + item2.flightSegments[0].fares[0].basicVat + item2.flightSegments[0].fares[0].iwjr + item2.flightSegments[0].fares[0].fuelSurcharge + item2.flightSegments[0].fares[0].airportTax + item2.flightSegments[0].fares[0].otherFee);
    //let totalInfantFare2 = this.props.infantCount * (item2.flightSegments[0].fares[0].infantFare + item2.flightSegments[0].fares[0].infantVat + item2.flightSegments[0].fares[0].iwjr);
    const tax2 = item2.flightSegments[0].fares[0].airportTax;
    const iwjr2 = item2.flightSegments[0].fares[0].iwjr;
    const vat2 = item2.flightSegments[0].fares[0].basicVat;

    let totalAdultFare = 0
    let totalChildFare = 0
    let totalInfantFare = 0
    item.flightSegments.map((x, index) => {
      totalAdultFare = totalAdultFare + this.props.adultCount * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
      totalChildFare = totalChildFare + this.props.childCount * (x.fares[0].childFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
      totalInfantFare = totalInfantFare + this.props.infantCount * (x.fares[0].infantFare + x.fares[0].infantVat + x.fares[0].iwjr);
    })

    let totalAdultFare2 = 0
    let totalChildFare2 = 0
    let totalInfantFare2 = 0
    item2.flightSegments.map((x, index) => {
      totalAdultFare2 = totalAdultFare2 + this.props.adultCount * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
      totalChildFare2 = totalChildFare2 + this.props.childCount * (x.fares[0].childFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
      totalInfantFare2 = totalInfantFare2 + this.props.infantCount * (x.fares[0].infantFare + x.fares[0].infantVat + x.fares[0].iwjr);
    })
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
              <h1>Flight Detail</h1>
            </div>
            </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
              {/*<div className="col-md-12">
                {this.props.selectedFlight.departureAirport.city} -> {this.props.selectedFlight.arrivalAirport.city}
              </div>*/}
              <h3 className="your-i" style={{marginBottom:'20px'}}>Flight Detail</h3>
              <div className="clear"></div>
              {this.props.selectedFlight.flightSegments.map((flight, index) => (
              <div className="p20 prebook">
              {index == 0 &&
                <h2 style={{fontWeight:600,fontSize:'18px',margin:'0px 0 30px 0'}}>Pergi</h2>
              }
              <div className="row" style={{marginBottom:'20px'}} key={index}>
                <div className="col-md-2 prebook-logo">
                  <img src={`/img/${flight.airline.code}.png`} width="100" alt="" /><br/>
                  <span style={{marginTop:'10px',display:'block'}}>{flight.airline.name} {flight.flightDesignator.carrierCode} - {flight.flightDesignator.flightNumber}<br/>
                  {this.state.seat[flight.cabin]}</span>
                </div>
                <div className="col-md-6">
                 <div>
                  <span><span className="circle-dot"></span>{moment(flight.std).format("HH:mm")}</span>&nbsp;
                  <span>{flight.departureAirport.city} ({flight.departureAirport.code})</span><br/>
                  <span style={{marginLeft:'20px',display:'inlineBlock'}}>{moment(flight.std).format("DD MMM YYYY")}</span>&nbsp;
                  <span>{flight.departureAirport.name}</span><br/>
                  </div>
                  <div style={{margin:'20px 0 20px 20px'}}>
                    <img src="/img/icon-airplane.png" width="15"/><span style={{fontSize:'14px'}}>&nbsp;{flight.duration.hours}h {flight.duration.minutes}m</span>
                  </div>
                  <div>
                  <span><span className="circle-dot2"></span>{moment(flight.sta).format("HH:mm")}</span>&nbsp;
                  <span>{flight.arrivalAirport.city} ({flight.arrivalAirport.code})</span><br/>
                  <span style={{marginLeft:'20px',display:'inlineBlock'}}>{moment(flight.sta).format("DD MMM YYYY")}</span>&nbsp;
                  <span>{flight.arrivalAirport.name}</span><br/>
                  </div>
                  {index === 0 && item.flightSegments.length > 1 &&
                    <div style={{
                        background: '#eaeaea',
                        padding: '5px 12px',
                        marginTop: '19px'
                    }}>
                      <span>Transit Duration {flight.transitDuration.hours}h {flight.transitDuration.minutes}m</span>
                    </div>
                  }
                </div>
                <div className="col-md-4">
                  <ul>
                    <li>Included Baggage: {flight.includedBaggage}</li>
                  </ul>
                </div>
              </div>
              </div>
            ))}
              {this.props.twoway &&
                <div>
                  {this.props.selectedFlight2.flightSegments.map((flight, index) => (
                    <div className="p20 prebook">
                    {index == 0 &&
                        <h2 style={{fontWeight:600,fontSize:'18px',margin:'0px 0 30px 0'}}>Pulang</h2>
                      }
                    <div className="row" key={index}>
                      <div className="col-md-2 prebook-logo">
                        <img src={`/img/${flight.airline.code}.png`} width="100" alt="" /><br/>
                        <span style={{marginTop:'10px',display:'block'}}>{flight.airline.name} {flight.flightDesignator.carrierCode} - {flight.flightDesignator.flightNumber}<br/>
                        {this.state.seat[flight.cabin]}</span>
                      </div>
                      <div className="col-md-6">
                        <div>
                          <span><span className="circle-dot"></span>{moment(flight.std).format("HH:mm")}</span>&nbsp;
                          <span>{flight.departureAirport.city} ({flight.departureAirport.code})</span><br/>
                          <span style={{marginLeft:'20px',display:'inlineBlock'}}>{moment(flight.std).format("DD MMM YYYY")}</span>&nbsp;
                          <span>{flight.departureAirport.name}</span><br/>
                          </div>
                          <div style={{margin:'20px 0 20px 20px'}}>
                            <img src="/img/icon-airplane.png" width="15"/><span style={{fontSize:'14px'}}>&nbsp;{flight.duration.hours}h {flight.duration.minutes}m</span>
                          </div>
                          <div>
                          <span><span className="circle-dot2"></span>{moment(flight.sta).format("HH:mm")}</span>&nbsp;
                          <span>{flight.arrivalAirport.city} ({flight.arrivalAirport.code})</span><br/>
                          <span style={{marginLeft:'20px',display:'inlineBlock'}}>{moment(flight.sta).format("DD MMM YYYY")}</span>&nbsp;
                          <span>{flight.arrivalAirport.name}</span><br/>
                          </div>
                          {index === 0 && item.flightSegments.length > 1 &&
                            <div style={{
                                background: '#eaeaea',
                                padding: '5px 12px',
                                marginTop: '19px'
                            }}>
                              <span>Transit Duration {flight.transitDuration.hours}h {flight.transitDuration.minutes}m</span>
                            </div>
                          }
                      </div>
                      <div className="col-md-4">
                        <ul>
                          <li>Included Baggage: {flight.includedBaggage}</li>
                        </ul>
                      </div>
                    </div>
                    </div>
                  ))}
                </div>
              }
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
              <h3 className="your-i">Summary</h3>
              <div className="clear"></div>
              <div className="p20">
              <p>Summary Pergi</p>
              <ul>
                {this.props.adultCount > 0 &&
                <li>Adult Basic Fare ({this.props.adultCount}x): Rp {formatRp(totalAdultFare - (parseInt(this.props.adultCount) * (tax + vat)))}</li>
                }
                {this.props.childCount > 0 &&
                <li>Child Basic Fare ({this.props.childCount}x): Rp {formatRp(totalChildFare - (parseInt(this.props.childCount) * (tax + vat)))}</li>
                }
                {this.props.infantCount > 0 &&
                <li>Infant Basic Fare ({this.props.infantCount}x): Rp {formatRp(totalInfantFare)}</li>
                }
                <li>VAT: Rp {formatRp((parseInt(this.props.adultCount) + parseInt(this.props.childCount)) * vat)}</li>
                <li>Pax Service Charge (PSC): {formatRp((parseInt(this.props.adultCount) + parseInt(this.props.childCount)) * tax)}</li>
                <li style={{fontWeight:'600'}}>Total: Rp {formatRp(totalAdultFare + totalChildFare + totalInfantFare)}</li>
              </ul>
              </div>
              {this.props.twoway &&
                <div className="p20">
                <p>Summary Pulang</p>
                <ul>
                  {this.props.adultCount > 0 &&
                  <li>Adult Basic Fare ({this.props.adultCount}x): Rp {formatRp(totalAdultFare2 - (parseInt(this.props.adultCount) * (tax2 + vat2)))}</li>
                  }
                  {this.props.childCount > 0 &&
                  <li>Child Basic Fare ({this.props.childCount}x): Rp {formatRp(totalChildFare2 - (parseInt(this.props.childCount) * (tax2 + vat2)))}</li>
                  }
                  {this.props.infantCount > 0 &&
                  <li>Infant Basic Fare ({this.props.infantCount}x): Rp {formatRp(totalInfantFare2)}</li>
                  }
                  <li>VAT: Rp {formatRp((parseInt(this.props.adultCount) + parseInt(this.props.childCount)) * vat2)}</li>
                  <li>Tax Service Charge (TSC): {formatRp((parseInt(this.props.adultCount) + parseInt(this.props.childCount)) * tax2)}</li>
                  <li style={{fontWeight:'600'}}>Total: Rp {formatRp(totalAdultFare2 + totalChildFare2 + totalInfantFare2)}</li>
                </ul>
                </div>
              }
              <br/>
              {this.props.twoway &&
                <p style={{fontWeight:'bold'}}>Grand Total {formatRp(totalAdultFare + totalChildFare + totalInfantFare + totalAdultFare2 + totalChildFare2 + totalInfantFare2)}</p>
              }
              <Link to={`/flight/booking/${this.props.match.params.id}`} className="btn btn-choose pull-left change-btn-fl" style={{color:'#FFF'}}>Booking</Link>
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
)(FlightPreBooking)
