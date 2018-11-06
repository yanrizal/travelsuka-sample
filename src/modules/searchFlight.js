import { APIBaseURL, flightSchedule, airportDummy, sessionId } from '../config.js';
import axios from 'axios';
import update from 'immutability-helper';
export const START_SEARCH_FLIGHT = 'searchFlight/START_SEARCH_FLIGHT';
export const SET_SELECTED_FLIGHT = 'searchFlight/SET_SELECTED_FLIGHT';
export const SET_SELECTED_FLIGHT2 = 'searchFlight/SET_SELECTED_FLIGHT2';
export const GET_SEARCH_FLIGHT_FIRST_SUCCESS = 'searchFlight/GET_SEARCH_FLIGHT_FIRST_SUCCESS';
export const GET_SEARCH_FLIGHT_FIRST_TWOWAY_SUCCESS = 'searchFlight/GET_SEARCH_FLIGHT_FIRST_TWOWAY_SUCCESS';
export const GET_SEARCH_FLIGHT_SECOND_SUCCESS = 'searchFlight/GET_SEARCH_FLIGHT_SECOND_SUCCESS';
export const GET_SEARCH_FLIGHT_SECOND_TWOWAY_SUCCESS = 'searchFlight/GET_SEARCH_FLIGHT_SECOND_TWOWAY_SUCCESS';
export const GET_AIRPORTS = 'searchFlight/GET_AIRPORTS';
export const GET_AIRPORTS_SUCCESS = 'searchFlight/GET_AIRPORTS_SUCCESS';
export const GET_AIRPORTS_ERROR = 'searchFlight/GET_AIRPORTS_ERROR';
export const POST_BOOK_FLIGHT = 'searchFlight/POST_BOOK_FLIGHT';
export const ADD_LOADING = 'searchFlight/ADD_LOADING';
export const POST_BOOK_FLIGHT_SUCCESS = 'searchFlight/POST_BOOK_FLIGHT_SUCCESS';
export const SORT_FLIGHT = 'searchFlight/SORT_FLIGHT';
export const RETREIVE_BOOK_SUCCESS = 'searchFlight/RETREIVE_BOOK_SUCCESS';
export const SET_INTERNATIONAL = 'searchFlight/SET_INTERNATIONAL';
export const SET_INTERNATIONAL_DEFAULT = 'searchFlight/SET_INTERNATIONAL_DEFAULT';
export const GSA_SUCCESS = 'searchFlight/GSA_SUCCESS';

let firstFetch = true;

