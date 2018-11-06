import axios from 'axios';
import update from 'immutability-helper';
import { APIBaseURL, APIBaseURL2, APIMidtrans, veritransServerKey } from '../config';
export const LOGIN_REQUESTED = 'auth/LOGIN_REQUESTED'
export const LOGIN_REQUESTED_SUCCESS = 'auth/LOGIN_REQUESTED_SUCCESS'
export const LOGOUT_REQUESTED_SUCCESS = 'auth/LOGOUT_REQUESTED_SUCCESS'

const initialState = {
  token:'',
  isAuth: false,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUESTED:
      return {
        ...state,
        isAuth: false
      }
    case LOGIN_REQUESTED_SUCCESS:
      return {
        ...state,
        isAuth: true
      }
    case LOGOUT_REQUESTED_SUCCESS:
      return {
        ...state,
        isAuth: false
      }
    default:
      return state
  }
}

export const loginRequest = (payload) => {
  return dispatch => {
    dispatch({
      type: LOGIN_REQUESTED_SUCCESS
    })

    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/AuthenticationService.svc/Login`,
      headers: {
        'Content-Type': 'application/json'
      },
      //withCredentials: true,
      data: JSON.stringify(payload)
    }

    return new Promise((resolve, reject) => {
    axios(fetchLoad)
      .then(function (response) {
        if (response.data.errors[0].type === 'SUCCESS') {
          dispatch({ type: LOGIN_REQUESTED_SUCCESS, data: response.data })
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

export const logoutRequest = (payload) => {
  return dispatch => {
    dispatch({ type: LOGOUT_REQUESTED_SUCCESS })
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/AuthenticationService.svc/Logout`,
      headers: {
        'Content-Type': 'application/json'
      },
      //withCredentials: true,
      data: JSON.stringify(payload)
    }

    return new Promise((resolve, reject) => {
    axios(fetchLoad)
      .then(function (response) {
        if (response.data.errors[0].type === 'SUCCESS') {
          dispatch({ type: LOGOUT_REQUESTED_SUCCESS, data: response.data })
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

export function snapTokenRequest (payload) {
  return function action(dispatch) {
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL2,
      url: `/Payment/GetSnapToken`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      //withCredentials: true,
      data: payload,
    }

    return new Promise((resolve, reject) => {
    axios(fetchLoad)
      .then(function (response) {
        console.log('resp', response.data)
        if(response.data.errmsg !== "") {
          //alert(response.data.errmsg);
          reject(response.data.errmsg)
        }
        resolve(response.data.token)
        
      })
      .catch(function (error) {
        reject(error)
        console.log(error);
      });
    })
  }
}

export function saveOfflinePayment(payload) {
  return function action(dispatch) {
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL2,
      url: `/Payment/SaveOfflinePaymentAjax`,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      //withCredentials: true,
      data: payload,
    };

    return new Promise((resolve, reject) => {
    axios(fetchLoad)
      .then(function (response) {
        console.log('t', response)
        // if(response.data.errmsg !== "") {
        //   alert(response.data.errmsg);
        //   reject(response.data.errmsg);
        // }
        resolve(response);
      })
      .catch(function (error) {
        reject(error);
        console.log(error);
      });
    })
  }
}

export function addDiscount (payload) {
  return function action(dispatch) {
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/BookingService.svc/AddDiscount`,
      headers: {
        'Content-Type': 'application/json'
      },
      //withCredentials: true,
      data: payload
    }

    return new Promise((resolve, reject) => {
    axios(fetchLoad)
      .then(function (response) {
        console.log('disc', response)
        if (response.data.errors[0].code === '000'){
          resolve(response.data.errors[0]) 
        } else {
          reject(response.data.errors[0])
          //alert(response.data.errors[0].message)
        }
        
      })
      .catch(function (error) {
        reject(error)
        console.log(error);
      });
    })
  }
}

export function removeDiscount (payload) {
  return function action(dispatch) {
    let fetchLoad = {
      method: 'post',
      baseURL: APIBaseURL,
      url: `/BookingService.svc/ClearDiscount`,
      headers: {
        'Content-Type': 'application/json'
      },
      //withCredentials: true,
      data: payload
    }

    return new Promise((resolve, reject) => {
    axios(fetchLoad)
      .then(function (response) {
        console.log('disc', response)
        if (response.data.errors[0].code === '000'){
          resolve(response.data.errors[0]) 
        } else {
          reject(response.data.errors[0])
          //alert(response.data.errors[0].message)
        }
        
      })
      .catch(function (error) {
        reject(error)
        console.log(error);
      });
    })
  }
}

