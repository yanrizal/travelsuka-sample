import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startSearchFlight, startSearchFlightTwoWay, sortFlight, setSelectedFlight, setSelectedFlight2 } from '../../modules/searchFlight';
import moment from 'moment';
import queryString from 'query-string';
import { sessionId } from '../../config';
import { history } from '../../store';
import _ from 'lodash';
import Modal from 'react-modal';
import FlightFilterMenu from '../flightFilterMenu';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '680px'
  }
};

class FlightTwowayMenu extends React.Component {

  state = {
    day: '',
    date: '',
    adultCount: 0,
    seat: {
      E: 'Economy',
      B: 'Business',
      F: 'First Class'
    },
    return: 'false',
    uid1: '',
    uid2: '',
    airlineSortUp: false,
    departSortUp: false,
    arriveSortUp: false,
    durationSortUp: false,
    priceSortUp: false,
    modalIsOpen: false,
    originFlightSchedule: {},
    showFlightSchedule: {},
    sortBy: 'price',
    sortType: 'asc'
  }

  componentWillMount() {
    this.setState({
      originFlightSchedule: this.props.flightSchedule,
      showFlightSchedule: this.props.flightSchedule
    })
  }

  componentWillReceiveProps(props) {
    this.setState({
      originFlightSchedule: props.flightSchedule,
      showFlightSchedule: props.flightSchedule
    })
  }

  handleFilter = e => {
    
  }

  handleSort = (name, type) => {
    this.props.onTwowaySort({
      sortBy: name,
      sortType: type,
      num: 0
    })
    switch (name) {
      case 'depart':
        this.setState({
          airlineSortUp: false,
          priceSortUp: false,
          departSortUp: !this.state.departSortUp,
          arriveSortUp: false,
          durationSortUp: false
        })
        break;
      case 'arrive':
        this.setState({
          airlineSortUp: false,
          priceSortUp: false,
          departSortUp: false,
          arriveSortUp: !this.state.arriveSortUp,
          durationSortUp: false
        })
        break;
      case 'duration':
        this.setState({
          airlineSortUp: false,
          priceSortUp: false,
          departSortUp: false,
          arriveSortUp: false,
          durationSortUp: !this.state.durationSortUp
        })
        break;
      case 'airline':
        this.setState({
          airlineSortUp: !this.state.airlineSortUp,
          priceSortUp: false,
          departSortUp: false,
          arriveSortUp: false,
          durationSortUp: false
        })
        break;
      case 'price':
        this.setState({
          priceSortUp: !this.state.priceSortUp,
          airlineSortUp: false,
          departSortUp: false,
          arriveSortUp: false,
          durationSortUp: false
        })
        break;
      default:
        this.setState({
          priceSortUp: false,
          airlineSortUp: false,
          departSortUp: false,
          arriveSortUp: false,
          durationSortUp: false
        })
        break;
    }
  }


  handleBookFlight = e => {
    history.push(`/flight/prebooking/${this.state.uid1}/${this.state.uid2}`)
  }

  render() {
    const { departureAirportName, arrivalAirportName, loadingFlight } = this.props;
    return (
      <div>
        <div className="row twoway-menu hidden-xs hidden-sm" style={{padding:'5px 20px'}}>
          
          <div className="clear"></div>
          <div className="col-md-2">
            <span>Airline</span>&nbsp;
            {this.state.airlineSortUp &&
              <span className="glyphicon glyphicon-menu-up" onClick={() => this.handleSort('airline', 'asc')}></span>
            }
            {!this.state.airlineSortUp &&
              <span className="glyphicon glyphicon-menu-down" onClick={() => this.handleSort('airline', 'desc')}></span>
            }
          </div>
           <div className="col-md-3">
            <span>Departure</span>&nbsp;
            {this.state.departSortUp &&
              <span className="glyphicon glyphicon-menu-up" onClick={() => this.handleSort('depart', 'asc')}></span>
            }
            {!this.state.departSortUp &&
              <span className="glyphicon glyphicon-menu-down" onClick={() => this.handleSort('depart', 'desc')}></span>
            }
          </div>
          <div className="col-md-2">
            <span>Arrival</span>&nbsp;
            {this.state.arriveSortUp &&
              <span className="glyphicon glyphicon-menu-up" onClick={() => this.handleSort('arrive', 'asc')}></span>
            }
            {!this.state.arriveSortUp &&
              <span className="glyphicon glyphicon-menu-down" onClick={() => this.handleSort('arrive', 'desc')}></span>
            }
          </div>
          <div className="col-md-3">
            <span>Duration</span>&nbsp;
            {this.state.durationSortUp &&
              <span className="glyphicon glyphicon-menu-up" onClick={() => this.handleSort('duration', 'asc')}></span>
            }
            {!this.state.durationSortUp &&
              <span className="glyphicon glyphicon-menu-down" onClick={() => this.handleSort('duration', 'desc')}></span>
            }
          </div>
          <div className="col-md-2">
            <span>Price</span>&nbsp;
            {this.state.priceSortUp &&
              <span className="glyphicon glyphicon-menu-up" onClick={() => this.handleSort('price', 'asc')}></span>
            }
            {!this.state.priceSortUp &&
              <span className="glyphicon glyphicon-menu-down" onClick={() => this.handleSort('price', 'desc')}></span>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  flightSchedule: state.searchFlight.airlanesSchedule,
  airlinesCode: state.searchFlight.airlinesCode,
  departureAirportName: state.searchFlight.departureAirportName,
  arrivalAirportName: state.searchFlight.arrivalAirportName,
  loadingFlight: state.searchFlight.loadingFlight,
  twoway: state.searchFlight.twoway,
  selectedFlight: state.searchFlight.selectedFlight,
  selectedFlight2: state.searchFlight.selectedFlight2,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  startSearchFlight,
  startSearchFlightTwoWay,
  sortFlight,
  setSelectedFlight,
  setSelectedFlight2
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlightTwowayMenu)