const initialState = {
  from: '',
  airAvailability: [],
  gsaData: [],
  airlanesSchedule: [{
    departureAirport:{},
    arrivalAirport:{},
    flightJourneys:[]
  },{
    departureAirport:{},
    arrivalAirport:{},
    flightJourneys:[]
  }],
  loadingFlight: 10,
  loadingInc: 0,
  sameFlight: false,
  departureAirportName: '',
  arrivalAirportName: '',
  selectedFlight: {
    departureAirport:{},
    arrivalAirport:{},
    flightSegments: [
    {
      "airline": {
        "code": "JT",
        "name": "Lion Air"
      },
      "segmentSellKey": "JT~~ ~~TKG~01/07/2017 06:30~CGK~01/07/2017 07:20~",
      "departureAirport": {
        "code": "TKG",
        "name": "Radin Inten II (Branti), Bandar Lampung",
        "cityCode": null,
        "city": "TKG",
        "countryCode": null,
        "timezone": "7",
        "latitude": -5.242339,
        "longitude": 105.178939
      },
      "arrivalAirport": {
        "code": "CGK",
        "name": "Soekarno Hatta Intl, Jakarta",
        "cityCode": null,
        "city": "CGK",
        "countryCode": null,
        "timezone": "7",
        "latitude": -6.125567,
        "longitude": 106.655897
      },
      "std": "2017-01-07T06:30:00",
      "sta": "2017-01-07T07:20:00",
      "duration": {
        "hours": 0,
        "minutes": 50,
        "seconds": 0
      },
      "flightDesignator": {
        "carrierCode": "JT",
        "flightNumber": "390"
      },
      "aircraftCode": "",
      "includedBaggage": 20,
      "includedMeal": 0,
      "fares": [
        {
          "classOfService": "MV",
          "availableCount": 6,
          "fareSellKey": "M0_C0_F0_S14",
          "basicFare": 671000,
          "basicVat": 0,
          "childFare": 671000,
          "childVat": 0,
          "infantFare": 67100,
          "infantVat": 0,
          "fuelSurcharge": 0,
          "iwjr": 10000,
          "airportTax": 30000,
          "insurance": 0,
          "baggageAllowance": 0,
          "adminFee": 0,
          "otherFee": 0,
          "serviceFee": 0,
          "discount": -3000,
          "fareType": "NR",
          "currency": "IDR"
        }
      ],
      "selectedFare": null,
      "gdsCode": "",
      "id": null,
      "stopCount": 0,
      "stopLeg": null,
      "cabin": null
    },
  ],
  "stopCount": 0,
  "uid": null
  },
  selectedFlight2: {
    departureAirport:{},
    arrivalAirport:{},
    flightSegments: [
    {
      "airline": {
        "code": "JT",
        "name": "Lion Air"
      },
      "segmentSellKey": "JT~~ ~~TKG~01/07/2017 06:30~CGK~01/07/2017 07:20~",
      "departureAirport": {
        "code": "TKG",
        "name": "Radin Inten II (Branti), Bandar Lampung",
        "cityCode": null,
        "city": "TKG",
        "countryCode": null,
        "timezone": "7",
        "latitude": -5.242339,
        "longitude": 105.178939
      },
      "arrivalAirport": {
        "code": "CGK",
        "name": "Soekarno Hatta Intl, Jakarta",
        "cityCode": null,
        "city": "CGK",
        "countryCode": null,
        "timezone": "7",
        "latitude": -6.125567,
        "longitude": 106.655897
      },
      "std": "2017-01-07T06:30:00",
      "sta": "2017-01-07T07:20:00",
      "duration": {
        "hours": 0,
        "minutes": 50,
        "seconds": 0
      },
      "flightDesignator": {
        "carrierCode": "JT",
        "flightNumber": "391"
      },
      "aircraftCode": "",
      "includedBaggage": 20,
      "includedMeal": 0,
      "fares": [
        {
          "classOfService": "MV",
          "availableCount": 6,
          "fareSellKey": "M0_C0_F0_S14",
          "basicFare": 671000,
          "basicVat": 0,
          "childFare": 671000,
          "childVat": 0,
          "infantFare": 67100,
          "infantVat": 0,
          "fuelSurcharge": 0,
          "iwjr": 10000,
          "airportTax": 30000,
          "insurance": 0,
          "baggageAllowance": 0,
          "adminFee": 0,
          "otherFee": 0,
          "serviceFee": 0,
          "discount": -3000,
          "fareType": "NR",
          "currency": "IDR"
        }
      ],
      "selectedFare": null,
      "gdsCode": "",
      "id": null,
      "stopCount": 0,
      "stopLeg": null,
      "cabin": null
    },
  ],
  "stopCount": 0,
  "uid": null
  },
  bookingSummary:{
    bookingsSummary:[{
      basicFare: 0,
      totalCost: 0,
      taxAndFee: 0,
      flightJourneys: [{
        flightSegments: []
      }],
      contact:{},
      passengers:[{}],
      passengerDetails:[{
        middleName: '',
        seatInfo:[{
          
        }]
      }]
    }]
  },
  airports: [],
  to: '',
  adultCount: 1,
  childCount: 0,
  infantCount: 0,
  twoway: false,
  loadingTrains: 10,
  airlinesCode: [
    { name: 'Lion Air', code: 'JT'},
    { name: 'Garuda', code: 'GA'},
    { name: 'International', code: 'GSA'},
    { name: 'Citilink', code: 'QG'},
    { name: 'Sriwijaya', code: 'SJ'},
    { name: 'AirAsia', code: 'QZ'},
    { name: 'Trigana', code: 'IL'},
    { name: 'Tiger', code: 'TR'},
  ],
  international: true,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case START_SEARCH_FLIGHT:
      //console.log(action.payload)
      return {
        ...state,
        airlanesSchedule: [{
          departureAirport:{},
          arrivalAirport:{},
          flightJourneys:[]
        },{
          departureAirport:{},
          arrivalAirport:{},
          flightJourneys:[]
        }],
        gsaData:[],
        airAvailability: [],
        departureAirportName: '',
        arrivalAirportName: '',
        loadingFlight: 10,
        loadingTrains: 10,
        adultCount: action.payload.noOfAdt,
        childCount: action.payload.noOfChd,
        infantCount: action.payload.noOfInf,
      }
    case GET_SEARCH_FLIGHT_FIRST_SUCCESS:
      //console.log('FIRST', action.data.flightSchedules)
      //console.log('SECC', state.loadingInc)
      //console.log(action.air, action.data.flightSchedules[0].flightJourneys)
      return {
        ...state,
        // adultCount: action.data.noOfAdt,
        // childCount: action.data.noOfChd,
        // infantCount: action.data.noOfInf,
        loadingFlight: Math.round((1 / 7) * 100),
        loadingTrains: 100,
        loadingInc: state.loadingInc + 1,
        airAvailability: (action.data.flightSchedules.length !== 0) ? state.airAvailability.concat({
          code: action.data.flightSchedules[0].flightJourneys[0].flightSegments[0].airline.code, 
          name: action.data.flightSchedules[0].flightJourneys[0].flightSegments[0].airline.name
        }) : [],
        twoway: false,
        airlanesSchedule: action.data.flightSchedules,
        departureAirportName: (action.data.flightSchedules[0].departureAirport.name) ? action.data.flightSchedules[0].departureAirport.name : state.departureAirportName,
        arrivalAirportName: (action.data.flightSchedules[0].arrivalAirport.name) ? action.data.flightSchedules[0].arrivalAirport.name : state.arrivalAirportName,
      }
    case ADD_LOADING:
      //console.log('SECC', action.air, state.loadingInc)
      return {
        ...state,
        loadingFlight: Math.round((state.loadingInc / 7) * 100),
        loadingInc: state.loadingInc + 1,
        // adultCount: action.data.noOfAdt,
        // childCount: action.data.noOfChd,
        // infantCount: action.data.noOfInf,
        // loadingFlight: 100,
      }
    case GSA_SUCCESS:
      //console.log('SECC', action.air, state.loadingInc)
      return {
        ...state,
        gsaData: action.data,
        // adultCount: action.data.noOfAdt,
        // childCount: action.data.noOfChd,
        // infantCount: action.data.noOfInf,
        // loadingFlight: 100,
      }
    case SET_INTERNATIONAL:
      return {
        ...state,
        international: true,
      }
    case SET_INTERNATIONAL_DEFAULT:
      return {
        ...state,
        international: false,
      }
    case GET_SEARCH_FLIGHT_FIRST_TWOWAY_SUCCESS:
      console.log(action.air)
      return {
        ...state,
        // adultCount: action.data.noOfAdt,
        // childCount: action.data.noOfChd,
        // infantCount: action.data.noOfInf,
        loadingFlight: Math.round((1 / 7) * 100),
        loadingInc: 1 + 1,
        twoway: true,
        airAvailability: (action.data.flightSchedules.length !== 0) ? state.airAvailability.concat({
          code: action.data.flightSchedules[0].flightJourneys[0].flightSegments[0].airline.code, 
          name: action.data.flightSchedules[0].flightJourneys[0].flightSegments[0].airline.name
        }) : [],
        airlanesSchedule: (typeof action.data.flightSchedules[0] === 'undefined') ? [{
          departureAirport:{},
          arrivalAirport:{},
          flightJourneys:[]
        },{
          departureAirport:{},
          arrivalAirport:{},
          flightJourneys:[]
        }] : action.data.flightSchedules,
        departureAirportName: (action.data.flightSchedules !== null) ? action.data.flightSchedules[0].departureAirport.name : state.departureAirportName,
        arrivalAirportName: (action.data.flightSchedules !== null) ? action.data.flightSchedules[0].arrivalAirport.name : state.arrivalAirportName,
      }
    case GET_SEARCH_FLIGHT_SECOND_SUCCESS:
      //console.log(state.airlanesSchedule[0].flightJourneys)
      //console.log('SECC', state.loadingInc)
      return update(state, { 
        airlanesSchedule: { 
          0: {
            flightJourneys: {$push: action.data.flightSchedules[0].flightJourneys}
          }
        },
        airAvailability: {$push: [{
          code: action.data.flightSchedules[0].flightJourneys[0].flightSegments[0].airline.code, 
          name: action.data.flightSchedules[0].flightJourneys[0].flightSegments[0].airline.name
        }]},
        loadingInc: {$set: state.loadingInc + 1},
        loadingFlight: {$set: Math.round((state.loadingInc / 7) * 100)},
        departureAirportName: {$set: (action.data.flightSchedules[0].departureAirport.name) ? action.data.flightSchedules[0].departureAirport.name : state.departureAirportName},
        arrivalAirportName: {$set: (action.data.flightSchedules[0].arrivalAirport.name) ? action.data.flightSchedules[0].arrivalAirport.name : state.arrivalAirportName},
      });
    case GET_SEARCH_FLIGHT_SECOND_TWOWAY_SUCCESS:
      console.log(action.air, action.data.flightSchedules[0].flightJourneys)
      return update(state, { 
        airlanesSchedule: { 
          0: {
            flightJourneys: {$push: action.data.flightSchedules[0].flightJourneys}
          },
          1: {
            flightJourneys: (typeof action.data.flightSchedules[1] !== 'undefined') ? {$push: action.data.flightSchedules[1].flightJourneys} : {}
          }
        },
        airAvailability: {$push: [{
          code: action.data.flightSchedules[0].flightJourneys[0].flightSegments[0].airline.code, 
          name: action.data.flightSchedules[0].flightJourneys[0].flightSegments[0].airline.name
        }]},
        loadingInc: {$set: state.loadingInc + 1},
        loadingFlight: {$set: Math.round((state.loadingInc / 7) * 100)},
        departureAirportName: {$set: (action.data.flightSchedules[0].departureAirport.name) ? action.data.flightSchedules[0].departureAirport.name : state.departureAirportName},
        arrivalAirportName: {$set: (action.data.flightSchedules[0].arrivalAirport.name) ? action.data.flightSchedules[0].arrivalAirport.name : state.arrivalAirportName},
      });
    case GET_AIRPORTS:
      return {
        ...state,
      }
    case SORT_FLIGHT:
      return update(state, { 
        airlanesSchedule: { 
        0: {
            flightJourneys: {$set: action.data}
          }
        },
      })
    case POST_BOOK_FLIGHT_SUCCESS:
      return {
        ...state,
        bookingSummary: action.data
      }
    case RETREIVE_BOOK_SUCCESS:
      return {
        ...state,
        bookingSummary: action.data
      }
    case SET_SELECTED_FLIGHT:
      return {
        ...state,
        selectedFlight: action.data
      }
    case SET_SELECTED_FLIGHT2:
      const fl1 = state.selectedFlight.flightSegments[0].airline.code
      const fl2 = action.data.flightSegments[0].airline.code
      console.log(fl1, fl2);
      return {
        ...state,
        selectedFlight2: action.data,
        sameFlight: (fl1 == fl2) ? true : false,
      }
    case GET_AIRPORTS_SUCCESS:
      return {
        ...state,
        airports: action.data
      }
    case GET_AIRPORTS_ERROR:
      return {
        ...state,
      }
    default:
      return state
  }
}

