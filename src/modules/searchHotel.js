import axios from 'axios';
import { APIBaseURL, destinationList, hotelDetail, hotelReview, hotelSummary } from '../config.js';
import { hotelList } from '../data.js'
export const START_SEARCH_HOTEL = 'searchHotel/START_SEARCH_HOTEL';
export const GET_SEARCH_HOTEL = 'searchHotel/GET_SEARCH_HOTEL';
export const GET_DESTINATION_LIST = 'searchHotel/GET_DESTINATION_LIST';
export const SET_DESTINATION = 'searchHotel/SET_DESTINATION';
export const GET_DESTINATION_LIST_SUCCESS = 'searchHotel/GET_DESTINATION_LIST_SUCCESS';
export const GET_HOTEL_LIST = 'searchHotel/GET_HOTEL_LIST';
export const GET_HOTEL_DETAIL = 'searchHotel/GET_HOTEL_DETAIL';
export const GET_HOTEL_DETAIL_SUCCESS = 'searchHotel/GET_HOTEL_DETAIL_SUCCESS';
export const GET_HOTEL_LIST_SUCCESS = 'searchHotel/GET_HOTEL_LIST_SUCCESS';
export const GET_PRICE_CHANGED_SUCCESS = 'searchHotel/GET_PRICE_CHANGED_SUCCESS';
export const POST_BOOK_HOTEL = 'searchHotel/POST_BOOK_HOTEL';
export const BOOKING_HOTEL = 'searchHotel/BOOKING_HOTEL';
//export const BOOKING_HOTEL_SUCCESS = 'searchHotel/BOOKING_HOTEL_SUCCESS';
export const SAVE_BOOKING_HOTEL_SUCCESS = 'searchHotel/SAVE_BOOKING_HOTEL_SUCCESS';
export const GET_BOOKING_SUCCESS = 'searchHotel/GET_BOOKING_SUCCESS';
export const GET_HOTEL_LIST_HOME_SUCCESS = 'searchHotel/GET_HOTEL_LIST_HOME_SUCCESS';
export const SELECT_CITY = 'searchHotel/SELECT_CITY';
export const SAVE_BOOKING_DATA = 'searchHotel/SAVE_BOOKING_DATA';
export const RETREIVE_BOOKING_HOTEL_SUCCESS = 'searchHotel/RETREIVE_BOOKING_HOTEL_SUCCESS';

const initialState = {
  transactionNo: '',
  endDate: '',
  startDate: '',
  guest: 0,
  room: 0,
  destination: '',
  destinationList: [],
  hotelList: {
    hotels:[]
  },
  hotelListHome: {
    hotels:[]
  },
  hotelBookings: {},
  hotelDetail: {
    hotel:{
      hotelName: '',
      rating: 0,
      roomsCategory: [{
        netPrice: '',
        roomImage: ['']
      }]
    }
  },
  bookingData: {},
  hotelReview: hotelReview,
  hotelSummary: {
    customer:{},
    hotelBookingInfo: {
      roomInfo:{
        roomList:[],
        additionalFees:[{
          
        }]
      }
    }
  },
  selectedCity: {
    countryCode: '',
    cityCode: '',
    cityName: '',
  },
  hotelBook: {
    checkIn: '',
    checkOut: '',
    duration: '',
    noOfRoom: '',
    room: '',
    guest: '',
  },

}

