import React from 'react'
import moment from 'moment';
import formatRp from '../../custom/formatRp';
import formatDuration from '../../custom/formatDuration';
import { Link } from 'react-router-dom';

class FlightScheduleCardTwo extends React.Component {

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

  handleChooseBtn = (id, idx, price, e) => {
    console.log(id)
    this.props.onChoose({
      uid: id,
      idx: idx,
      price: price
    })
  }

  render() {
    const { item, index, way, idx} = this.props;
    // const item = this.props.item;
    // const index = this.props.index;
    // const way = this.props.way;
    let totalAdultFare = 0
    let totalChildFare = 0
    let totalInfantFare = 0
    item.flightSegments.map((x, index) => {
      totalAdultFare = totalAdultFare + this.props.adultCount * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
      totalChildFare = totalChildFare + this.props.childCount * (x.fares[0].childFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
      totalInfantFare = totalInfantFare + this.props.infantCount * (x.fares[0].infantFare + x.fares[0].infantVat + x.fares[0].iwjr);
    })
    const tax = item.flightSegments[0].fares[0].airportTax;
    const vat = item.flightSegments[0].fares[0].basicVat;
    const iwjr = item.flightSegments[0].fares[0].iwjr;
    const d1 = moment(item.flightSegments[0].std);
    const d2 = moment(item.flightSegments[item.flightSegments.length - 1].sta)
    const mm = d2.diff(d1, 'minutes');

    return (
        <div className="ticket two-way">
          <div className="row">
            <div className="col-md-2 col-xs-4 col-sm-4 two-fs">
            {item.flightSegments.length === 1 &&
              <div style={(this.props.train)?{padding:'20px 0px',fontSize:'10px'}: {padding:'20px 10px'}}>
              <img src={`/img/${item.flightSegments[0].airline.code}.png`} className="airline-ic" alt="" width="120" />
              <span className="airline-name" style={(this.props.train)?{fontSize:'10px'}:''}>&nbsp;{(this.props.train) ? `${item.flightSegments[0].aircraftCode} (${item.flightSegments[0].flightDesignator.flightNumber})` :item.flightSegments[0].airline.name}</span>
              </div>
            }
            {item.flightSegments.length > 1 && item.flightSegments[0].airline.code === item.flightSegments[1].airline.code &&
              <div style={{padding:'20px 10px'}}>
              <img src={`/img/${item.flightSegments[0].airline.code}.png`} className="airline-ic" alt="" />
              <span className="airline-name">&nbsp;{(this.props.train) ? `${item.flightSegments[0].aircraftCode} (${item.flightSegments[0].flightDesignator.flightNumber})` : item.flightSegments[0].airline.name}</span>
              </div>
            }
            {item.flightSegments.length > 1 && item.flightSegments[0].airline.code !== item.flightSegments[1].airline.code &&
              <div style={{padding:'20px 10px'}}>
              {item.flightSegments.map((flight, index) => (
                <img src={`/img/${flight.airline.code}.png`} width="40" alt="" style={{marginRight:'10px',display:'inline-block'}} key={index} />
              ))}
              <span className="airline-name">&nbsp;Multi Airlines</span>
              </div>
            }
            
              
            </div>
            <div className="col-md-3 col-xs-4 col-sm-4">
              <span className="airline-span">{moment(item.flightSegments[0].std).format("HH:mm")}</span>
              <p>{item.departureAirport.city} ({item.departureAirport.code})</p>

              <a role="button" aria-expanded="false" className="hidden-xs hidden-sm"
              aria-controls={`#fd-${idx}-${index}`}
              href={`#fd-${idx}-${index}`} data-toggle="collapse">{(this.props.train)?'':'Flight Detail'}</a>
            </div>
            <div className="col-md-2 col-xs-4 col-sm-4" style={{padding:0}}>
              <span className="airline-span">{moment(item.flightSegments[item.flightSegments.length - 1].sta).format("HH:mm")}</span>
              <p>{item.arrivalAirport.city} ({item.arrivalAirport.code})</p>
            </div>
            <div className="clear visible-sm"></div>
            <div className="col-sm-4 visible-sm"></div>
            <div className="col-md-2 col-xs-4 col-sm-4 hidden-xs two-dir" style={{padding:0}}>
              <span className="airline-span">{item.duration.hours}h {item.duration.minutes}m</span>
              {item.flightSegments.length === 1 &&
                <p>direct</p>
              }
              {item.flightSegments.length > 1 &&
                <p>{item.flightSegments.length - 1} Transit</p>
              }
              <br/>
              <a role="button" aria-expanded="false" className="hidden-xs hidden-sm"
                aria-controls={`#pd-${idx}-${index}`}
                href={`#pd-${idx}-${index}`} data-toggle="collapse">{(this.props.train)?'':'Price Detail'}</a>
            </div>
            <div className="col-xs-4 visible-xs"></div>
            <div className="col-md-3 col-xs-4 two-book">
              <span className="airline-span" style={{textAlign:'right'}}>Rp {formatRp(totalAdultFare + totalChildFare + totalInfantFare)}</span>
              {!this.props.train &&
              <div>
              {!this.props.twoway &&
              <button onClick={this.handleChooseBtn.bind(this, item.uid, this.props.idx, totalAdultFare + totalChildFare + totalInfantFare)} className="btn btn-choose" style={{padding:'10px 45px',float:'left',marginBottom:'20px'}}>Book</button>
              }
              {this.props.twoway &&
              <button onClick={this.handleChooseBtn.bind(this, item.uid, this.props.idx, totalAdultFare + totalChildFare + totalInfantFare)} style={{padding:'10px 25px',fontSize:'11px',margin:'0px'}} className="btn btn-choose">Book</button>
              }
              </div>
              }

              {this.props.train && item.flightSegments[0].fares[0].availableCount !== 0 &&
              <div>
              {!this.props.twoway &&
              <button onClick={this.handleChooseBtn.bind(this, item.uid, this.props.idx, totalAdultFare + totalChildFare + totalInfantFare)} className="btn btn-choose" style={{padding:'10px 45px',float:'left',marginBottom:'20px'}}>Book</button>
              }
              {this.props.twoway &&
              <button onClick={this.handleChooseBtn.bind(this, item.uid, this.props.idx, totalAdultFare + totalChildFare + totalInfantFare)} style={{padding:'10px 25px',fontSize:'11px',margin:'0px'}} className="btn btn-choose">Book</button>
              }
              </div>
              }

              {this.props.train && item.flightSegments[0].fares[0].availableCount === 0 &&
              <div>
              {!this.props.twoway &&
              <button className="btn btn-choose" style={{padding:'10px 45px',float:'left',marginBottom:'20px',background:'#eaeaea'}}>Book</button>
              }
              {this.props.twoway &&
              <button style={{padding:'10px 25px',fontSize:'11px',margin:'0px',background:'#eaeaea'}} className="btn btn-choose">Book</button>
              }
              </div>
              }

              {this.props.train &&
                <p style={{color:'red',float:'right',fontSize:'12px',marginTop:'5px'}}>Sisa {item.flightSegments[0].fares[0].availableCount} kursi</p>
              }
            </div>
          </div>
        <div className="clear"></div>

            <div className="collapse" id={`fd-${idx}-${index}`}>
            <hr/>
            {item.flightSegments.map((flight, index) => (
              <div className="row" style={{marginBottom:'20px'}} key={index}>
                <div className="col-md-8">
                  <img src={`/img/${flight.airline.code}.png`} width="35" alt=""/><br/>
                  {flight.airline.name} {flight.flightDesignator.carrierCode} - {flight.flightDesignator.flightNumber}<br/>
                  <span style={{color:'#BBB',fontSize:'13px',display:'block'}}>{(this.props.train) ? this.state.seatTrain[flight.cabin] : this.state.seat[flight.cabin]}</span><br/>
                  {!this.props.train &&
                  <div>
                  <span><span className="circle-dot"></span>{moment(flight.std).format("HH:mm")}</span>&nbsp;
                  <span>{flight.departureAirport.city} ({flight.departureAirport.code})</span><br/>
                  <span style={{marginLeft:'20px',display:'inlineBlock'}}>{moment(flight.std).format("DD MMM YYYY")}</span>&nbsp;
                  <span>{flight.departureAirport.name}</span><br/>
                  </div>
                  }
                  {!this.props.train &&
                  <div style={{margin:'20px 0 20px 20px'}}>
                    <img src="/img/icon-airplane.png" width="15"/><span style={{fontSize:'14px'}}>&nbsp;{flight.duration.hours}h {flight.duration.minutes}m</span>
                  </div>
                  }
                  {!this.props.train &&
                  <div>
                  <span><span className="circle-dot2"></span>{moment(flight.sta).format("HH:mm")}</span>&nbsp;
                  <span>{flight.arrivalAirport.city} ({flight.arrivalAirport.code})</span><br/>
                  <span style={{marginLeft:'20px',display:'inlineBlock'}}>{moment(flight.sta).format("DD MMM YYYY")}</span>&nbsp;
                  <span>{flight.arrivalAirport.name}</span><br/>
                  </div>
                  }
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
                    <li style={{fontSize:'12px'}}>Baggage: {flight.includedBaggage} Kg<br/>
                    {this.props.train &&
                      <span>Sub Class {item.flightSegments[0].fares[0].classOfService}</span>
                    }
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="collapse" id={`pd-${idx}-${index}`}>
            <hr/>
            <div className="row">
            <div className="col-md-12">
              <img src={`/img/${item.flightSegments[0].airline.code}.png`} width="35" alt=""/><br/>
              {item.flightSegments[0].airline.name} {item.flightSegments[0].flightDesignator.carrierCode} - {item.flightSegments[0].flightDesignator.flightNumber}<br/>
              <span style={{color:'#BBB',fontSize:'13px',display:'block'}}>{this.state.seat[item.flightSegments[0].cabin]}</span><br/>
              <ul className="price-fl">
                {this.props.adultCount > 0 &&
                <li style={{fontWeight:'600'}}>Adult Fare ({this.props.adultCount}x): <span className="pull-right">Rp {formatRp(totalAdultFare - (parseInt(this.props.adultCount) * (tax + vat)))}</span></li>
                }
                {this.props.childCount > 0 &&
                <li style={{fontWeight:'600'}}>Child Fare ({this.props.childCount}x): <span className="pull-right">Rp {formatRp(totalChildFare - (parseInt(this.props.childCount) * (tax + vat)))}</span></li>
                }
                {this.props.infantCount > 0 &&
                <li style={{fontWeight:'600'}}>Infant Fare ({this.props.infantCount}x): <span className="pull-right">Rp {formatRp(totalInfantFare)}</span></li>
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

export default FlightScheduleCardTwo
