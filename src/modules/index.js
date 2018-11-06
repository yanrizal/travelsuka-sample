import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import counter from './counter'
import searchHotel from './searchHotel'
import searchFlight from './searchFlight'
import searchTrain from './searchTrain'
import auth from './auth'
import account from './account'

export default combineReducers({
  router: routerReducer,
  counter,
  searchHotel,
  searchFlight,
  searchTrain,
  auth,
  account,
})