export default (state = initialState, action) => {
  switch (action.type) {
    case START_SEARCH_HOTEL:
      return {
        ...state,
      }
    case GET_SEARCH_HOTEL:
      return {
        ...state,
      }
    case SELECT_CITY:
      return {
        ...state,
        selectedCity: {
          countryCode: action.data.countryCode,
          cityCode: action.data.cityCode,
          cityName: action.data.cityName,
        }
      }
    case GET_DESTINATION_LIST:
      return {
        ...state,
        destinationList: action.data
      }
    case SAVE_BOOKING_DATA:
      return {
        ...state,
        bookingData: action.data
      }
    case GET_DESTINATION_LIST_SUCCESS:
      return {
        ...state,
        destinationList: action.data.CityList
      }
    case GET_HOTEL_LIST:
      return {
        ...state,
        hotelList: {
          hotels: []
        }
      }
    case GET_BOOKING_SUCCESS:
      return {
        ...state,
        hotelSummary: action.data,
      }
    case RETREIVE_BOOKING_HOTEL_SUCCESS:
      return {
        ...state,
        hotelBookings: action.data,
        hotelSummary: action.data.hotelBookings[0]
      }
    case GET_HOTEL_LIST_SUCCESS:
      return {
        ...state,
        hotelList: action.data
      }
    case SET_DESTINATION:
      return {
        ...state,
        destination: action.data
      }
    case GET_HOTEL_LIST_HOME_SUCCESS:
      return {
        ...state,
        hotelListHome: action.data
      }
    case GET_HOTEL_DETAIL:
      return {
        ...state,
        hotelDetail: {
          hotel:{
            hotelName: '',
            rating: 0,
            roomsCategory: [{
              netPrice: '',
              roomImage: ['']
            }]
          }
        } 
      }
    case GET_HOTEL_DETAIL_SUCCESS:
      return {
        ...state,
        hotelDetail: action.data
      }
    case SAVE_BOOKING_HOTEL_SUCCESS:
      return {
        ...state,
        transactionNo: action.data.transactionNo
      }
    case POST_BOOK_HOTEL:
      return {
        ...state,
        hotelBook: {
          checkIn: action.data.checkIn,
          checkOut: action.data.checkOut,
          duration: action.data.duration,
          noOfRoom: action.data.noOfRoom,
          room: action.data.room,
          guest: action.data.guest,
        }
      }
    default:
      return state
  }
}

export const startSearchHotel = (payload) => {
  return dispatch => {
    dispatch({
      type: START_SEARCH_HOTEL
    })
  }
}

export const getSearchHotel = (payload) => {
  return dispatch => {
    dispatch({
      type: GET_SEARCH_HOTEL
    })
  }
}

export const postBookHotel = (payload) => {
  console.log(payload)
  return dispatch => {
    dispatch({
      type: POST_BOOK_HOTEL,
      data: payload
    })
  }
}

export const getDestinationsListSuccess = (response) => {
  console.log(response)
  return dispatch => {
    dispatch({
      type: GET_DESTINATION_LIST_SUCCESS,
      data: response
    })
  }
}

export const getHotelListSuccess = (response) => {
  console.log(response)
  return dispatch => {
    dispatch({
      type: GET_HOTEL_LIST_SUCCESS,
      data: response
    })
  }
}

export const selectCity = (response) => {
  //console.log(response)
  return dispatch => {
    dispatch({
      type: SELECT_CITY,
      data: response
    })
  }
}

export const saveBookingData = (response) => {
  console.log(response)
  return dispatch => {
    dispatch({
      type: SAVE_BOOKING_DATA,
      data: response
    })
  }
}

export const setDestination = (val) => {
  return dispatch => {
    dispatch({
      type: SET_DESTINATION,
      data: val
    })
  }
}

export function getDestinationsList(payload) {
  return function action(dispatch) {
    //const request = axios();
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/HotelService.svc/destination/list`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    }

    axios(fetchLoad)
      .then(function (response) {
        dispatch({ type: GET_DESTINATION_LIST_SUCCESS, data: response.data })
      })
      .catch(function (error) {
        //dispatch(getAirportsError(error))
        console.log(error);
      });
  }
}

export function getHotelDetail(payload) {
  return function action(dispatch) {
    //const request = axios();
    dispatch({ type: GET_HOTEL_DETAIL })
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/HotelService.svc/hotel/detail`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    }

    return new Promise((resolve, reject) => { 
    axios(fetchLoad)
      .then(function (response) {
        if (response.data.Status.Type === 'ERROR'){
          resolve(response.data.Status)
        } else {
          dispatch({ type: GET_HOTEL_DETAIL_SUCCESS, data: response.data })
        }
        
      })
      .catch(function (error) {
        //dispatch(getAirportsError(error))
        console.log(error);
      });
    });
  }
}