export const startSearchFlight = (payload, index) => {
  return function action(dispatch) {
    if (index == 0) {
      firstFetch = true;
      dispatch({ type: START_SEARCH_FLIGHT, payload: payload })
    }
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/BookingService.svc/GetAirAvailability`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload
    }

    return new Promise((resolve, reject) => {
    axios(fetchLoad)
    .then(function (response) {
      //console.log('FETCH',response.data)
      if (response.data.flightSchedules !== null) {
        const arrivalCountryCode = response.data.flightSchedules[0].arrivalAirport.countryCode;
        const departureCountryCode = response.data.flightSchedules[0].departureAirport.countryCode;
        //console.log('AA', arrivalCountryCode, departureCountryCode)
        if (arrivalCountryCode == 'ID' || arrivalCountryCode == null && arrivalCountryCode === departureCountryCode){
          //local 
        } else {
          dispatch({ type: SET_INTERNATIONAL })
        }

      }
      // if (response.data.flightSchedules !== null) {
      // if (response.data.flightSchedules[0].arrivalAirport.countryCode !== null && response.data.flightSchedules[0].departureAirport.countryCode !== null) {
      //   console.log(response.data.flightSchedules[0].arrivalAirport.countryCode)
      //   if (response.data.flightSchedules[0].arrivalAirport.countryCode !== "ID" || response.data.flightSchedules[0].departureAirport.countryCode !== "ID") {
      //     dispatch({ type: SET_INTERNATIONAL })
      //   }
      // }
      // }
      let gsaData = [];
      if (payload.airlines[0].code === 'GSA' && response.data.flightSchedules !== null) {
        const result = response.data.flightSchedules[0].flightJourneys.map((x) => {
          let obj = {
            code: x.flightSegments[0].airline.code,
            name: x.flightSegments[0].airline.name,
          }
          gsaData.push(obj)
        })
        dispatch({ type: GSA_SUCCESS, data: gsaData })
        console.log('gsaData', gsaData);
      }
      if (firstFetch){
        if (response.data.flightSchedules !== null){
          dispatch({ type: GET_SEARCH_FLIGHT_FIRST_SUCCESS, data:response.data, air:payload.airlines[0].code })
          firstFetch = false
        } else {
          dispatch({ type: ADD_LOADING })
        }
      } else {
        if (response.data.flightSchedules !== null){
          dispatch({ type: GET_SEARCH_FLIGHT_SECOND_SUCCESS, data:response.data, air:payload.airlines[0].code })
          firstFetch = false
        } else {
          dispatch({ type: ADD_LOADING })
        }
        
      }
      resolve(response);
    })
  });
    // .catch(function (error) {
    //   console.log(error);
    // });
  }
}

export const startSearchFlightTwoWay = (payload, index) => {
  return function action(dispatch) {
    if (index == 0) {
      firstFetch = true;
      dispatch({ type: START_SEARCH_FLIGHT, payload: payload })
    }
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/BookingService.svc/GetAirAvailability`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload
    }

    return new Promise((resolve, reject) => {
    axios(fetchLoad)
    .then(function (response) {
      //console.log(response)

      if (response.data.flightSchedules !== null) {
        const arrivalCountryCode = response.data.flightSchedules[0].arrivalAirport.countryCode;
        const departureCountryCode = response.data.flightSchedules[0].departureAirport.countryCode;
        //console.log('AA', arrivalCountryCode, departureCountryCode)
        if (arrivalCountryCode == 'ID' || arrivalCountryCode == null && arrivalCountryCode === departureCountryCode){
          //local 
        } else {
          dispatch({ type: SET_INTERNATIONAL })
        }

      }

      let gsaData = [];
      if (payload.airlines[0].code === 'GSA' && response.data.flightSchedules !== null) {
        const result = response.data.flightSchedules[0].flightJourneys.map((x) => {
          let obj = {
            code: x.flightSegments[0].airline.code,
            name: x.flightSegments[0].airline.name,
          }
          gsaData.push(obj)
        })
        dispatch({ type: GSA_SUCCESS, data: gsaData })
        console.log('gsaData', gsaData);
      }
      if (firstFetch){
        if (response.data.flightSchedules !== null){
          dispatch({ type: GET_SEARCH_FLIGHT_FIRST_TWOWAY_SUCCESS, data:response.data, air:payload.airlines[0].code })
          firstFetch = false
        }
      } else {
        if (response.data.flightSchedules !== null){
          dispatch({ type: GET_SEARCH_FLIGHT_SECOND_TWOWAY_SUCCESS, data:response.data, air:payload.airlines[0].code })
        }
      }
      resolve(response)
    })
  })
    // .catch(function (error) {
    //   console.log(error);
    // });
  }
}

