import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { startSearchFlight, startSearchFlightTwoWay, sortFlight, setSelectedFlight, setSelectedFlight2 } from '../../modules/searchFlight';
import FlightResultWidget from '../../components/widget/filghtResultWidget';
import moment from 'moment';
import queryString from 'query-string';
import FlightScheduleCard from '../../components/flightScheduleCard';
import FlightScheduleCardTwo from '../../components/flightScheduleCard/flightScheduleCardTwo';
import { sessionId } from '../../config';
import { history } from '../../store';
import _ from 'lodash';
import Modal from 'react-responsive-modal';
import FlightDetailCard from '../../components/flightDetailCard';
import FlightFilterMenu from '../../components/flightFilterMenu';
import FlightTwowayMenu from '../../components/flightTwowayMenu';
import formatRp from '../../custom/formatRp';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxHeight: '680px',
    totalPrice: ''
  }
};

class FlightSearch extends React.Component {

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
    price1: 0,
    price2: 0,
    airlineSortUp: false,
    departSortUp: false,
    arriveSortUp: false,
    durationSortUp: false,
    priceSortUp: false,
    modalIsOpen: false,
    open2: false,
    originFlightSchedule: {},
    showFlightSchedule: {},
    filterBy: '',
    filterType: '',
    sortType: 'asc',
    loadingFlight: 0,
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  componentWillMount() {
    this.setState({
      showFlightSchedule: []
    })
    this.setState({
      originFlightSchedule: this.props.flightSchedule,
      showFlightSchedule: this.props.flightSchedule
    })
    //console.log("props")
    //console.log(this.props.flightSchedule)
  }

