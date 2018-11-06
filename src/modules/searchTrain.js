import queryString from 'query-string';
import { APIBaseURL, sessionId } from '../config.js';
import { history } from '../store';
import axios from 'axios';
export const START_SEARCH_TRAIN = 'searchTrain/START_SEARCH_TRAIN';
export const GET_SEARCH_TRAIN = 'searchTrain/GET_SEARCH_TRAIN';
export const GET_TRAIN_SUCCESS = 'searchTrain/GET_TRAIN_SUCCESS';
export const POST_DATA_SEARCH_TRAIN = 'searchTrain/POST_DATA_SEARCH_TRAIN';
export const POST_SEAT_INFO = 'searchTrain/POST_SEAT_INFO';
export const POST_SEARCH_TRAIN = 'searchTrain/POST_SEARCH_TRAIN';

const initialState = {
  origin: '',
  trains: [],
  payloadSearchTrain:{},
  seatInfo: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case START_SEARCH_TRAIN:
      return {
        ...state,
      }
    case GET_SEARCH_TRAIN:
      return {
        ...state,
      }
    case POST_SEARCH_TRAIN:
      return {
        ...state,
        payloadSearchTrain: action.data
      }
    case GET_TRAIN_SUCCESS:
      return {
        ...state,
        trains: action.data,
      }
    default:
      return state
  }
}

export const startSearchTrain = (payload) => {
  return function action(dispatch) {
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/BookingService.svc/GetAirAvailability`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload
    }

    axios(fetchLoad)
    .then(function (response) {
      console.log(response)
        dispatch({ type: START_SEARCH_TRAIN, data:response.data })
    })
    // .catch(function (error) {
    //   console.log(error);
    // });
  }
}

export const getSearchTrain = (payload) => {
  return function action(dispatch) {

    //const request = axios();
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/BookingService.svc/GetTrainStations`,
      crossdomain: true,
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
        console.log('trrr',response)
        dispatch({ type: GET_TRAIN_SUCCESS, data: response.data.stations })
      })
      .catch(function (error) {
        
        console.log(error);
      });
  }
}

export const postSearchTrain = (payload) => {
  return function action(dispatch) {
    dispatch({ type: POST_SEARCH_TRAIN, data:payload })
  }
}

export const getSeatMap = (payload) => {
  return function action(dispatch) {
    //console.log(payload)
    //const request = axios();
    //dispatch({ type: START_SEARCH_TRAIN })
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/BookingService.svc/GetSeatMap`,
      crossdomain: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      //withCredentials: true,
      data: {
        "origin": null,
        "destination": null,
        "carrierCode": null,
        "carrierno": null,
        "departureDate": null,
        "organizationId": null,
        "journeySellKey": payload.transactionId,
        "sessionId": payload.sessionId,
        "platform": null,
        "appVersion": null
      },
    }
    console.log('fetchLoad',fetchLoad)
    return new Promise((resolve, reject) => {
    axios(fetchLoad)
      .then(function (response) {
        resolve(response)
        console.log('getSeatMap', response)
        //dispatch({ type: GET_TRAIN_SUCCESS, data: response.data.stations })
      })
      .catch(function (error) {
        reject(error)
        //console.log(error);
      });
    })
  }
}

export const postManualSeat = (payload) => {
  return function action(dispatch) {
    //console.log(payload)
    //const request = axios();
    //dispatch({ type: START_SEARCH_TRAIN })
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/BookingService.svc/ManualSeat`,
      crossdomain: true,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      //withCredentials: true,
      data: payload,
    }

    return new Promise((resolve, reject) => {
    axios(fetchLoad)
      .then(function (response) {
        console.log(response)
        resolve(response)
        //dispatch({ type: GET_TRAIN_SUCCESS, data: response.data.stations })
      })
      .catch(function (error) {
        reject(error)
        //console.log(error);
      });
    });
  }
}