export const setSelectedFlight = (data) => {
  return dispatch => {
    dispatch({
      type: SET_SELECTED_FLIGHT,
      data: data
    })
  }
}

export const setSelectedFlight2 = (data) => {
  return dispatch => {
    dispatch({
      type: SET_SELECTED_FLIGHT2,
      data: data
    })
  }
}

// export const getSearchFlightSuccess = (payload) => {
//   return dispatch => {
//     dispatch({
//       type: GET_SEARCH_FLIGHT_SUCCESS
//     })
//   }
// }

export const sortFlight = (data) => {
  return dispatch => {
    dispatch({
      type: SORT_FLIGHT,
      data: data
    })
  }
}

export const getAirportsError = (err) => {
  return dispatch => {
    dispatch({
      type: GET_AIRPORTS_ERROR
    })
  }
}

export const getAirportsSuccess = (response) => {
  return dispatch => {
    dispatch({
      type: GET_AIRPORTS_SUCCESS,
      data: response
    })
  }
}

export function getAirports() {
  return function action(dispatch) {
    dispatch({ type: GET_AIRPORTS })

    //const request = axios();
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/BookingService.svc/GetAirports`,
      //crossdomain: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      
      //withCredentials: true,
      data: JSON.stringify({
        "sessionId": sessionId
      }),
    }

    axios(fetchLoad)
      .then(function (response) {
        dispatch({ type: SET_INTERNATIONAL_DEFAULT })
        dispatch(getAirportsSuccess(response.data.airports))
      })
      .catch(function (error) {
        dispatch(getAirportsError(error))
        console.log(error);
      });
  }
}

export function postBookFlight (payload) {
  return function action(dispatch) {
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/BookingService.svc/BookFlight`,
      headers: {
        'Content-Type': 'application/json'
      },
      //withCredentials: true,
      data: payload
    }

    return new Promise((resolve, reject) => {
    axios(fetchLoad)
      .then(function (response) {
        if (response.data.errors[0].type === 'SUCCESS') {
          dispatch({ type: POST_BOOK_FLIGHT_SUCCESS, data: response.data })
          resolve(response.data)
        } else {
          reject(response.data.errors)
        }
        
      })
      .catch(function (error) {
        reject(error)
        console.log(error);
      });
    })
  }
}

export function retreiveBookingFlight (payload) {
  return function action(dispatch) {
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/BookingService.svc/GetBooking`,
      headers: {
        'Content-Type': 'application/json'
      },
      //withCredentials: true,
      data: payload
    }

    return new Promise((resolve, reject) => {
    axios(fetchLoad)
      .then(function (response) {
        if (response.data.transactionId !== null) {
          dispatch({ type: RETREIVE_BOOK_SUCCESS, data: response.data })
          resolve(response.data)
        } else {
          reject(response.data)
        }
        
      })
      .catch(function (error) {
        reject(error)
        console.log(error);
      });
    })
  }
}


