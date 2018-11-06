import { APIBaseURL, sessionId } from '../config.js';
import axios from 'axios';
import update from 'immutability-helper';
export const LOGIN_REQUESTED = 'auth/LOGIN_REQUESTED'

const initialState = {
  token:'',
  isAuth: true,
  transactionData:[{
    id:'123',
    bookingCode:'2E2323',
    date:'12-10-12',
    pax:'E3232'
  }],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_REQUESTED:
      return {
        ...state,
        isAuth: false
      }
    default:
      return state
  }
}

export const getTransactionHistory = (payload) => {
  return dispatch => {

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

