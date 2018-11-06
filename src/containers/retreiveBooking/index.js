import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { retreiveBookingFlight } from '../../modules/searchFlight';
import { retreiveBookingHotel } from '../../modules/searchHotel';
import { sessionId } from '../../config';
import { history } from '../../store';

class RetreiveBooking extends React.Component {

  state = {
    seat: {
      E: 'Economy',
      B: 'Business',
      F: 'First Class'
    },
    voucher: false,
    countdown: '',
    time: 20000,
    errors: {},
    bookingId: '',
    bookingIdHotel: '',
    phoneNumber: '',
  }

  handleChangeInput = (name, e) => {
    this.setState({
      [name]: e.target.value
    })
  }

  retreiveBooking = e => {
    let errors = {}
    if (this.state.bookingId !== ''){
      history.push(`/booking/flight/${this.state.bookingId}/${this.state.phoneNumber}`)
    } else {
      errors[`bookingId`] = "Cannot be empty";
      this.setState({errors: errors})
    }
    
  }

  retreiveBookingHt = e => {
    let errors = {}
    if (this.state.bookingIdHotel !== ''){
      history.push(`/booking/hotel/${this.state.bookingIdHotel}`)
    } else {
      errors[`bookingIdHotel`] = "Cannot be empty";
      this.setState({errors: errors})
    }
  }

  render() {

    return (
      <div>
        <div className="jumbotron" style={{marginBottom:0,background:'#FFF'}}>
          <div className="top-book">
            <div className="container">
            <div className="row">
            <div className="col-md-12">
              <h1>Retrieve Booking</h1>
            </div>
            </div>
            </div>
          </div>
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="p20">
                  <div className="row" style={{margin:0}}>
                  <ul className="nav nav-pills nav-stacked col-md-4">
                    <li className="active"><a href="#tab_a" data-toggle="pill">Flight and Train</a></li>
                    <li><a href="#tab_b" data-toggle="pill">Hotel</a></li>
                  </ul>
                  <div className="tab-content col-md-8">
                    <p>Retrieve your booking easily by entering your booking details below.<br/>
                      You can also use this form to retrieve and complete a recent unfinished transaction.</p>
                      <hr/>
                    <div className="tab-pane active" id="tab_a">
                        <h4>Retrieve your flight / train booking</h4>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Booking ID</label>
                              <input type="text" className="form-control" 
                              value={this.state.bookingId} onChange={this.handleChangeInput.bind(this, 'bookingId')} />
                              <span style={{color: "red"}}>{this.state.errors["bookingId"]}</span>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Mobile Number</label>
                              <input type="text" className="form-control" 
                              value={this.state.phoneNumber} onChange={this.handleChangeInput.bind(this, 'phoneNumber')} />
                              <span style={{color: "red"}}>{this.state.errors["phoneNumber"]}</span>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <button type="button" className="btn btn-choose pull-left" onClick={this.retreiveBooking}>Retreive My Booking</button>
                          </div>
                        </div>
                        </div>
                        <div className="tab-pane" id="tab_b">
                             <h4>Retrieve your hotel booking</h4>
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>Booking ID</label>
                              <input type="text" className="form-control" 
                              value={this.state.bookingIdHotel} onChange={this.handleChangeInput.bind(this, 'bookingIdHotel')} />
                              <span style={{color: "red"}}>{this.state.errors["bookingIdHotel"]}</span>
                            </div>
                          </div>
                          <div className="col-md-12">
                            <button type="button" className="btn btn-choose pull-left" onClick={this.retreiveBookingHt}>Retreive My Booking</button>
                          </div>
                        </div>
                        </div>
                        <div className="tab-pane" id="tab_d">

                        </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  flightSchedule: state.searchFlight.airlanesSchedule,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  retreiveBookingFlight,
  retreiveBookingHotel
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RetreiveBooking)
