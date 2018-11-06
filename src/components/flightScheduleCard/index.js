import React from 'react'
import moment from 'moment';
import formatRp from '../../custom/formatRp';
import formatDuration from '../../custom/formatDuration';
import { Link } from 'react-router-dom';
import { Translate } from "react-localize-redux";

class FlightScheduleCard extends React.Component {

  state = {
    seat: {
      E: 'Economy',
      B: 'Business',
      F: 'First Class'
    },
    seatTrain: {
      K: 'Economy',
      B: 'Business',
      E: 'Eksekutif'
    }
  }

  handleChooseBtn = (id, idx, e) => {
    this.props.onChoose({
      uid: id,
      idx: idx
    })
  }

  render() {
    const item = this.props.item;
    const index = this.props.index;
    const way = this.props.way;
    //let totalAdultFare = this.props.adultCount * (item.flightSegments[0].fares[0].basicFare + item.flightSegments[0].fares[0].basicVat + item.flightSegments[0].fares[0].iwjr + item.flightSegments[0].fares[0].fuelSurcharge + item.flightSegments[0].fares[0].airportTax + item.flightSegments[0].fares[0].otherFee);
    //let totalChildFare = this.props.childCount * (item.flightSegments[0].fares[0].childFare + item.flightSegments[0].fares[0].basicVat + item.flightSegments[0].fares[0].iwjr + item.flightSegments[0].fares[0].fuelSurcharge + item.flightSegments[0].fares[0].airportTax + item.flightSegments[0].fares[0].otherFee);
    //let totalInfantFare = this.props.infantCount * (item.flightSegments[0].fares[0].infantFare + item.flightSegments[0].fares[0].infantVat + item.flightSegments[0].fares[0].iwjr);
    let totalAdultFare = 0
    let totalChildFare = 0
    let totalInfantFare = 0

    if (!this.props.train) {
      item.flightSegments.map((x, index) => {
        totalAdultFare = totalAdultFare + this.props.adultCount * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
        totalChildFare = totalChildFare + this.props.childCount * (x.fares[0].childFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
        totalInfantFare = totalInfantFare + this.props.infantCount * (x.fares[0].infantFare + x.fares[0].infantVat + x.fares[0].iwjr);
      })
    } else {
      item.flightSegments.map((x, index) => {
        totalAdultFare = 1 * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
        //totalChildFare = totalChildFare + this.props.childCount * (x.fares[0].childFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
        totalInfantFare = 1 * (x.fares[0].infantFare + x.fares[0].infantVat + x.fares[0].iwjr);
      })
    }
    

    const tax = item.flightSegments[0].fares[0].airportTax;
    const vat = item.flightSegments[0].fares[0].basicVat;
    const infantVat = item.flightSegments[0].fares[0].infantVat;
    const iwjr = item.flightSegments[0].fares[0].iwjr;
    const d1 = moment(item.flightSegments[0].std);
    const d2 = moment(item.flightSegments[item.flightSegments.length - 1].sta)
    const mm = d2.diff(d1, 'minutes');

    return (
        <div className="ticket">
          <div className="row">
            <div className="col-md-2 col-xs-12 col-sm-3">
            {item.flightSegments.length === 1 &&
              <div className="ic-div">
              <img src={`/img/${item.flightSegments[0].airline.code}.png`} className="airline-ic" alt="" />
              <strong className="airline-name">&nbsp;{(this.props.train) ? `${item.flightSegments[0].aircraftCode} (${item.flightSegments[0].flightDesignator.flightNumber})` : item.flightSegments[0].airline.name}</strong>
              </div>
            }
            {item.flightSegments.length > 1 && item.flightSegments[0].airline.code === item.flightSegments[1].airline.code &&
              <div className="ic-div">
              <img src={`/img/${item.flightSegments[0].airline.code}.png`} className="airline-ic" alt="" />
              <span className="airline-name">&nbsp;{item.flightSegments[0].airline.name}</span>
              </div>
            }
            {item.flightSegments.length > 1 && item.flightSegments[0].airline.code !== item.flightSegments[1].airline.code &&
              <div className="ic-div">
              {item.flightSegments.map((flight, index) => (
                <img src={`/img/${flight.airline.code}.png`} width="40" alt="" style={{marginRight:'10px',display:'inline-block'}} key={index} />
              ))}
              <span className="airline-name">&nbsp;Multi Airlines</span>
              </div>
            }
            
              
            </div>
            <div className="col-md-2 col-xs-6 col-sm-3">
              <span className="airline-span">{moment(item.flightSegments[0].std).format("HH:mm")}</span>
              <p>{item.departureAirport.city} ({item.departureAirport.code})</p>

              <br/>
              <a role="button" aria-expanded="false" className="hidden-xs hidden-sm" 
              aria-controls={`#fd-${index}`}
              href={`#fd-${index}`} data-toggle="collapse">{(this.props.train) ? '':'Flight Detail'}</a>
            </div>
            <div className="col-md-2 col-xs-6 col-sm-3">
              <span className="airline-span">{moment(item.flightSegments[item.flightSegments.length - 1].sta).format("HH:mm")}</span>
              <p>{item.arrivalAirport.city} ({item.arrivalAirport.code})</p>
            </div>
            <div className="clear visible-xs"></div>
            <div className="col-md-2 col-xs-6 col-sm-3">
              {/*<span className="airline-span">{formatDuration(parseInt(mm, 0)*60)}</span>*/}
              <span className="airline-span">{item.duration.hours}h {item.duration.minutes}m</span>
              {item.flightSegments.length === 1 &&
                <p>direct</p>
              }
              {item.flightSegments.length > 1 &&
                <p>{item.flightSegments.length - 1} Transit</p>
              }
              <br/>
              <a role="button" aria-expanded="false" 
                aria-controls={`#pd-${index}`}
                className="hidden-xs hidden-sm"
                href={`#pd-${index}`} data-toggle="collapse">{(this.props.train) ? '':'Price Detail'}</a>
            </div>
            <div className="clear visible-sm"></div>
            <div className="col-sm-3 visible-sm"></div>
            <div className="col-md-2 col-xs-6 col-sm-3">
              {item.flightSegments[0].includedBaggage > 0 &&
               <p style={{marginTop:'10px'}}>Baggage: {item.flightSegments[0].includedBaggage} Kg</p> 
              }
              {/*item.flightSegments[0].includedMeal > 0 &&
               <p style={{marginTop:'10px'}}>Meal: {item.flightSegments[0].includedMeal}</p> 
              */}
              {this.props.train &&
                <p style={{marginTop:'10px'}}>{this.state.seatTrain[item.flightSegments[0].fares[0].cabin]}<br/>Sub Class {item.flightSegments[0].fares[0].classOfService}</p>
              }
              <a role="button" aria-expanded="false" className="hidden-xs visible-sm" 
              aria-controls={`#fd-${index}`}
              href={`#fd-${index}`} data-toggle="collapse">{(this.props.train) ? '':'Flight Detail'}</a>
            </div>
            <div className="col-sm-3 visible-sm">
              <span className="airline-span">Rp {formatRp(totalAdultFare + totalChildFare + totalInfantFare)}</span>
              
              <a role="button" aria-expanded="false" 
                aria-controls={`#pd-${index}`}
                className="hidden-xs visible-sm"
                href={`#pd-${index}`} data-toggle="collapse">{(this.props.train) ? '':'Price Detail'}</a>
            </div>
            <div className="col-md-2 col-xs-12 col-sm-3">
              <span className="airline-span hidden-sm total-fl">Rp {formatRp(totalAdultFare + totalChildFare + totalInfantFare)}</span>
              {!this.props.train &&<br className="hidden-sm"/>}
              {!this.props.train &&
              <div>
              {!this.props.twoway &&
              <button onClick={this.handleChooseBtn.bind(this, item.uid, this.props.idx)} className="btn btn-choose change-btn-fl" style={{padding:'10px 45px',float:'left',marginBottom:'20px'}}><Translate id="home.book"/></button>
              }
              {this.props.twoway &&
              <button onClick={this.handleChooseBtn.bind(this, item.uid, this.props.idx)} style={{padding:'10px',fontSize:'11px'}} className="btn btn-choose"><Translate id="home.book"/></button>
              }
              </div>
              }
              {this.props.train && item.flightSegments[0].fares[0].availableCount !== 0 &&
              <div>
              {!this.props.twoway &&
              <button onClick={this.handleChooseBtn.bind(this, item.uid, this.props.idx)} className="btn btn-choose change-btn-fl" style={{padding:'10px 45px',float:'left',marginBottom:'20px'}}><Translate id="home.book"/></button>
              }
              {this.props.twoway &&
              <button onClick={this.handleChooseBtn.bind(this, item.uid, this.props.idx)} style={{padding:'10px',fontSize:'11px'}} className="btn btn-choose"><Translate id="home.book"/></button>
              }
              </div>
              }

              {this.props.train && item.flightSegments[0].fares[0].availableCount === 0 &&
              <div>
              {!this.props.twoway &&
              <button  className="btn btn-choose change-btn-fl" style={{padding:'10px 45px',float:'left',marginBottom:'20px',background:'#eaeaea'}}><Translate id="home.book"/></button>
              }
              {this.props.twoway &&
              <button  style={{padding:'10px',fontSize:'11px',background:'#eaeaea'}} className="btn btn-choose"><Translate id="home.book"/></button>
              }
              </div>
              }
              {this.props.train &&
                <p style={{color:'red',clear:'both'}}>Sisa {item.flightSegments[0].fares[0].availableCount} kursi</p>
              }
            </div>
          </div>
        <div className="clear"></div>

            <div className="collapse" id={`fd-${index}`}>
            <hr/>
            {item.flightSegments.map((flight, index) => (
              <div className="row" style={{marginBottom:'20px'}} key={index}>
                <div className="col-md-3">
                  <img src={`/img/${flight.airline.code}.png`} width="25" alt=""/><br/>
                  {flight.airline.name} {flight.flightDesignator.carrierCode} - {flight.flightDesignator.flightNumber}<br/>
                  {!this.props.train &&
                  <span style={{color:'#BBB'}}>{this.state.seat[flight.cabin]}</span>
                  }
                </div>
                <div className="col-md-5">
                  <div>
                  <span><span className="circle-dot"></span>{moment(flight.std).format("HH:mm")}</span>&nbsp;
                  <span>{flight.departureAirport.city} ({flight.departureAirport.code})</span><br/>
                  <span style={{marginLeft:'20px',display:'inlineBlock'}}>{moment(flight.std).format("DD MMM YYYY")}</span>&nbsp;
                  <span>{flight.departureAirport.name}</span><br/>
                  </div>
                  <div style={{margin:'20px 0 20px 20px'}}>
                    {!this.props.train &&
                    <img src="/img/icon-airplane.png" width="15"/>
                    }
                    <span style={{fontSize:'14px'}}>&nbsp;{flight.duration.hours}h {flight.duration.minutes}m</span>
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
                      <span>Transit Duration {item.flightSegments[item.flightSegments.length - 1].transitDuration.hours}h {item.flightSegments[item.flightSegments.length - 1].transitDuration.minutes}m</span>
                    </div>
                  }
                </div>
                <div className="col-md-4">
                  <ul>
                    
                    <li>Included Baggage: {flight.includedBaggage} Kg</li>
                    {/*<li>Included Meal: {flight.includedMeal}</li>*/}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="collapse" id={`pd-${index}`}>
            <hr/>
            <div className="row">
            <div className="col-md-3">
              <img src={`/img/${item.flightSegments[0].airline.code}.png`} width="25" alt=""/><br/>
              {item.flightSegments[0].airline.name} {item.flightSegments[0].flightDesignator.carrierCode} - {item.flightSegments[0].flightDesignator.flightNumber}<br/>
              <span style={{color:'#BBB'}}>{this.state.seat[item.flightSegments[0].cabin]}</span>
            </div>
            <div className="col-md-3">
              <div style={{fontWeight:'600'}}>
                <span>{item.departureAirport.city} ({item.departureAirport.code})</span> - 
                <span>{item.arrivalAirport.city} ({item.arrivalAirport.code})</span>
              </div>
            </div>
            <div className="col-md-6">
              <ul className="price-fl">
                
                {this.props.adultCount > 0 &&
                <li style={{fontWeight:'600'}}>Adult Base Price ({this.props.adultCount}x): <span className="pull-right">Rp {formatRp(totalAdultFare - (parseInt(this.props.adultCount) * (tax + vat)))}</span></li>
                }
                {this.props.childCount > 0 &&
                <li style={{fontWeight:'600'}}>Child Base Price ({this.props.childCount}x): <span className="pull-right">Rp {formatRp(totalChildFare - (parseInt(this.props.childCount) * (tax + vat)))}</span></li>
                }
                {this.props.infantCount > 0 &&
                <li>Infant Base Price ({this.props.infantCount}x): <span className="pull-right">Rp {formatRp(totalInfantFare)}</span></li>
                }
                <li>VAT: <span className="pull-right">Rp {formatRp((parseInt(this.props.adultCount) + parseInt(this.props.childCount)) * vat)}</span></li>
                <li>Pax Service Charge (PSC): <span className="pull-right">Rp {formatRp((parseInt(this.props.adultCount) + parseInt(this.props.childCount)) * tax)}</span></li>
                <li style={{borderTop:'1px solid #CCC',paddingTop:'10px',fontWeight:'600'}}>Total: <span className="pull-right">Rp {formatRp(totalAdultFare + totalChildFare + totalInfantFare)}</span></li>
              </ul>
            </div>
            </div>
          </div>
        </div>
    );
  }
}

export default FlightScheduleCard
