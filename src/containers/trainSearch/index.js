import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startSearchFlight, startSearchFlightTwoWay, sortFlight, setSelectedFlight, setSelectedFlight2 } from '../../modules/searchFlight';
import TrainResultWidget from '../../components/widget/trainResultWidget';
import moment from 'moment';
import queryString from 'query-string';
import FlightScheduleCard from '../../components/flightScheduleCard';
import FlightScheduleCardTwo from '../../components/flightScheduleCard/flightScheduleCardTwo';
import { sessionId } from '../../config';
import { history } from '../../store';
import _ from 'lodash';
import Modal from 'react-modal';
import TrainDetailCard from '../../components/flightDetailCard/trainDetailCard';
import FlightFilterMenu from '../../components/flightFilterMenu';
import FlightTwowayMenu from '../../components/flightTwowayMenu';

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

class TrainSearch extends React.Component {

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
    filterBy: '',
    filterType: '',
    sortType: 'asc',
    loading: true,
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }


  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  componentWillMount() {
    this.setState({
      originFlightSchedule: this.props.flightSchedule,
      showFlightSchedule: this.props.flightSchedule
    })
    console.log("props")
    console.log(this.props.flightSchedule)
  }

  componentWillReceiveProps(props) {
    console.log(props.flightSchedule);
    this.setState({
      originFlightSchedule: props.flightSchedule,
      showFlightSchedule: props.flightSchedule
    })
  }

  componentDidMount() {
    const parsed = queryString.parse(window.location.search);
    this.setState({
      day: moment(parsed.departureDate, 'DD-MM-YYYY').format('dddd'),
      date: moment(parsed.departureDate, 'DD-MM-YYYY').format('DD MMMM YYYY'),
      adultCount: parsed.adultCount,
      childCount: parsed.childCount,
      infantCount: parsed.infantCount,
      return: parsed.return,
      cabin: this.state.seat[parsed.cabin]
    })

    let returnDate = '';
    if (parsed.return === 'true') {
      returnDate = moment(parsed.returnDate, 'DD-MM-YYYY').format('MM-DD-YYYY');
    } else {
      returnDate = ""
    }

    let payload = {
      departureAirport: {
        code: parsed.from
      },
      arrivalAirport: {
        code: parsed.to
      },
      departureDate: moment(parsed.departureDate, 'DD-MM-YYYY').format('MM-DD-YYYY'),
      returnDate: returnDate,
      promotionCode: "",
      currency: "IDR",
      airlines: [
        {
          code: "KAI"
        }
      ],
      noOfAdt: parsed.adultCount,
      noOfChd: parsed.childCount,
      noOfInf: parsed.infantCount,
      cabin: parsed.cabin,
      sessionId: sessionId,
      platform: "",
      appVersion: ""
    }
    //console.log(payload)
    if (parsed.return === 'true') {
      this.props.startSearchFlightTwoWay(payload, 0).then((result) => {
        this.setState({
          loading:false,
        })
      });
    } else {
      this.props.startSearchFlight(payload, 0).then((result) => {
        this.setState({
          loading:false,
        })
      });
    }
  }


  handleFilter = ({type, data}) => {
    console.log(type, data)
    this.setState({
      filterBy: data,
      filterType: type,
    }, () => this.updateList())
  }


  handleSort = (name, type) => {
    this.setState({
      sortBy: name,
      sortType: type,
    }, () => this.updateList())
  }

  updateList = e => {
    let { originFlightSchedule, sortBy, sortType, filterBy, filterType } = this.state;
    //console.log('filte1', originFlightSchedule[0].flightJourneys)
    let filtered = originFlightSchedule;
    let filterSchedule = {}
    // filter
    switch (filterType) {
      case 'airline':
        //console.log(filterBy)
        filterSchedule = _.filter(filtered[0].flightJourneys, function (e) {
          return filterBy.indexOf(e.flightSegments[0].airline.code) != -1
        });
        break;
      default:
        filterSchedule = filtered[0].flightJourneys;
        break;
    }

    filtered[0].flightJourneys = filterSchedule;
    
    //console.log('fil', filterSchedule)
    // sorting 
    //console.log('sorting')
    //console.log(filtered)

    let sortedSchedule = {}
    switch (sortBy) {
      case 'depart':
        sortedSchedule = _.orderBy(filtered[0].flightJourneys, function (e) { return new Date(e.flightSegments[0].std) }, [sortType]);
        this.setState({
          airlineSortUp: false,
          priceSortUp: false,
          departSortUp: !this.state.departSortUp,
          arriveSortUp: false,
          durationSortUp: false
        })
        break;
      case 'arrive':
        sortedSchedule = _.orderBy(filtered[0].flightJourneys, function (e) { return new Date(e.flightSegments[0].sta) }, [sortType]);
        this.setState({
          airlineSortUp: false,
          priceSortUp: false,
          departSortUp: false,
          arriveSortUp: !this.state.arriveSortUp,
          durationSortUp: false
        })
        break;
      case 'duration':
        sortedSchedule = _.orderBy(filtered[0].flightJourneys, function (e) {
          const d1 = moment(e.flightSegments[0].std);
          const d2 = moment(e.flightSegments[e.flightSegments.length - 1].sta)
          const mm = d2.diff(d1, 'minutes');
          return mm;
        }, [sortType]);
        this.setState({
          airlineSortUp: false,
          priceSortUp: false,
          departSortUp: false,
          arriveSortUp: false,
          durationSortUp: !this.state.durationSortUp
        })
        break;
      case 'airline':
        sortedSchedule = _.orderBy(filtered[0].flightJourneys, function (e) { return e.flightSegments[0].airline.name; }, [sortType]);
        this.setState({
          airlineSortUp: !this.state.airlineSortUp,
          priceSortUp: false,
          departSortUp: false,
          arriveSortUp: false,
          durationSortUp: false
        })
        break;
      case 'price':
        sortedSchedule = _.orderBy(filtered[0].flightJourneys, function (e) { return e.flightSegments[0].fares[0].basicFare }, [sortType]);
        this.setState({
          priceSortUp: !this.state.priceSortUp,
          airlineSortUp: false,
          departSortUp: false,
          arriveSortUp: false,
          durationSortUp: false
        })
        break;
      default:
        // sorBy price
        sortedSchedule = _.orderBy(filtered[0].flightJourneys, function (e) { return e.flightSegments[0].fares[0].basicFare }, [sortType]);
        break;
    }

    filtered[0].flightJourneys = sortedSchedule;

    this.setState({
      showFlightSchedule: filtered
    })
  }

  /*
  handleSortDepart = e => {
    const { flightSchedule, sortFlight } = this.props;
    const { originFlightSchedule, showFlightSchedule } = this.state;
    const list = flightSchedule[0].flightJourneys;
    let filtered = null;
    if (!this.state.departSortUp) {
      filtered = _.sortBy(list, function (item) {
        return new Date(item.flightSegments[0].std);
      });
    } else {
      filtered = _.sortBy(list, function (item) {
        return new Date(item.flightSegments[0].std);
      }).reverse();
    }

    this.setState({
      departSortUp: !this.state.departSortUp
    })
    sortFlight(filtered);
  }

  handleSortDuration = e => {
    const { flightSchedule, sortFlight } = this.props;
    const list = flightSchedule[0].flightJourneys;
    let filtered = null;
    if (!this.state.durationSortUp) {
      filtered = _.sortBy(list, function (item) {
        const d1 = moment(item.flightSegments[0].std);
        const d2 = moment(item.flightSegments[item.flightSegments.length - 1].sta)
        const mm = d2.diff(d1, 'minutes');
        return mm;
      });
    } else {
      filtered = _.sortBy(list, function (item) {
        const d1 = moment(item.flightSegments[0].std);
        const d2 = moment(item.flightSegments[item.flightSegments.length - 1].sta)
        const mm = d2.diff(d1, 'minutes');
        return mm;
      }).reverse();
    }

    this.setState({
      durationSortUp: !this.state.durationSortUp
    })
    sortFlight(filtered);
  }

  handleSortArrive = e => {
    const { flightSchedule, sortFlight } = this.props;
    const list = flightSchedule[0].flightJourneys;
    let filtered = null;
    if (!this.state.arriveSortUp) {
      filtered = _.sortBy(list, function (item) {
        return new Date(item.flightSegments[0].sta);
      });
    } else {
      filtered = _.sortBy(list, function (item) {
        return new Date(item.flightSegments[0].sta);
      }).reverse();
    }

    this.setState({
      arriveSortUp: !this.state.arriveSortUp
    })
    sortFlight(filtered);
  }

  handleSortAirline = e => {
    const { flightSchedule, sortFlight } = this.props;
    const list = flightSchedule[0].flightJourneys;
    let filtered = null;
    if (!this.state.airlineSortUp) {
      filtered = _.sortBy(list, function (item) {
        return item.flightSegments[0].airline.name;
      });
    } else {
      filtered = _.sortBy(list, function (item) {
        return item.flightSegments[0].airline.name;
      }).reverse();
    }

    this.setState({
      airlineSortUp: !this.state.airlineSortUp
    })
    sortFlight(filtered);
  }

  handleSortPrice = e => {
    const { flightSchedule, sortFlight } = this.props;
    const list = flightSchedule[0].flightJourneys;
    let filtered = null;
    if (!this.state.priceSortUp) {
      filtered = _.sortBy(list, function (item) {
        return item.flightSegments[0].fares[0].basicFare;
      });
    } else {
      filtered = _.sortBy(list, function (item) {
        return item.flightSegments[0].fares[0].basicFare;
      }).reverse();
    }

    this.setState({
      priceSortUp: !this.state.priceSortUp
    })
    sortFlight(filtered);
  }
*/
  handleChangeSearch = e => {
    console.log(e)
    this.setState({
      day: moment(e.obj.departureDate, 'DD-MM-YYYY').format('dddd'),
      date: moment(e.obj.departureDate, 'DD-MM-YYYY').format('DD MMMM YYYY'),
      // adultCount: e.obj.adultCount,
      // childCount: e.obj.childCount,
      // infantCount: e.obj.infantCount,
      // return: e.obj.return,
    })
  }

  changeFlight1 = e => {
    this.setState({
      uid1: '',
      modalIsOpen: false,
    })
  }

  changeFlight2 = e => {
    this.setState({
      uid2: '',
      modalIsOpen: false,
    })
  }

  handleBookFlight = e => {
    history.push(`/kereta-api/prebooking/${this.state.uid1}/${this.state.uid2}`)
  }

  onChoose = e => {
    const { twoway, flightSchedule } = this.props;
    const self = this;
    if (twoway) {
      if (this.state.uid1 !== '' && e.idx === 1) {

        const fs2 = flightSchedule[1].flightJourneys.filter((item) => {
          return item.uid === e.uid
        });
        this.props.setSelectedFlight2(fs2[0]);
        this.setState({
          modalIsOpen: true,
          uid2: e.uid
        })
        //history.push(`/flight/prebooking/${this.state.uid1}/${e.uid}`)
      }
      else if (this.state.uid2 !== '' && e.idx === 0) {

        const fs = flightSchedule[0].flightJourneys.filter((item) => {
          return item.uid === e.uid
        });
        //console.log(fs)
        this.props.setSelectedFlight(fs[0]);
        this.setState({
          modalIsOpen: true,
          uid1: e.uid
        })
        //history.push(`/flight/prebooking/${e.uid}/${this.state.uid2}`) 
      }
      else {
        if (e.idx == 0) {
          this.setState({
            uid1: e.uid,
          })
          const fs = flightSchedule[0].flightJourneys.filter((item) => {
            return item.uid === e.uid
          });
          //console.log(fs)
          this.props.setSelectedFlight(fs[0]);
        } else {
          this.setState({
            uid2: e.uid
          })
          const fs2 = flightSchedule[1].flightJourneys.filter((item) => {
            return item.uid === e.uid
          });
          this.props.setSelectedFlight2(fs2[0]);
        }

      }
    } else {
      // one way
      history.push(`/kereta-api/prebooking/${e.uid}`)
    }
    //console.log(e)
  }

  render() {
    const { departureAirportName, arrivalAirportName, loadingTrains } = this.props;
    const { loading } = this.state;
    return (
      <div>
        <div className="jumbotron search-bg2">
          <div className="container">
            <div className="row hotel-search">
              <div className="col-md-8">
                <h2>Find a best train <br /><span>for your trip</span> </h2>
                {/*<h2>Your search result for {selectedCity.cityName}</h2>*/}
              </div>
              <div className="col-md-3">
                <img src="/img/flighticon.png" />
              </div>
            </div>
          </div>
        </div>
        <div className="change-flight">
          <div className="container">

            <div className="row">
              {this.state.return === 'false' &&
                <div className="col-md-8">
                  <div className="hotel-title" style={{ color: '#FFF' }}>
                    {departureAirportName !== '' &&
                      <h2>{departureAirportName} ({this.state.showFlightSchedule[0].departureAirport.code})
              → {arrivalAirportName} ({this.state.showFlightSchedule[0].arrivalAirport.code})</h2>
                    }
                    <span>{this.state.day}, {this.state.date} -
              {this.state.adultCount > 0 &&
                        <span> {this.state.adultCount} Adult</span>
                      }
                      {this.state.childCount > 0 &&
                        <span>, {this.state.childCount} Child</span>
                      }
                      {this.state.infantCount > 0 &&
                        <span>, {this.state.infantCount} Infant</span>
                      } </span>
                  </div>
                </div>
              }
              {this.state.return === 'true' &&
                <div className="col-md-8">
                  <div className="hotel-title" style={{ color: '#FFF' }}>
                    {departureAirportName !== '' &&
                      <h2>{departureAirportName}
                        &nbsp; ⇆ {arrivalAirportName} </h2>
                    }
                    <span>{this.state.day}, {this.state.date} -
              {this.state.adultCount > 0 &&
                        <span> {this.state.adultCount} Adult</span>
                      }
                      {this.state.childCount > 0 &&
                        <span>, {this.state.childCount} Child</span>
                      }
                      {this.state.infantCount > 0 &&
                        <span>, {this.state.infantCount} Infant</span>
                      } - {this.state.cabin}</span>
                  </div>
                </div>
              }
              <div className="col-md-4">
                <button type="button" style={{ marginTop: '20px', marginBottom: '20px' }} className="btn change-btn pull-right"
                  data-toggle="collapse" href="#collapseExample" aria-expanded="false"
                  aria-controls="collapseExample">Change Search</button>
                <br />
              </div>
              <div className="col-md-12">
                <div className="collapse" id="collapseExample">
                  <TrainResultWidget handleChangeSearch={this.handleChangeSearch} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-8">
              <ol className="breadcrumb">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/">Train</Link></li>
                {departureAirportName !== '' &&
                  <li className="active">
                    {departureAirportName !== '' && this.state.return === 'false' &&
                      <span>{departureAirportName} 
                      &nbsp; - {arrivalAirportName}</span>
                    }

                    {departureAirportName !== '' && this.state.return === 'true' &&
                      <span>{departureAirportName}
                        &nbsp; ⇆ {arrivalAirportName} </span>
                    
                    }
                  </li>
                }
              </ol>
              <p style={{ color: '#595959' }}>{this.state.showFlightSchedule[0].flightJourneys.length} result</p>
            </div>
            <div className="col-md-4">
              {/*this.state.return === 'false' && this.state.showFlightSchedule[0].flightJourneys.length > 0 &&
                <FlightFilterMenu applyFilter={this.handleFilter} twoway={false}/>
              */}
            </div>
          </div>
          <div className="clear"></div>

          <br />
          {/*loadingTrains < 100 &&
            <div>
              <div className="progress">
                <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{ width: `${loadingTrains}%`, background: '#2094b9' }}>
                </div>
              </div>
              <p style={{ textAlign: 'center' }}>Loading {loadingTrains}%</p>
            </div>
          */}
          {this.state.showFlightSchedule[0].flightJourneys.length == 0 && !loading &&
            <div style={{textAlign:'center'}}>
              <img src="/img/iconmodal.png" /><br/><br/>
              <p style={{color:'#888'}}>Train Route Not Found</p>
            </div>
          }
          {this.state.showFlightSchedule[0].flightJourneys.length == 0 && loading &&
            <section style={{marginTop:'30px'}}>
            {[...Array(parseInt(8))].map((x, i) => (
            <div className="ticket">
              <div className="row">
                <div className="col-md-2">
                  <div className="animate-flicker"></div>
                </div>
                <div className="col-md-2">
                  <div className="animate-flicker2"></div>
                  <div className="animate-flicker2"></div>
                  <div className="animate-flicker2"></div>
                </div>
                <div className="col-md-2">
                  <div className="animate-flicker2"></div>
                  <div className="animate-flicker2"></div>
                  <div className="animate-flicker2"></div>
                </div>
                <div className="col-md-2">
                  <div className="animate-flicker2"></div>
                  <div className="animate-flicker2"></div>
                  <div className="animate-flicker2"></div>
                </div>
                <div className="col-md-2">
                  <div className="animate-flicker2"></div>
                  <div className="animate-flicker2"></div>
                  <div className="animate-flicker2"></div>
                </div>
                <div className="col-md-2">
                  <div className="animate-flicker2"></div>
                  <div className="animate-flicker2"></div>
                  <div className="animate-flicker2"></div>
                </div>
              </div>
            </div>
            ))}
            </section>
          }
          {this.state.showFlightSchedule[0].flightJourneys.length > 0 && this.state.return === 'false' &&
            <div className="row">
              <div className="col-md-2">

              </div>
              <div className="col-md-2">
                <span>Depart</span>&nbsp;
            {this.state.departSortUp &&
                  <span className="glyphicon glyphicon-menu-up" onClick={() => this.handleSort('depart', 'asc')}></span>
                }
                {!this.state.departSortUp &&
                  <span className="glyphicon glyphicon-menu-down" onClick={() => this.handleSort('depart', 'desc')}></span>
                }
              </div>
              <div className="col-md-2">
                <span>Arrive</span>&nbsp;
            {this.state.arriveSortUp &&
                  <span className="glyphicon glyphicon-menu-up" onClick={() => this.handleSort('arrive', 'asc')}></span>
                }
                {!this.state.arriveSortUp &&
                  <span className="glyphicon glyphicon-menu-down" onClick={() => this.handleSort('arrive', 'desc')}></span>
                }
              </div>
              <div className="col-md-2">
                <span>Duration</span>&nbsp;
            {this.state.durationSortUp &&
                  <span className="glyphicon glyphicon-menu-up" onClick={() => this.handleSort('duration', 'asc')}></span>
                }
                {!this.state.durationSortUp &&
                  <span className="glyphicon glyphicon-menu-down" onClick={() => this.handleSort('duration', 'desc')}></span>
                }
              </div>
              <div className="col-md-2">

              </div>
              <div className="col-md-2">
                <span>Price Per Person</span>&nbsp;
            {this.state.priceSortUp &&
                  <span className="glyphicon glyphicon-menu-up" onClick={() => this.handleSort('price', 'asc')}></span>
                }
                {!this.state.priceSortUp &&
                  <span className="glyphicon glyphicon-menu-down" onClick={() => this.handleSort('price', 'desc')}></span>
                }
              </div>
            </div>
          }
          {this.state.return === 'false' &&
            <div>
              {this.state.showFlightSchedule[0].flightJourneys.map((item, index) => (
                <FlightScheduleCard key={index} item={item} index={index}
                  train={true}
                  adultCount={this.state.adultCount} childCount={this.state.childCount} infantCount={this.state.infantCount}
                  onChoose={this.onChoose} twoway={this.props.twoway} idx={0} />
              ))}
            </div>
          }
          {this.state.return === 'true' &&
            <div className="row">
              {this.state.uid1 === '' &&
                <div className="col-md-6">
                  {this.state.showFlightSchedule[0].flightJourneys.length > 0 &&
                  <FlightTwowayMenu/>
                  }
                  {this.state.showFlightSchedule[0].flightJourneys.map((item, index) => (
                    <FlightScheduleCardTwo 
                      train={true}
                      key={index} item={item} index={index} way={'oneway'}
                      adultCount={this.state.adultCount} childCount={this.state.childCount} infantCount={this.state.infantCount}
                      onChoose={this.onChoose} twoway={this.props.twoway} idx={0} />
                  ))}
                </div>
              }
              {this.state.uid1 !== '' &&
                <div className="col-md-6">
                  {this.props.selectedFlight.flightSegments.map((flight, index) => (
                    <div className="p20 box-flight">
                      <TrainDetailCard flight={flight} key={index} />
                      {this.props.selectedFlight.flightSegments.length > 1 && index == 1 &&
                        <p onClick={this.changeFlight1} className="chg">Change Train</p>
                      }
                      {this.props.selectedFlight.flightSegments.length == 1 &&
                        <p onClick={this.changeFlight1} className="chg">Change Train</p>
                      }
                    </div>
                  ))}
                </div>
              }
              {typeof this.state.showFlightSchedule[1] !== 'undefined' && this.state.uid2 === '' &&
                <div className="col-md-6">
                  {this.state.showFlightSchedule[1].flightJourneys.length > 0 &&
                  <FlightTwowayMenu/>
                  }
                  {this.state.showFlightSchedule[1].flightJourneys.map((item, index) => (
                    <FlightScheduleCardTwo 
                      train={true}
                      key={index} item={item} index={index} way={'twoway'}
                      adultCount={this.state.adultCount} childCount={this.state.childCount} infantCount={this.state.infantCount}
                      onChoose={this.onChoose} twoway={this.props.twoway} idx={1} />
                  ))}
                </div>
              }
              {this.state.uid2 !== '' &&
                <div className="col-md-6">
                  {this.props.selectedFlight2.flightSegments.map((flight, index) => (
                    <div className="p20 box-flight">
                      <TrainDetailCard flight={flight} key={index} />
                      {this.props.selectedFlight2.flightSegments.length > 1 && index == 1 &&
                        <p onClick={this.changeFlight2} className="chg">Change Train</p>
                      }
                      {this.props.selectedFlight2.flightSegments.length == 1 &&
                        <p onClick={this.changeFlight2} className="chg">Change Train</p>
                      }
                    </div>
                  ))}
                </div>
              }
            </div>
          }
        </div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          {this.props.selectedFlight.flightSegments.map((flight, index) => (
            <div className="p20 box-flight">
              <TrainDetailCard flight={flight} key={index} modal={true} />
              {this.props.selectedFlight.flightSegments.length > 1 && index == 1 &&
                <p onClick={this.changeFlight1} className="chg2">Change Train</p>
              }
              {this.props.selectedFlight.flightSegments.length == 1 &&
                <p onClick={this.changeFlight1} className="chg2">Change Train</p>
              }
            </div>
          ))}
          {this.props.selectedFlight2.flightSegments.map((flight, index) => (
            <div className="p20 box-flight">
              <TrainDetailCard flight={flight} key={index} modal={true} />
              {this.props.selectedFlight2.flightSegments.length > 1 && index == 1 &&
                <p onClick={this.changeFlight2} className="chg2">Change Train</p>
              }
              {this.props.selectedFlight2.flightSegments.length == 1 &&
                <p onClick={this.changeFlight2} className="chg2">Change Train</p>
              }
            </div>
          ))}
          <button onClick={this.handleBookFlight} className="btn change-btn pull-right" style={{ padding: '10px 45px', float: 'left', marginBottom: '20px' }}>Book</button>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  flightSchedule: state.searchFlight.airlanesSchedule,
  airlinesCode: state.searchFlight.airlinesCode,
  departureAirportName: state.searchFlight.departureAirportName,
  arrivalAirportName: state.searchFlight.arrivalAirportName,
  loadingTrains: state.searchFlight.loadingTrains,
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
)(TrainSearch)
