import React from 'react';
import { Route } from 'react-router-dom';
import Home from '../home';
import About from '../about';
import Faq from '../about/faq';
import Privacy from '../about/privacy';
import TermOfUse from '../about/termofuse';
import ContactUs from '../about/contactus';
import HotelSearch from '../hotelSearch';
import HotelDetail from '../hotelDetail';
import HotelBooking from '../hotelBooking';
import HotelReview from '../hotelReview';
import HotelPayment from '../hotelPayment';
import FlightSearch from '../flightSearch';
import FlightPreBooking from '../flightBooking/flightPreBooking';
import FlightBooking from '../flightBooking';
import FlightPayment from '../flightPayment/snap';
import TrainSearch from '../trainSearch';
import TrainPreBooking from '../trainBooking/trainPreBooking';
import TrainBooking from '../trainBooking';
import TrainPayment from '../trainPayment';
import ChangeSeat from '../trainPayment/changeSeat';
import ChangeSeat2 from '../trainPayment/changeSeat2';
import ThankYouPage from '../thankyouPage';
import ThankYouHotelPage from '../thankyouPage/hotel';
import RetreiveBooking from '../retreiveBooking';
import RetreiveBookingFlight from '../retreiveBooking/flight';
import RetreiveBookingHotel from '../retreiveBooking/hotel';
import Header from '../../components/layout/header';
import Footer from '../../components/layout/footer';
import Register from '../register';
import TransactionHistory from '../myAccount/transactionHistory';
import { LocalizeProvider } from "react-localize-redux";
import 'react-select/dist/react-select.css';
import 'react-dates/lib/css/_datepicker.css';
import 'react-dates/initialize';
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";
import 'react-tippy/dist/tippy.css';
import 'react-input-range/lib/css/index.css';


const App = () => (
  <div>
    <LocalizeProvider>
    <Header/>
    <main className="main-content">
      <Route exact path="/" component={Home} />
      <Route exact path="/hotel/search" component={HotelSearch} />
      <Route exact path="/hotel/booking" component={HotelBooking} />
      <Route exact path="/hotel/review" component={HotelReview} />
      <Route exact path="/thankyou/:id/:phone?" component={ThankYouPage} />
      <Route exact path="/hotel/thankyou/:id/:phone?" component={ThankYouHotelPage} />
      <Route exact path="/hotel/detail/:city/:id" component={HotelDetail} />
      <Route exact path="/hotel/payment/:id" component={HotelPayment} />
      <Route exact path="/flight/search" component={FlightSearch} />
      <Route exact path="/flight/prebooking/:id?/:id2?" component={FlightPreBooking} />
      <Route exact path="/flight/booking/:id?/:id2?" component={FlightBooking} />
      <Route exact path="/flight/payment/:id?" component={FlightPayment} />
      <Route exact path="/kereta-api/search" component={TrainSearch} />
      <Route exact path="/kereta-api/changeseat" component={ChangeSeat} />
      <Route exact path="/kereta-api/changeseat2" component={ChangeSeat2} />
      <Route exact path="/kereta-api/prebooking/:id?/:id2?" component={TrainPreBooking} />
      <Route exact path="/kereta-api/booking/:id?/:id2?" component={TrainBooking} />
      <Route exact path="/kereta-api/payment/:id?" component={TrainPayment} />
      <Route exact path="/retrieve/booking" component={RetreiveBooking} />
      <Route exact path="/booking/flight/:id/:phone?" component={RetreiveBookingFlight} />
      <Route exact path="/booking/hotel/:id/:phone?" component={RetreiveBookingHotel} />
      <Route exact path="/about-us" component={About} />
      <Route exact path="/public/faq" component={Faq} />
      <Route exact path="/public/privacypolicy" component={Privacy} />
      <Route exact path="/public/termofuse" component={TermOfUse} />
      <Route exact path="/public/contactus" component={ContactUs} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/myaccount/transaction-history" component={TransactionHistory} />
    </main>
    <Footer/>
    </LocalizeProvider>
  </div>
)

export default App