  componentWillReceiveProps(props) {
    //console.log('props', props.flightSchedule)
    this.setState({
      originFlightSchedule: props.flightSchedule,
      showFlightSchedule: props.flightSchedule
    })
    if (this.state.loadingFlight === 10){

    } else {
      if (props.twoway) {
        let data = []
        const sortedSchedule = _.orderBy(props.flightSchedule[0].flightJourneys, function (e) {
          let totalAdultFare = 0; 
          e.flightSegments.map((x, index) => {
            totalAdultFare = totalAdultFare + 1 * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
          })
          return totalAdultFare
        }, ['asc']);
        data = props.flightSchedule;
        data[0].flightJourneys = sortedSchedule;

        //let data2 = []
        const sortedSchedule2 = _.orderBy(props.flightSchedule[1].flightJourneys, function (e) {
          let totalAdultFare = 0; 
          e.flightSegments.map((x, index) => {
            totalAdultFare = totalAdultFare + 1 * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
          })
          return totalAdultFare
        }, ['asc']);
        //data2 = props.flightSchedule;
        data[1].flightJourneys = sortedSchedule2;
        this.setState({
          priceSortUp: false,
          airlineSortUp: false,
          departSortUp: false,
          arriveSortUp: false,
          durationSortUp: false,
          showFlightSchedule: data
        })
        //this.updateList(1)
        //this.updateList(0)
      } else {
        let data = []
        const sortedSchedule = _.orderBy(props.flightSchedule[0].flightJourneys, function (e) {
          let totalAdultFare = 0; 
          e.flightSegments.map((x, index) => {
            totalAdultFare = totalAdultFare + 1 * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
          })
          return totalAdultFare
        }, ['asc']);
        data = props.flightSchedule;
        data[0].flightJourneys = sortedSchedule;
        this.setState({
          priceSortUp: false,
          airlineSortUp: false,
          departSortUp: false,
          arriveSortUp: false,
          durationSortUp: false,
          showFlightSchedule: data
        })
        //console.log('sorted', sortedSchedule)
        //this.updateList(0)
      }
      
    }
    if (this.state.loadingFlight >= 100) {
      
    }
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

    let i = 0;
    this.props.airlinesCode.map((item, index) => {
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
            code: item.code
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
        this.props.startSearchFlightTwoWay(payload, index).then((result) => {
          
          this.setState({
            loadingFlight: Math.round((i / 7) * 100)
          })
          i++;
        });
      } else {
        
        this.props.startSearchFlight(payload, index).then((result) => {
          
          this.setState({
            loadingFlight: Math.round((i / 7) * 100)
          })
          i++;
        });
      }
      return false;
    })
  }

  handleLoading = (e) => {
    this.setState({
      loadingFlight: Math.round((e.i / 7) * 100)
    })
  }


  handleFilter = ({type, data}) => {
    //console.log(type, data)
    const self = this;
    if (this.state.return === 'true') {
      this.setState({
        filterBy: data,
        filterType: type,
      }, () => {
        this.updateList(0)
        setTimeout(() => {
          this.updateList(1, 1)
        }, 50)
      })
    } else {
      this.setState({
        filterBy: data,
        filterType: type,
      }, () => this.updateList(0))
    }
    
  }


  handleSort = (name, type) => {
    this.setState({
      sortBy: name,
      sortType: type,
    }, () => this.updateList(0))
  }

  handleSort1 = e => {
    //console.log(e)
    this.setState({
      sortBy: e.sortBy,
      sortType: e.sortType,
    }, () => this.updateList(0))
  }

  handleSort2 = e => {
    //console.log(e)
    this.setState({
      sortBy: e.sortBy,
      sortType: e.sortType,
    }, () => this.updateList(1))
  }

  updateList = (segment, b = 0, e) => {
    let { originFlightSchedule, showFlightSchedule, sortBy, sortType, filterBy, filterType, adultCount, childCount, infantCount } = this.state;
    //console.log(filterType, filterBy)
    //console.log(originFlightSchedule[segment])
    let filtered = {};
    if (b === 0) {
      filtered = Object.assign({}, originFlightSchedule[segment]);
    } else {
      //console.log('fffff')
      filtered = Object.assign({}, showFlightSchedule[segment]);
    }
    
    let filterSchedule = {}
    // filter
    switch (filterType) {
      case 'airline':
        //console.log(filterBy)
        filterSchedule = _.filter(filtered.flightJourneys, function (e) {
          if (filterBy.length === 0) {
            return filtered.flightJourneys;
          }
          return filterBy.indexOf(e.flightSegments[0].airline.code) != -1
        });
        break;
      case 'price':
        
          filterSchedule = _.filter(filtered.flightJourneys, function (e) {
            //console.log('fb', filterBy)
            //console.log(e.flightSegments[segment].fares[0].basicFare)
            let totalAdultFare = 0
            let totalChildFare = 0
            let totalInfantFare = 0
            const x = e.flightSegments[0];
            totalAdultFare = totalAdultFare + adultCount * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
            totalChildFare = totalChildFare + childCount * (x.fares[0].childFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
            totalInfantFare = totalInfantFare + infantCount * (x.fares[0].infantFare + x.fares[0].infantVat + x.fares[0].iwjr);
            
            if (filterBy === 0) {
              return filtered.flightJourneys;
            }
            return totalAdultFare + totalChildFare + totalInfantFare < filterBy.max && totalAdultFare + totalChildFare + totalInfantFare > filterBy.min
            // if (filterBy.includes('price500')) {
            //   return totalAdultFare + totalChildFare + totalInfantFare < 600000
            // }
            // if (filterBy.includes('price1000')) {
            //   return totalAdultFare + totalChildFare + totalInfantFare < 1000000 && totalAdultFare + totalChildFare + totalInfantFare > 600000
            // }
            // if (filterBy.includes('price1000k')) {
            //   return totalAdultFare + totalChildFare + totalInfantFare > 1000000
            // }
          });
        break;
      case 'transit':
        //console.log(filtered.flightJourneys)
        filterSchedule = _.filter(filtered.flightJourneys, function (e) {
          if (filterBy.length === 0) {
            return filtered.flightJourneys;
          }
          if (filterBy.includes('direct')){
            return e.flightSegments.length === 1
          }
          if (filterBy.includes('transit1')){
            return e.flightSegments.length === 2
          }
          if (filterBy.includes('transit2')){
            return e.flightSegments.length === 3
          }
        });
        break;
      case 'departure':
        //console.log(filtered.flightJourneys)
        filterSchedule = _.filter(filtered.flightJourneys, function (e) {
          if (filterBy.length === 0) {
            return filtered.flightJourneys;
          }
          if (filterBy.includes('departure1')){
            const time = parseInt(moment(e.flightSegments[0].std).format("H"))
            return time >= 0 && time < 6
          }
          if (filterBy.includes('departure2')){
            const time = parseInt(moment(e.flightSegments[0].std).format("H"))
            return time >= 6 && time < 12
          }
          if (filterBy.includes('departure3')){
            const time = parseInt(moment(e.flightSegments[0].std).format("H"))
            return time >= 12 && time < 18
          }
          if (filterBy.includes('departure4')){
            const time = parseInt(moment(e.flightSegments[0].std).format("H"))
            return time >= 18 && time < 24
          }
        });
        break;
      case 'arrival':
        
        filterSchedule = _.filter(filtered.flightJourneys, function (e) {
          //console.log(moment(e.flightSegments[0].sta).format("H"))
          if (filterBy.length === 0) {
            return filtered.flightJourneys;
          }
          if (filterBy.includes('arrival1')){
            const time = parseInt(moment(e.flightSegments[e.flightSegments.length - 1].sta).format("H"))
            return time >= 0 && time < 6
          }
          if (filterBy.includes('arrival2')){
            const time = parseInt(moment(e.flightSegments[e.flightSegments.length - 1].sta).format("H"))
            return time >= 6 && time < 12
          }
          if (filterBy.includes('arrival3')){
            const time = parseInt(moment(e.flightSegments[e.flightSegments.length - 1].sta).format("H"))
            return time >= 12 && time < 18
          }
          if (filterBy.includes('arrival4')){
            const time = parseInt(moment(e.flightSegments[e.flightSegments.length - 1].sta).format("H"))
            return time >= 18 && time < 24
          }
        });
        break;
      default:
        filterSchedule = filtered.flightJourneys;
        break;
    }

    filtered.flightJourneys = filterSchedule;
    //console.log('filte1', filtered)
    //console.log('fil', filterSchedule)
    // sorting 
    //console.log('sorting')
    //console.log(filtered)
    //console.log('sort', sortBy, sortType)
    let sortedSchedule = {}
    switch (sortBy) {
      case 'depart':
        sortedSchedule = _.orderBy(filtered.flightJourneys, function (e) { return new Date(e.flightSegments[0].std) }, [sortType]);
        this.setState({
          airlineSortUp: false,
          priceSortUp: false,
          departSortUp: !this.state.departSortUp,
          arriveSortUp: false,
          durationSortUp: false
        })
        break;
      case 'arrive':
        //console.log(filtered.flightJourneys)
        sortedSchedule = _.orderBy(filtered.flightJourneys, function (e) { return new Date(e.flightSegments[e.flightSegments.length - 1].sta) }, [sortType]);
        this.setState({
          airlineSortUp: false,
          priceSortUp: false,
          departSortUp: false,
          arriveSortUp: !this.state.arriveSortUp,
          durationSortUp: false
        })
        break;
      case 'duration':
        sortedSchedule = _.orderBy(filtered.flightJourneys, function (e) {
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
        sortedSchedule = _.orderBy(filtered.flightJourneys, function (e) { return e.flightSegments[0].airline.name; }, [sortType]);
        //console.log('sa', sortedSchedule)
        this.setState({
          airlineSortUp: !this.state.airlineSortUp,
          priceSortUp: false,
          departSortUp: false,
          arriveSortUp: false,
          durationSortUp: false
        })
        break;
      case 'price':
        sortedSchedule = _.orderBy(filtered.flightJourneys, function (e) {
          let totalAdultFare = 0; 
          e.flightSegments.map((x, index) => {
            totalAdultFare = totalAdultFare + 1 * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
          })
          return totalAdultFare
        }, [sortType]);
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
        sortedSchedule = _.orderBy(filtered.flightJourneys, function (e) {
          let totalAdultFare = 0; 
          e.flightSegments.map((x, index) => {
            totalAdultFare = totalAdultFare + 1 * (x.fares[0].basicFare + x.fares[0].basicVat + x.fares[0].iwjr + x.fares[0].fuelSurcharge + x.fares[0].airportTax + x.fares[0].otherFee);
          })
          return totalAdultFare
        }, [sortType]);
        this.setState({
          priceSortUp: false,
          airlineSortUp: false,
          departSortUp: false,
          arriveSortUp: false,
          durationSortUp: false
        })
        break;
    }
    //console.log('ss', sortedSchedule)
    //console.log(this.state.showFlightSchedule)

    filtered.flightJourneys = sortedSchedule;
    

    //console.log('ssss', filtered)
    
    if (this.state.return === 'true') {
      const f = [];
      f[segment] = filtered;
      if (b === 0) {
        if(segment == 0) {
          f[1] = originFlightSchedule[1];
        } else {
          f[0] = originFlightSchedule[0];
        }
      } else {
        if(segment == 0) {
          f[1] = showFlightSchedule[1];
        } else {
          f[0] = showFlightSchedule[0];
        }
      }
      this.setState({
        showFlightSchedule: f
      })
    } else {
      this.setState({
        showFlightSchedule: [filtered]
      })
    }
    
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
    this.setState({
      day: moment(e.obj.departureDate, 'DD-MM-YYYY').format('dddd'),
      date: moment(e.obj.departureDate, 'DD-MM-YYYY').format('DD MMMM YYYY'),
      adultCount: e.obj.adultCount,
      childCount: e.obj.childCount,
      infantCount: e.obj.infantCount,
      return: e.obj.return,
      cabin: this.state.seat[e.obj.cabin]
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
    const { selectedFlight, selectedFlight2 } = this.props;
    if (moment(selectedFlight.flightSegments[0].sta) > moment(selectedFlight2.flightSegments[0].std)) {
      this.setState({
        open2: true,
      })
    } else {
      history.push(`/flight/prebooking/${this.state.uid1}/${this.state.uid2}`)
    }
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
          uid2: e.uid,
          totalPrice: this.state.price1 + e.price
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
          uid1: e.uid,
          totalPrice: e.price + this.state.price2
        })
        //history.push(`/flight/prebooking/${e.uid}/${this.state.uid2}`) 
      }
      else {
        if (e.idx == 0) {
          this.setState({
            uid1: e.uid,
            price1: e.price
          })
          const fs = flightSchedule[0].flightJourneys.filter((item) => {
            return item.uid === e.uid
          });
          //console.log(fs)
          this.props.setSelectedFlight(fs[0]);
        } else {
          this.setState({
            uid2: e.uid,
            price2: e.price
          })
          const fs2 = flightSchedule[1].flightJourneys.filter((item) => {
            return item.uid === e.uid
          });
          this.props.setSelectedFlight2(fs2[0]);
        }

      }
    } else {
      // one way
      history.push(`/flight/prebooking/${e.uid}`)
    }
    //console.log(e)
  }

  onCloseModal = () => {
    this.setState({ modalIsOpen: false });
  };

  onCloseModal2 = () => {
    this.setState({ open2: false });
  };

  render() {
    const { departureAirportName, arrivalAirportName } = this.props;
    const { loadingFlight } = this.state;
    //console.log('load', loadingFlight)
    return (
      <div>
        <div className="jumbotron search-bg2">
          <div className="container">
            <div className="row hotel-search">
              <div className="col-md-8 col-sm-7 col-xs-12">
                <h2>Find a best flight <br /><span>for your trip</span> </h2>
                {/*<h2>Your search result for {selectedCity.cityName}</h2>*/}
              </div>
              <div className="col-md-3 col-sm-4 hidden-xs">
                <img src="/img/searchimgflight.png" style={{marginTop:'10px'}} className="src-img-fl" />
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
                      } - {this.state.cabin}</span>
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
                <button type="button" style={{ marginBottom: '20px' }} className="btn change-btn pull-right change-btn-fl"
                  data-toggle="collapse" href="#collapseExample" aria-expanded="false"
                  aria-controls="collapseExample">Change Search</button>
                <br />
              </div>
              <div className="col-md-12">
                <div className="collapse" id="collapseExample">
                  <FlightResultWidget handleChangeSearch={this.handleChangeSearch} onSuccess={this.handleLoading}/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="container">
          <div className="row">
            <div className="col-md-7">
            {departureAirportName !== '' &&
              <ol className="breadcrumb hidden-xs hidden-sm">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/">Flight</Link></li>
                
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
               
              </ol>
               }
              {departureAirportName !== '' &&<p style={{ color: '#595959' }} className=" hidden-xs hidden-sm">{this.state.showFlightSchedule[0].flightJourneys.length} flight</p>}
            </div>
            <div className="col-md-5">
              {this.state.return === 'false' &&
                <FlightFilterMenu applyFilter={this.handleFilter} twoway={false} load={this.state.loadingFlight}/>
              }
              {this.state.return === 'true' &&
                <FlightFilterMenu applyFilter={this.handleFilter} twoway={false} load={this.state.loadingFlight}/>
              }
            </div>
          </div>
          <div className="clear"></div>

          <br />
          {loadingFlight < 100 &&
            <div>
              <div className="progress">
                <div className="progress-bar" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{ width: `${loadingFlight}%`, background: '#ffb000' }}>
                </div>
              </div>
              <p style={{ textAlign: 'center' }}>Loading {loadingFlight}%</p>
            </div>
          }
          {this.state.showFlightSchedule[0].flightJourneys.length == 0 && loadingFlight >= 100 &&
            <div style={{textAlign:'center'}}>
              <img src="/img/notfound.png" className="not-found" /><br/><br/>
            </div>
          }
          {this.state.showFlightSchedule[0].flightJourneys.length == 0 && loadingFlight < 100 &&
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
            <div className="row hidden-sm hidden-xs">
              <div className="col-md-2">
                <span>Airline</span>&nbsp;
                {this.state.airlineSortUp &&
                  <span className="glyphicon glyphicon-menu-up" onClick={() => this.handleSort('airline', 'asc')}></span>
                }
                {!this.state.airlineSortUp &&
                  <span className="glyphicon glyphicon-menu-down" onClick={() => this.handleSort('airline', 'desc')}></span>
                }
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
                  <FlightTwowayMenu onTwowaySort={this.handleSort1}/>
                  }
                  {this.state.showFlightSchedule[0].flightJourneys.map((item, index) => (
                    <FlightScheduleCardTwo key={index} item={item} index={index} way={'oneway'}
                      adultCount={this.state.adultCount} childCount={this.state.childCount} infantCount={this.state.infantCount}
                      onChoose={this.onChoose} twoway={this.props.twoway} idx={0} />
                  ))}
                </div>
              }
              {this.state.uid1 !== '' &&
                <div className="col-md-6">
                  {this.props.selectedFlight.flightSegments.map((flight, index) => (
                    <div className="p20 box-flight">
                      <FlightDetailCard flight={flight} key={index} />
                      {this.props.selectedFlight.flightSegments.length > 1 && index == 1 &&
                        <p onClick={this.changeFlight1} className="chg">Change Flight</p>
                      }
                      {this.props.selectedFlight.flightSegments.length == 1 &&
                        <p onClick={this.changeFlight1} className="chg">Change Flight</p>
                      }
                    </div>
                  ))}
                </div>
              }
              {typeof this.state.showFlightSchedule[1] !== 'undefined' && this.state.uid2 === '' &&
                <div className="col-md-6">
                  {this.state.showFlightSchedule[1].flightJourneys.length > 0 &&
                  <FlightTwowayMenu onTwowaySort={this.handleSort2}/>
                  }
                  {this.state.showFlightSchedule[1].flightJourneys.map((item, index) => (
                    <FlightScheduleCardTwo key={index} item={item} index={index} way={'twoway'}
                      adultCount={this.state.adultCount} childCount={this.state.childCount} infantCount={this.state.infantCount}
                      onChoose={this.onChoose} twoway={this.props.twoway} idx={1} />
                  ))}
                </div>
              }
              {this.state.uid2 !== '' &&
                <div className="col-md-6">
                  {this.props.selectedFlight2.flightSegments.map((flight, index) => (
                    <div className="p20 box-flight">
                      <FlightDetailCard flight={flight} key={index} />
                      {this.props.selectedFlight2.flightSegments.length > 1 && index == 1 &&
                        <p onClick={this.changeFlight2} className="chg">Change Flight</p>
                      }
                      {this.props.selectedFlight2.flightSegments.length == 1 &&
                        <p onClick={this.changeFlight2} className="chg">Change Flight</p>
                      }
                    </div>
                  ))}
                </div>
              }
            </div>
          }
        </div>
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <Modal open={this.state.open2} onClose={this.onCloseModal2} little showCloseIcon={true}>
          <img src="/img/iconmodal.png" width="85" />
          <p>Error, Jadwal Kedatangan lebih dari Jadwal Kepulangan</p>
          <button onClick={this.onCloseModal2} className="btn btn-choose" style={{float:'none',display:'block',margin:'auto'}}
          >Ok</button>
        </Modal>
        <Modal
          open={this.state.modalIsOpen} onClose={this.onCloseModal} showCloseIcon={true}
          classNames={{modal:'modalcls'}}
        >
          {this.props.selectedFlight.flightSegments.map((flight, index) => (
            <div className="p20 box-flight">

              <FlightDetailCard flight={flight} key={index} idx={index} modal={true} title={"Pergi"}/>

            </div>
          ))}
          <hr style={{height:'1px',margin:'0 19px'}}/>
          {this.props.selectedFlight2.flightSegments.map((flight, index) => (
            <div className="p20 box-flight">

              <FlightDetailCard flight={flight} key={index} idx={index} modal={true} title={"Pulang"}/>

            </div>
          ))}
          <div className="total-bot" style={{background:'#f6f6f6'}}>
            <div className="pull-left">
              <p style={{textAlign:'left'}}>Total Price</p>
              <span style={{color:'#de6f20',fontSize:'20px'}}>Rp {formatRp(this.state.totalPrice)}</span>
            </div>
            <button onClick={this.handleBookFlight} className="btn btn-choose pull-right" style={{ padding: '10px 45px', float: 'left', margin:'0'}}>Book</button>
            <div className="clear"/>
          </div>
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
  //loadingFlight: state.searchFlight.loadingFlight,
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
)(FlightSearch)
