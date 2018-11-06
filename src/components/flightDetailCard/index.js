import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { setSelectedFlight, setSelectedFlight2 } from '../../modules/searchFlight';
import moment from 'moment';
import formatRp from '../../custom/formatRp';
import { Link } from 'react-router-dom';

class FlightDetailCard extends React.Component {

  state = {
    seat: {
      E: 'Economy',
      B: 'Business',
      F: 'First Class'
    }
  }

  render() {
    const { flight, modal, title, idx } = this.props
    return (
      <div className="row" style={{marginBottom:'20px'}}>
        {modal &&
        <div>
          <div className="col-md-2">
            {idx === 0 &&
              <span>{title}</span>
            }<br/>
            <span style={{fontSize:'12px'}}>{moment(flight.std).format("DD MMM YYYY")}</span>&nbsp;
          </div>
          <div className="col-md-3">
            <img src={`/img/${flight.airline.code}.png`} width="15" 
              style={{margin:'8px 10px 0 0',width:'35px',float:'left'}}/>
            <div className="pull-left">
            <span>{flight.airline.name}</span><br/>
            <span style={{color:'#BBB',fontSize:'13px',display:'block'}}>{this.state.seat[flight.cabin]}</span>
            </div>
          </div>  
          <div className="col-md-2">
            <div>
              <span>{moment(flight.std).format("HH:mm")}</span><br/>
              <span style={{fontSize:'12px'}}>{flight.departureAirport.city} ({flight.departureAirport.code})</span><br/>
            </div>
          </div>
          <div className="col-md-2">
            <div>
              <span>{moment(flight.sta).format("HH:mm")}</span><br/>
              <span style={{fontSize:'12px'}}>{flight.arrivalAirport.city} ({flight.arrivalAirport.code})</span><br/>
            </div>
          </div>
          <div className="col-md-3">
            <div>
              <span>Duration</span><br/>
              <span style={{fontSize:'12px'}}>{flight.duration.hours}h {flight.duration.minutes}m</span><br/>
            </div>
          </div>
          <div className="clear"/>
          {/*idx === 0 && title === "Pulang" &&
          <div className="total-bot" style={{background:'#f6f6f6',marginTop:'20px'}}>
          <button onClick={this.handleBookFlight} className="btn btn-choose pull-right" style={{ padding: '10px 45px', float: 'left', margin:'0'}}>Book</button>
          <div className="clear"/>
          </div>
         */}
        </div>
        }
        {!modal &&
        <div className="col-md-8">
          <img src={`/img/${flight.airline.code}.png`} width="35" alt=""/><br/>
          {flight.airline.name} {flight.flightDesignator.carrierCode} - {flight.flightDesignator.flightNumber}<br/>
          <span style={{color:'#BBB',fontSize:'13px',display:'block'}}>{this.state.seat[flight.cabin]}</span><br/>
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

        </div>
        }
        {!modal &&
        <div className="col-md-4">
          <ul>
            <li style={{fontSize:'12px'}}>Baggage: {flight.includedBaggage} kg</li>
          </ul>
        </div>
        }
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
)(FlightDetailCard)