export function getHotelBooking(payload) {
  return function action(dispatch) {
    //dispatch({ type: GET_DESTINATION_LIST })

    //const request = axios();
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/HotelService.svc/hotel/getbooking`,
      headers: {
        'Content-Type': 'application/json',
      },
      //withCredentials: true,
      data: payload,
    }

    return new Promise((resolve, reject) => { 
      axios(fetchLoad)
      .then(function (response) {
        if (response.data.Status.Type === 'ERROR') {
          reject(response.data.Status.Message)
        } else {
          dispatch({ type: GET_BOOKING_SUCCESS, data: response.data })
          resolve(response.data);
        }
      })
      .catch(function (error) {
        reject(error)
        console.log(error);
      });
    })
  }
}

export function getPriceChanged(payload) {
  return function action(dispatch) {
    //dispatch({ type: GET_DESTINATION_LIST })

    //const request = axios();
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/HotelService.svc/hotel/pricecheck`,
      headers: {
        'Content-Type': 'application/json',
      },
      //withCredentials: true,
      data: payload,
    }

    return new Promise((resolve, reject) => { 
      axios(fetchLoad)
      .then(function (response) {
        console.log('pc',response.data)
        if (response.data.Status.Type === "ERROR") {
          reject(response.data.Status.Message)
        } else {
          dispatch({ type: GET_PRICE_CHANGED_SUCCESS, data: response.data })
          resolve(response.data);
        }
      })
      .catch(function (error) {
        reject(error)
        console.log(error);
      });
    })
  }
}

// export function postBookingHotel(data) {
//   return function action(dispatch) {
//     //dispatch({ type: BOOKING_HOTEL })

//     //const request = axios();
    
//     let fetchLoad = {
//       method: 'post',
//       baseURL: APIBaseURL,
//       url: `/HotelService.svc/hotel/booking`,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       //withCredentials: true,
//       data: data,
//     }

//     return new Promise((resolve, reject) => { 
//       axios(fetchLoad)
//       .then(function (response) {
//         dispatch({ type: BOOKING_HOTEL_SUCCESS, data: response })
//         resolve(response);
//       })
//       .catch(function (error) {
//         reject(error)
//         console.log(error);
//       });
//     })
//   }
// }

export function saveBookingHotel(data) {
  return function action(dispatch) {
    //dispatch({ type: BOOKING_HOTEL })

    //const request = axios();
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/HotelService.svc/hotel/saveBooking`,
      headers: {
        'Content-Type': 'application/json',
      },
      //withCredentials: true,
      data: data,
    }

    return new Promise((resolve, reject) => { 
      axios(fetchLoad)
      .then(function (response) {
        console.log('saveBooking', response)
        if (response.data.Status.Type === "ERROR") {
          reject(response.data.Status.Message)
        } else {
          dispatch({ type: SAVE_BOOKING_HOTEL_SUCCESS, data: response.data })
          resolve(response);
        }
        
      })
      .catch(function (error) {
        reject(error)
        console.log(error);
      });
    })
  }
}

export function getHotelList(payload) {
  return function action(dispatch) {
    
    dispatch({ type: GET_HOTEL_LIST })
    //const request = axios();
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/HotelService.svc/hotel/list`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    }

    return new Promise((resolve, reject) => { 
    axios(fetchLoad)
      .then(function (response) {
        resolve(response.data)
        dispatch({ type: GET_HOTEL_LIST_SUCCESS, data: response.data })
      })
      .catch(function (error) {
        //dispatch(getAirportsError(error))
        console.log(error);
      });
    })
  }
}

export function getHotelListHome(payload) {
  return function action(dispatch) {
    
    dispatch({ type: GET_HOTEL_LIST })
    //const request = axios();
    
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/HotelService.svc/hotel/list`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: payload,
    }

    return new Promise((resolve, reject) => { 
    axios(fetchLoad)
      .then(function (response) {
        resolve(response.data)
        dispatch({ type: GET_HOTEL_LIST_HOME_SUCCESS, data: response.data })
      })
      .catch(function (error) {
        //dispatch(getAirportsError(error))
        console.log(error);
      });
    })
  }
}

export function retreiveBookingHotel (payload) {
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
          dispatch({ type: RETREIVE_BOOKING_HOTEL_SUCCESS, data: response.data })
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


