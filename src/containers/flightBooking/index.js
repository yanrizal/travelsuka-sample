import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { setSelectedFlight, postBookFlight } from '../../modules/searchFlight';
import moment from 'moment';
import formatRp from '../../custom/formatRp';
import { SingleDatePicker } from 'react-dates';
import { history } from '../../store';
import { sessionId } from '../../config';
import ModalPopup from '../../components/modal';
import Modal from 'react-responsive-modal';

class FlightBooking extends React.Component {

  state = {
    seat: {
      E: 'Economy',
      B: 'Business',
      F: 'First Class'
    },
    errors:{},
    middleNameContact: null,
    titleContact: "MR",
    open: false,
    open2: false,
    errorMsg: ''
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  onOpenModal2 = () => {
    this.setState({ open2: true });
  };

  onCloseModal2 = () => {
    this.setState({ open2: false });
  };

  handleBooking = e => {
    const { selectedFlight, selectedFlight2, international } = this.props;
    //console.log('selectedFlight', selectedFlight)
    const selectedFare = selectedFlight.flightSegments[0].fares[0];
    let errors = {};
    let valid = true;
    let passengers = []
    for (let i = 0; i < this.props.adultCount; i++) { 
      let passenger = {
        passengerNumber: 0,
        idNo: null,
        paxType: 'ADT',
        firstName: this.state[`adultFirstName-${i+1}`],
        middleName: '', //this.state[`adultMiddleName-${i+1}`],
        lastName: this.state[`adultLastName-${i+1}`],
        title: (typeof this.state[`adultTitle-${i+1}`] === 'undefined') ? 'MR':this.state[`adultTitle-${i+1}`],
        dob: (international) ? this.state[`adultYearDob-${i+1}`] + "-" + this.state[`adultMonthDob-${i+1}`] + "-" + this.state[`adultDayDob-${i+1}`] : "1980-01-01",
        //dob: this.state[`adultYearDob-${i+1}`] + "-" + this.state[`adultMonthDob-${i+1}`] + "-" + this.state[`adultDayDob-${i+1}`],
        gender: "M",
        nationality: null,
        ticketNumber: null,
        paxFare: null,
        infant: null,
        passport: null,
        seatInfo: null,
        // "passport": {
        //   "passportNumber": "ABCIO1",
        //   "dob": "1980-03-12",
        //   "issuerCountry": "ID",
        //   "passportExpiryDate": "2020-12-12",
        //   "nationality": "ID"
        // }
      }

      if (international) {
        passenger.passport = {
          passportNumber: this.state[`passportNumberAdult-${i+1}`],
          dob: this.state[`adultYearDob-${i+1}`] + "-" + this.state[`adultMonthDob-${i+1}`] + "-" + this.state[`adultDayDob-${i+1}`],
          issuerCountry: this.state[`nationalityAdult-${i+1}`],
          passportExpiryDate: this.state[`passportYearExpiryDateAdult-${i+1}`] + "-" + this.state[`passportMonthExpiryDateAdult-${i+1}`] + "-" + this.state[`passportDayExpiryDateAdult-${i+1}`],
          nationality: this.state[`nationalityAdult-${i+1}`],
        }
      }

      if (this.state[`adultFirstName-${i+1}`] === '' || typeof this.state[`adultFirstName-${i+1}`] === "undefined") {
        errors[`adultFirstName-${i+1}`] = "Cannot be empty";
        this.setState({
          errors: errors
        })
        valid = false;
        //console.log('a')
      }

      if(international){
      if (this.state[`passportNumberAdult-${i+1}`] === '' || typeof this.state[`passportNumberAdult-${i+1}`] === "undefined") {
        errors[`passportNumberAdult-${i+1}`] = "Cannot be empty";
        this.setState({
          errors: errors
        })
        valid = false;
      }
      }

      if (this.state[`adultLastName-${i+1}`] === '' || typeof this.state[`adultLastName-${i+1}`] === "undefined") {
        errors[`adultLastName-${i+1}`] = "Cannot be empty";
        this.setState({
          errors: errors
        })
        valid = false;
        //console.log('b')
      }
      // if (this.state[`adultDob-${i+1}`] === '' || typeof this.state[`adultDob-${i+1}`] === "undefined") {
      //   errors[`adultDob-${i+1}`] = "Cannot be empty";
      //   this.setState({
      //     errors: errors
      //   })
      //   valid = false;
      // }
      passengers.push(passenger);

    };
    for (let i = 0; i < this.props.childCount; i++) { 
      let passenger = {
        passengerNumber: 0,
        paxType: 'CHD',
        firstName: this.state[`childFirstName-${i+1}`],
        middleName: '', //this.state[`childMiddleName-${i+1}`],
        lastName: this.state[`childLastName-${i+1}`],
        title: (typeof this.state[`childTitle-${i+1}`] === 'undefined') ? 'MR':this.state[`childTitle-${i+1}`],
        //"dob": "1980-03-12",// this.state[`childDob-${i+1}`],
        dob: this.state[`childYearDob-${i+1}`] + "-" + this.state[`childMonthDob-${i+1}`] + "-" + this.state[`childDayDob-${i+1}`],
        passport: null
        // passport: {
        //   passportNumber: "ABCIO1",
        //   dob: this.state[`childYearDob-${i+1}`] + "-" + this.state[`childMonthDob-${i+1}`] + "-" + this.state[`childDayDob-${i+1}`],
        //   issuerCountry: "ID",
        //   passportExpiryDate: "2020-12-12",
        //   nationality: "ID"
        // }
      }

      if (international) {
        passenger.passport = {
          passportNumber: this.state[`passportNumberChild-${i+1}`],
          dob: this.state[`childYearDob-${i+1}`] + "-" + this.state[`childMonthDob-${i+1}`] + "-" + this.state[`childDayDob-${i+1}`],
          issuerCountry: this.state[`nationalityChild-${i+1}`],
          passportExpiryDate: this.state[`passportYearExpiryDateChild-${i+1}`] + "-" + this.state[`passportMonthExpiryDateChild-${i+1}`] + "-" + this.state[`passportDayExpiryDateChild-${i+1}`],
          nationality: this.state[`nationalityChild-${i+1}`],
        }
      }

      if (this.state[`childFirstName-${i+1}`] === '' || typeof this.state[`childFirstName-${i+1}`] === "undefined") {
        errors[`childFirstName-${i+1}`] = "Cannot be empty";
        this.setState({
          errors: errors
        })
        valid = false;
        //console.log('c')
      }
      if (this.state[`childLastName-${i+1}`] === '' || typeof this.state[`childLastName-${i+1}`] === "undefined") {
        errors[`childLastName-${i+1}`] = "Cannot be empty";
        this.setState({
          errors: errors
        })
        valid = false;
        //console.log('d')
      }

      if(international){
      if (this.state[`passportNumberChild-${i+1}`] === '' || typeof this.state[`passportNumberChild-${i+1}`] === "undefined") {
        errors[`passportNumberChild-${i+1}`] = "Cannot be empty";
        this.setState({
          errors: errors
        })
        valid = false;
      }
      }
      // if (this.state[`childDob-${i+1}`] === '' || typeof this.state[`childDob-${i+1}`] === "undefined") {
      //   errors[`childDob-${i+1}`] = "Cannot be empty";
      //   this.setState({
      //     errors: errors
      //   })
      //   valid = false;
      //   console.log('e')
      // }
      passengers.push(passenger)
    };
    for (let i = 0; i < this.props.infantCount; i++) {
      let infant = {
        firstName: this.state[`infantFirstName-${i+1}`],
        middleName: '', //this.state[`infantMiddleName-${i+1}`],
        lastName: this.state[`infantLastName-${i+1}`],
        title: (typeof this.state[`infantTitle-${i+1}`] === 'undefined') ? 'MR':this.state[`infantTitle-${i+1}`],
        dob: this.state[`infantYearDob-${i+1}`] + "-" + this.state[`infantMonthDob-${i+1}`] + "-" + this.state[`infantDayDob-${i+1}`],
        passport: null,
        // passport: {
        //   "passportNumber": "ABCIO1",
        //   dob: this.state[`infantYearDob-${i+1}`] + "-" + this.state[`infantMonthDob-${i+1}`] + "-" + this.state[`infantDayDob-${i+1}`],
        //   "issuerCountry": "ID",
        //   "passportExpiryDate": "2020-12-12",
        //   "nationality": "ID"
        // }
      }

      if (international) {
      infant.passport = {
        passportNumber: this.state[`passportNumberInfant-${i+1}`],
        dob: this.state[`infantYearDob-${i+1}`] + "-" + this.state[`infantMonthDob-${i+1}`] + "-" + this.state[`infantDayDob-${i+1}`],
        issuerCountry: this.state[`nationalityInfant-${i+1}`],
        passportExpiryDate: this.state[`passportYearExpiryDateInfant-${i+1}`] + "-" + this.state[`passportMonthExpiryDateInfant-${i+1}`] + "-" + this.state[`passportDayExpiryDateInfant${i+1}`],
        nationality: this.state[`nationalityInfant-${i+1}`],
      }
      }

      if (this.state[`infantFirstName-${i+1}`] === '' || typeof this.state[`infantFirstName-${i+1}`] === "undefined") {
        errors[`infantFirstName-${i+1}`] = "Cannot be empty";
        this.setState({
          errors: errors
        })
        valid = false;
        console.log('f')
      }
      if (this.state[`infantLastName-${i+1}`] === '' || typeof this.state[`infantLastName-${i+1}`] === "undefined") {
        errors[`infantLastName-${i+1}`] = "Cannot be empty";
        this.setState({
          errors: errors
        })
        valid = false;
        console.log('g')
      }
      // if (this.state[`infantDob-${i+1}`] === '' || typeof this.state[`infantDob-${i+1}`] === "undefined") {
      //   errors[`infantDob-${i+1}`] = "Cannot be empty";
      //   this.setState({
      //     errors: errors
      //   })
      //   valid = false;
      //   console.log('h')
      // }
      if(international){
      if (this.state[`passportNumberInfant-${i+1}`] === '' || typeof this.state[`passportNumberInfant-${i+1}`] === "undefined") {
        errors[`passportNumberInfant-${i+1}`] = "Cannot be empty";
        this.setState({
          errors: errors
        })
        valid = false;
      }
      }
      passengers[i].infant = infant
    }
    //console.log(passengers)
    
    if (this.state.firstNameContact === '' || typeof this.state.firstNameContact === "undefined") {
      errors["firstNameContact"] = "Cannot be empty";
      this.setState({
        errors: errors
      })
      valid = false;
      console.log('i')

    } 
    if (this.state.lastNameContact === '' || typeof this.state.lastNameContact === "undefined") {
      errors["lastNameContact"] = "Cannot be empty";
      this.setState({
        errors: errors
      })
      valid = false;
      console.log('j')
    } 
    if (this.state.mobilePhone === '' || typeof this.state.mobilePhone === "undefined") {
      errors["mobilePhone"] = "Cannot be empty";
      this.setState({
        errors: errors
      })
      valid = false;
      console.log('k')
    } 
    if (this.state.email === '' || typeof this.state.email === "undefined") {
      errors["email"] = "Cannot be empty";
      this.setState({
        errors: errors
      })
      valid = false;
      console.log('l')
    }

    console.log('valid', valid);

    if (valid) {
      this.onOpenModal()
      let payload = {
        "contacts": [
          {
            "firstName": this.state.firstNameContact,
            "middleName": this.state.middleNameContact,
            "lastName": this.state.lastNameContact,
            "title": this.state.titleContact,
            "homePhone": null,
            "mobilePhone": this.state.mobilePhone,
            "email": this.state.email,
            "workPhone": null,
            "city": null,
            "postalCode": null,
            "addressLine1": null,
            "addressLine2": null,
            "addressLine3": null
          }
        ],
        "passengers": passengers,
        "flightJourneys": [{
          "journeySellKey": selectedFlight.journeySellKey,
          "flightSegments": selectedFlight.flightSegments,
          "uid": this.props.selectedFlight.uid,
          "cabin": null,
          "duration": null,
        }],
        "sessionId": sessionId,
      }
      if (this.props.twoway) {
        payload.flightJourneys.push({
          "journeySellKey": selectedFlight2.journeySellKey,
          "flightSegments": selectedFlight2.flightSegments,
          "uid": selectedFlight2.uid,
          "cabin": null,
          "duration": null,
        })
        const selectedFare2 = selectedFlight2.flightSegments[0].fares[0];
        payload.flightJourneys[1].flightSegments.map((fl, index) => {
          payload.flightJourneys[1].flightSegments[index].selectedFare = selectedFlight2.flightSegments[index].fares[0];
        })
        //payload.flightJourneys[1].flightSegments[0].selectedFare = selectedFare2;
      }
      //console.log('payload',payload)
      payload.flightJourneys[0].flightSegments.map((fl, index) => {
        payload.flightJourneys[0].flightSegments[index].selectedFare = selectedFlight.flightSegments[index].fares[0];
      })

      //payload.flightJourneys[0].flightSegments[0].selectedFare = selectedFare;
      

      this.props.postBookFlight(payload).then((result) => {
        this.onCloseModal();
        //console.log(result);
        history.push(`/booking/flight/${result.transactionId}`);
      }).catch((errors) => {
        this.onCloseModal();
        this.onOpenModal2();
        //console.log(errors);
        this.setState({errorMsg: errors[0].message})
        //history.push(`/`);
      })
    }
  }

  handleChangeInput = (name, e) => {
    this.setState({
      [name]: e.target.value
    })
  }

  componentDidMount() {
    const self = this;
    window.scrollTo(0, 0);
    const { flightSchedule, adultCount, childCount, infantCount } = this.props;
    // const fs = flightSchedule[0].flightJourneys.filter((item) => {
    //   return item.uid === self.props.match.params.id
    // });
    //this.props.setSelectedFlight(fs[0]);
    for (let i = 0; i < parseInt(adultCount); i++) {
      this.setState({
        [`adultYearDob-${i+1}`]: 1980,
        [`adultDayDob-${i+1}`]: '01',
        [`adultMonthDob-${i+1}`]: '01', 
        [`passportYearExpiryDateAdult-${i+1}`]: 2020,
        [`passportDayExpiryDateAdult-${i+1}`]: '01',
        [`passportMonthExpiryDateAdult-${i+1}`]: '01', 
        [`nationalityAdult-${i+1}`]: 'ID'
      })
    }

    for (let i = 0; i < parseInt(childCount); i++) {
      this.setState({
        [`childYearDob-${i+1}`]: 2002,
        [`childDayDob-${i+1}`]: '01',
        [`childMonthDob-${i+1}`]: '01', 
        [`passportYearExpiryDateChild-${i+1}`]: 2020,
        [`passportDayExpiryDateChild-${i+1}`]: '01',
        [`passportMonthExpiryDateChild-${i+1}`]: '01', 
        [`nationalityChild-${i+1}`]: 'ID'
      })
    }

    for (let i = 0; i < parseInt(infantCount); i++) {
      this.setState({
        [`infantYearDob-${i+1}`]: 2010,
        [`infantDayDob-${i+1}`]: '01',
        [`infantMonthDob-${i+1}`]: '01', 
        [`passportYearExpiryDateInfant-${i+1}`]: 2020,
        [`passportDayExpiryDateInfant-${i+1}`]: '01',
        [`passportMonthExpiryDateInfant-${i+1}`]: '01', 
        [`nationalityInfant-${i+1}`]: 'ID'
      })
    }
  }

  handleImGuest = e => {
    if (this.state.imguest) {
      this.setState({
      imguest: !this.state.imguest,
      [`adultFirstName-1`]: '',
      [`adultMiddleName-1`]: '',
      [`adultLastName-1`]: '',
      [`adultTitle-1`]: 'MR'
    })
    } else {
      this.setState({
      imguest: !this.state.imguest,
      [`adultFirstName-1`]: this.state.firstNameContact,
      [`adultMiddleName-1`]: this.state.middleNameContact,
      [`adultLastName-1`]: this.state.lastNameContact,
      [`adultTitle-1`]: this.state.titleContact
    })
    }
    
  }

  render() {
    const { flightSchedule, adultCount, childCount, infantCount, selectedFlight, selectedFlight2 } = this.props;
    const dayDob = ["01","02","03","04","05","06","07","08","09",10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31];
    const monthDob = ['january','february','march','april','may','june','july','august','september','october','november','december']
    const yearDob = [];
    for (let i = 1914; i < 2018; i++) {
      yearDob.push(i)
    }
    const yearExp = [];
    for (let i = 2017; i < 2030; i++) {
      yearExp.push(i)
    }
    //console.log('s1', selectedFlight)
    //console.log('s2', selectedFlight2)
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


    const tax2 = item2.flightSegments[0].fares[0].airportTax;
    const iwjr2 = item2.flightSegments[0].fares[0].iwjr;
    const vat2 = item2.flightSegments[0].fares[0].basicVat;

    return (
      <div>
        <div className="jumbotron" style={{marginBottom:0,background:'#FFF'}}>
          <div className="top-book">
            <div className="container">
            <div className="row">
            <div className="col-md-12">
              <h1>Flight Booking</h1>
            </div>
            </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-8">
                {this.props.selectedFlight.flightSegments.map((flight, index) => (
                <div className="row" style={{marginBottom:'30px'}}>
                <div className="col-md-3 book-logo">
                  <img src={`/img/${flight.airline.code}.png`} width="100" alt="" /><br/>
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
                <div className="col-md-3 book-logo">
                  <img src={`/img/${flight.airline.code}.png`} width="100" alt="" /><br/>
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
                <h3 className="your-i">Contact Details</h3>
                <div className="clear"></div>
                {this.state.errorMsg !== '' &&
                  <div className="alert alert-danger" role="alert">
                    {this.state.errorMsg}
                  </div>
                }
                <div className="book-form">
                  <div className="row">
                  <div className="col-md-6">
                  <div className="form-group">
                    <label>First Name <span style={{color:'red'}}>*</span></label>
                    <input type="text" className="form-control"
                     value={this.state.firstNameContact} 
                     onChange={this.handleChangeInput.bind(this, 'firstNameContact')} placeholder="First name" />
                     <span style={{color: "red"}}>{this.state.errors["firstNameContact"]}</span>
                     <p>As on ID Card/passport/driving license (without degree or special characters)</p>
                  </div>
                  </div>
                  {/*<div className="col-md-6">
                  <div className="form-group">
                    <label>Middle Name</label>
                    <input type="text" className="form-control"
                    value={this.state.middleNameContact}
                    onChange={this.handleChangeInput.bind(this, 'middleNameContact')} placeholder="Middle name" />
                    <p>As on ID Card/passport/driving license</p>
                  </div>
                  </div>*/}
                  <div className="col-md-6">
                  <div className="form-group">
                    <label>Last Name <span style={{color:'red'}}>*</span></label>
                    <input type="text" className="form-control" 
                    value={this.state.lastNameContact}
                    onChange={this.handleChangeInput.bind(this, 'lastNameContact')} placeholder="Last name" />
                    <span style={{color: "red"}}>{this.state.errors["lastNameContact"]}</span>
                    <p>As on ID Card/passport/driving license</p>
                  </div>
                  </div>
                  <div className="clear"></div>
                  <div className="col-md-4">
                  <div className="form-group contact-form">
                    <label>Title <span style={{color:'red'}}>*</span></label>
                    <select className="form-control" value={this.state.titleContact} 
                    onChange={this.handleChangeInput.bind(this, 'titleContact')}>
                      <option value="MR">Mr</option>
                      <option value="MRS">Mrs</option>
                    </select>
                    <p></p>
                  </div>
                  </div>
                  <div className="clear"></div>
                  <div className="col-md-6">
                  <div className="form-group">
                    <label>Mobile Phone <span style={{color:'red'}}>*</span></label>
                    <input type="text" className="form-control" 
                    value={this.state.mobilePhone}
                    onChange={this.handleChangeInput.bind(this, 'mobilePhone')} placeholder="Mobile Phone" />
                    <span style={{color: "red"}}>{this.state.errors["mobilePhone"]}</span>
                    <p>e.g. +62812345678, for Country Code (+62) and Mobile No. 0812345678</p>
                  </div>
                  </div>
                  <div className="col-md-6">
                  <div className="form-group">
                    <label>Email <span style={{color:'red'}}>*</span></label>
                    <input type="text" className="form-control" 
                    value={this.state.email}
                    onChange={this.handleChangeInput.bind(this, 'email')} placeholder="Email" />
                    <span style={{color: "red"}}>{this.state.errors["email"]}</span>
                    <p>e.g. email@example.com</p>
                  </div>
                  </div>
                  </div>
                </div><br/>


                <h3 className="your-i">Traveler Details</h3>
                <div className="clear"></div>
                <div className="checkbox">
                <label>
                  <input type="checkbox" onClick={this.handleImGuest} checked={this.state.imguest}/>
                  <span className="cr" style={{border:'1px solid #595959'}}><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  <span className="crt">Im the guest</span>
                </label>
                </div>
                {parseInt(adultCount) > 0 && [...Array(parseInt(adultCount))].map((x, i) => (
                <div key={i} className="book-form">
                  <h4>Adult {i+1}</h4>
                  <div className="row">
                  <div className="col-md-6">
                  <div className="form-group">
                    <label>First Name <span style={{color:'red'}}>*</span></label>
                    <input type="text" className="form-control" 
                    value={this.state[`adultFirstName-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `adultFirstName-${i+1}`)}
                    placeholder="First name" />
                    <span style={{color: "red"}}>{this.state.errors[`adultFirstName-${i+1}`]}</span>
                    <p>As on ID Card/passport/driving license</p>
                  </div>
                  </div>
                  {/*<div className="col-md-6">
                  <div className="form-group">
                    <label>Middle Name</label>
                    <input type="text" className="form-control" 
                    value={this.state[`adultMiddleName-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `adultMiddleName-${i+1}`)}
                    placeholder="Middle name" />
                    <p>As on ID Card/passport/driving license</p>
                  </div>
                  </div>*/}
                  <div className="col-md-6">
                  <div className="form-group">
                    <label>Last Name <span style={{color:'red'}}>*</span></label>
                    <input type="text" className="form-control" 
                    value={this.state[`adultLastName-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `adultLastName-${i+1}`)}
                    placeholder="Last name" />
                    <span style={{color: "red"}}>{this.state.errors[`adultLastName-${i+1}`]}</span>
                    <p>As on ID Card/passport/driving license</p>
                  </div>
                  </div>
                  <div className="clear"></div>
                  <div className="col-md-4">
                  <div className="form-group contact-form">
                    <label>Title <span style={{color:'red'}}>*</span></label>
                    <select className="form-control" value={this.state[`adultTitle-${i+1}`]} 
                    onChange={this.handleChangeInput.bind(this, `adultTitle-${i+1}`)}>
                      <option value="MR" selected>Mr</option>
                      <option value="MRS">Mrs</option>
                    </select>
                    <p></p>
                  </div>
                  </div>
                  <div className="clear"></div>
                  {this.props.international &&
                  <div className="col-md-12">
                  <div className="form-group dob contact-form">
                    <label>Day of Birth <span style={{color:'red'}}>*</span></label>
                    <div className="row">
                      <div className="col-md-4">
                      <select className="form-control" value={this.state[`adultDayDob-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `adultDayDob-${i+1}`)}>
                        {dayDob.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                      <div className="col-md-4">
                      <select className="form-control" value={this.state[`adultMonthDob-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `adultMonthDob-${i+1}`)}>
                        {monthDob.map((item, index) => (  
                          <option value={(index < 9) ? `0${index+1}` : index + 1}>{item}</option>
                        ))}
                      </select>
                      </div>
                      <div className="col-md-4">
                      <select className="form-control"  value={this.state[`adultYearDob-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `adultYearDob-${i+1}`)}>
                        {yearDob.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                    </div>

                      <p></p>
                  </div>
                  </div>}
                  {this.props.international &&
                  <div className="col-md-4">
                    <div className="form-group contact-form">
                    <label>Passport Number<span style={{color:'red'}}>*</span></label>
                    <input type="text" className="form-control" 
                    value={this.state[`passportNumberAdult-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `passportNumberAdult-${i+1}`)}
                    placeholder="Passport Number" />
                    <span style={{color: "red"}}>{this.state.errors[`passportNumberAdult-${i+1}`]}</span>
                    <p>as in Passport Card</p>
                    </div>
                  </div>
                  }
                  <div className="clear"></div>
                  {this.props.international &&
                  <div className="col-md-12">
                  <div className="form-group dob contact-form">
                    <label>Passport Expiry Date<span style={{color:'red'}}>*</span></label>
                    <div className="row">
                      <div className="col-md-4">
                      <select className="form-control" value={this.state[`passportDayExpiryDateAdult-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `passportDayExpiryDateAdult-${i+1}`)}>
                        {dayDob.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                      <div className="col-md-4">
                      <select className="form-control" value={this.state[`passportMonthExpiryDateAdult-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `passportMonthExpiryDateAdult-${i+1}`)}>
                        {monthDob.map((item, index) => (  
                          <option value={(index < 9) ? `0${index+1}` : index + 1}>{item}</option>
                        ))}
                      </select>
                      </div>
                      <div className="col-md-4">
                      <select className="form-control"  value={this.state[`passportYearExpiryDateAdult-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `passportYearExpiryDateAdult-${i+1}`)}>
                        {yearExp.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                    </div>

                      <p></p>
                  </div>
                  </div>
                  }
                  <div className="clear"></div>
                  {this.props.international &&
                  <div className="col-md-4">
                  <div className="form-group contact-form">
                    <label>Nationality <span style={{color:'red'}}>*</span></label>
                    <select className="form-control" value={this.state[`nationalityAdult-${i+1}`]} 
                    onChange={this.handleChangeInput.bind(this, `nationalityAdult-${i+1}`)}>
                      <option value="ID" selected>Indonesia</option>
                    </select>
                    <p></p>
                  </div>
                  </div>
                  }
                  </div>
                </div>
                ))}

                {parseInt(childCount) > 0 && [...Array(parseInt(childCount))].map((x, i) => (
                <div className="book-form" key={i}>
                  <br/>
                  <h4>Child {i+1}</h4>
                  <div className="row">
                  <div className="col-md-6">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" className="form-control" 
                    value={this.state[`childFirstName-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `childFirstName-${i+1}`)}
                    placeholder="First name" />
                    <span style={{color: "red"}}>{this.state.errors[`childFirstName-${i+1}`]}</span>
                  </div>
                  </div>
                  {/*<div className="col-md-6">
                  <div className="form-group">
                    <label>Middle Name</label>
                    <input type="text" className="form-control" 
                    value={this.state[`childMiddleName-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `childMiddleName-${i+1}`)}
                    placeholder="Middle name" />
                  </div>
                  </div>*/}
                  <div className="col-md-6">
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" className="form-control" 
                    value={this.state[`childLastName-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `childLastName-${i+1}`)}
                    placeholder="Last name" />
                     <span style={{color: "red"}}>{this.state.errors[`childLastName-${i+1}`]}</span>
                  </div>
                  </div>
                  <div className="clear"></div>
                  <div className="col-md-4">
                  <div className="form-group contact-form">
                    <label>Title</label>
                    <select className="form-control" value={this.state[`childTitle-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `childTitle-${i+1}`)}>
                      <option value="MR">Mr</option>
                      <option value="MRS">Mrs</option>
                    </select>
                  </div>
                  </div>
                  <div className="clear"></div>
                  <div className="col-md-12">
                  <div className="form-group dob contact-form">
                    <label>Day of Birth</label>
                    <div className="row">
                      <div className="col-md-4">
                      <select className="form-control" value={this.state[`childDayDob-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `childDayDob-${i+1}`)}>
                        {dayDob.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                      <div className="col-md-4">
                      <select className="form-control" value={this.state[`childMonthDob-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `childMonthDob-${i+1}`)}>
                        {monthDob.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                      <div className="col-md-4">
                      <select className="form-control"  value={this.state[`childYearDob-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `childYearDob-${i+1}`)}>
                        {yearDob.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                    </div>
                  </div>
                  </div>

                  {this.props.international &&
                  <div className="col-md-4">
                    <div className="form-group contact-form">
                    <label>Passport Number<span style={{color:'red'}}>*</span></label>
                    <input type="text" className="form-control" 
                    value={this.state[`passportNumberChild-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `passportNumberChild-${i+1}`)}
                    placeholder="Passport Number" />
                    <span style={{color: "red"}}>{this.state.errors[`passportNumberChild-${i+1}`]}</span>
                    <p></p>
                    </div>
                  </div>
                  }
                  <div className="clear"></div>
                  {this.props.international &&
                  <div className="col-md-12">
                  <div className="form-group dob contact-form">
                    <label>Passport Expiry Date<span style={{color:'red'}}>*</span></label>
                    <div className="row">
                      <div className="col-md-4">
                      <select className="form-control" value={this.state[`passportDayExpiryDateChild-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `passportDayExpiryDateChild-${i+1}`)}>
                        {dayDob.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                      <div className="col-md-4">
                      <select className="form-control" value={this.state[`passportMonthExpiryDateChild-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `passportMonthExpiryDateChild-${i+1}`)}>
                        {monthDob.map((item, index) => (  
                          <option value={(index < 9) ? `0${index+1}` : index + 1}>{item}</option>
                        ))}
                      </select>
                      </div>
                      <div className="col-md-4">
                      <select className="form-control"  value={this.state[`passportYearExpiryDateChild-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `passportYearExpiryDateChild-${i+1}`)}>
                        {yearExp.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                    </div>

                      <p></p>
                  </div>
                  </div>
                  }
                  <div className="clear"></div>
                  {this.props.international &&
                  <div className="col-md-4">
                  <div className="form-group contact-form">
                    <label>Nationality <span style={{color:'red'}}>*</span></label>
                    <select className="form-control" value={this.state[`nationalityAdult-${i+1}`]} 
                    onChange={this.handleChangeInput.bind(this, `nationalityAdult-${i+1}`)}>
                      <option value="ID" selected>Indonesia</option>
                    </select>
                    <p></p>
                  </div>
                  </div>
                  }
                  </div>
                </div>
                ))}


                {parseInt(infantCount) > 0 && [...Array(parseInt(infantCount))].map((x, i) => (
                <div className="book-form" key={i}>
                  <br/>
                  <h4>Infant {i+1}</h4>
                  <div className="row">
                  <div className="col-md-6">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" className="form-control" 
                    value={this.state[`infantFirstName-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `infantFirstName-${i+1}`)}
                    placeholder="First name" />
                    <span style={{color: "red"}}>{this.state.errors[`infantFirstName-${i+1}`]}</span>
                  </div>
                  </div>
                  {/*<div className="col-md-6">
                  <div className="form-group">
                    <label>Middle Name</label>
                    <input type="text" className="form-control" 
                    value={this.state[`infantMiddleName-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `infantMiddleName-${i+1}`)}
                    placeholder="Middle name" />
                  </div>
                  </div>*/}
                  <div className="col-md-6">
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" className="form-control" 
                    value={this.state[`infantLastName-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `infantLastName-${i+1}`)}
                    placeholder="Last name" />
                    <span style={{color: "red"}}>{this.state.errors[`infantLastName-${i+1}`]}</span>
                  </div>
                  </div>
                  <div className="clear"></div>
                  <div className="col-md-4">
                  <div className="form-group contact-form">
                    <label>Title</label>
                    <select className="form-control" value={this.state[`infantTitle-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `infantTitle-${i+1}`)}>
                      <option value="MR">Mr</option>
                      <option value="MRS">Mrs</option>
                    </select>
                  </div>
                  </div>
                  <div className="clear"></div>
                  <div className="col-md-12">
                  <div className="form-group dob contact-form">
                    <label>Day of Birth</label>
                    <div className="row">
                      <div className="col-md-4">
                      <select className="form-control" value={this.state[`infantDayDob-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `infantDayDob-${i+1}`)}>
                        {dayDob.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                      <div className="col-md-4">
                      <select className="form-control" value={this.state[`infantMonthDob-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `infantMonthDob-${i+1}`)}>
                        {monthDob.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                      <div className="col-md-4">
                      <select className="form-control"  value={this.state[`infantYearDob-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `infantYearDob-${i+1}`)}>
                        {yearDob.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                    </div>
                  </div>
                  </div>

                  {this.props.international &&
                  <div className="col-md-4">
                    <div className="form-group contact-form">
                    <label>Passport Number<span style={{color:'red'}}>*</span></label>
                    <input type="text" className="form-control" 
                    value={this.state[`passportNumberInfant-${i+1}`] || ''} 
                    onChange={this.handleChangeInput.bind(this, `passportNumberInfant-${i+1}`)}
                    placeholder="Passport Number" />
                    <span style={{color: "red"}}>{this.state.errors[`passportNumberInfant-${i+1}`]}</span>
                    <p></p>
                    </div>
                  </div>
                  }
                  <div className="clear"></div>
                  {this.props.international &&
                  <div className="col-md-12">
                  <div className="form-group dob contact-form">
                    <label>Passport Expiry Date<span style={{color:'red'}}>*</span></label>
                    <div className="row">
                      <div className="col-md-4">
                      <select className="form-control" value={this.state[`passportDayExpiryDateInfant-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `passportDayExpiryDateInfant-${i+1}`)}>
                        {dayDob.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                      <div className="col-md-4">
                      <select className="form-control" value={this.state[`passportMonthExpiryDateInfant-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `passportMonthExpiryDateInfant-${i+1}`)}>
                        {monthDob.map((item, index) => (  
                          <option value={(index < 9) ? `0${index+1}` : index + 1}>{item}</option>
                        ))}
                      </select>
                      </div>
                      <div className="col-md-4">
                      <select className="form-control"  value={this.state[`passportYearExpiryDateInfant-${i+1}`] || ''}
                      onChange={this.handleChangeInput.bind(this, `passportYearExpiryDateInfant-${i+1}`)}>
                        {yearExp.map((item, index) => (  
                          <option>{item}</option>
                        ))}
                      </select>
                      </div>
                    </div>

                      <p></p>
                  </div>
                  </div>
                  }
                  <div className="clear"></div>
                  {this.props.international &&
                  <div className="col-md-4">
                  <div className="form-group contact-form">
                    <label>Nationality <span style={{color:'red'}}>*</span></label>
                    <select className="form-control" value={this.state[`nationalityInfant-${i+1}`]} 
                    onChange={this.handleChangeInput.bind(this, `nationalityInfant-${i+1}`)}>
                      <option value="ID" selected>Indonesia</option>
                    </select>
                    <p></p>
                  </div>
                  </div>
                  }
                  </div>
                </div>
                ))}
                  <br/>
                  <button type="button" onClick={this.handleBooking} className="btn btn-choose pull-right hidden-xs">Continue To Payment</button>
                  <div className="clear"></div>
              </div>

              <div className="col-md-4">
                {this.props.twoway &&
                    <div className="book-form price-detail-box" style={{marginBottom:'20px'}}>
                    <div className="total-top">
                      <h3>Rp {formatRp(totalAdultFare + totalChildFare + totalInfantFare + totalAdultFare2 + totalChildFare2 + totalInfantFare2)}</h3>
                      <span style={{fontSize:'12px'}}>Grand Total</span>
                    </div>
                    </div>
                }
                <div className="book-form price-detail-box" style={{marginBottom:'20px'}}>
                 <div className="total-top">
                  <h3>Rp {formatRp(totalAdultFare + totalChildFare + totalInfantFare)}</h3>
                  <span style={{fontSize:'12px'}}>Summary Pergi</span>
                </div>
                  <div className="book-form pd-box">
                    {this.props.adultCount > 0 &&
                    <p>Adult Basic Fare ({this.props.adultCount}x): <span className="pull-right">Rp {formatRp(totalAdultFare - (parseInt(this.props.adultCount) * (tax + vat)))}</span></p>
                    }
                    {this.props.childCount > 0 &&
                    <p>Child Basic Fare ({this.props.childCount}x): <span className="pull-right">Rp {formatRp(totalChildFare - (parseInt(this.props.childCount) * (tax + vat)))}</span></p>
                    }
                    {this.props.infantCount > 0 &&
                    <p>Infant Basic Fare ({this.props.infantCount}x): <span className="pull-right">Rp {formatRp(totalInfantFare)}</span></p>
                    }
                    <p>VAT: <span className="pull-right">Rp {formatRp((parseInt(this.props.adultCount) + parseInt(this.props.childCount)) * vat)}</span></p>
                    <p>Pax Service Charge (PSC): <span className="pull-right">Rp {formatRp((parseInt(this.props.adultCount) + parseInt(this.props.childCount)) * tax)}</span></p>
                  </div>
                  <div className="total-bot">
                    <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(totalAdultFare + totalChildFare + totalInfantFare)}</span></p>
                  </div>
                </div>
                {this.props.twoway &&
                <div className="book-form price-detail-box">
                 <div className="total-top">
                  <h3>Rp {formatRp(totalAdultFare2 + totalChildFare2 + totalInfantFare2)}</h3>
                  <span style={{fontSize:'12px'}}>Summary Pulang</span>
                </div>
                  <div className="book-form pd-box">
                    {this.props.adultCount > 0 &&
                    <p>Adult Basic Fare ({this.props.adultCount}x): <span className="pull-right">Rp {formatRp(totalAdultFare2 - (parseInt(this.props.adultCount) * (tax2 + vat2)))}</span></p>
                    }
                    {this.props.childCount > 0 &&
                    <p>Child Basic Fare ({this.props.childCount}x): <span className="pull-right">Rp {formatRp(totalChildFare2 - (parseInt(this.props.childCount) * (tax2 + vat2)))}</span></p>
                    }
                    {this.props.infantCount > 0 &&
                    <p>Infant Basic Fare ({this.props.infantCount}x): <span className="pull-right">Rp {formatRp(totalInfantFare2)}</span></p>
                    }
                    <p>VAT: <span className="pull-right">Rp {formatRp((parseInt(this.props.adultCount) + parseInt(this.props.childCount)) * vat2)}</span></p>
                    <p>Pax Service Charge (PSC): <span className="pull-right">Rp {formatRp((parseInt(this.props.adultCount) + parseInt(this.props.childCount)) * tax2)}</span></p>
                  </div>
                  <div className="total-bot">
                    <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(totalAdultFare2 + totalChildFare2 + totalInfantFare2)}</span></p>
                  </div>
                </div>
                }
                <button type="button" onClick={this.handleBooking} className="btn btn-choose pull-right visible-xs change-btn-fl">Continue To Payment</button>
              </div>
              <div className="modal-loading" >
              <Modal open={this.state.open2} onClose={this.onCloseModal2} little showCloseIcon={false}>
                <img src="/img/iconmodal.png" width="85" />
                <p>{this.state.errorMsg}</p>
                <button className="btn btn-choose" style={{float:'none',display:'block',margin:'auto'}}
                onClick={this.onCloseModal2}>Ok</button>
              </Modal>
            </div>
              <ModalPopup open={this.state.open} 
              onCloseModal={() => {console.log('')}} 
              onOpenModal={this.onOpenModal}/>
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
  international: state.searchFlight.international,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setSelectedFlight,
  postBookFlight
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FlightBooking)
