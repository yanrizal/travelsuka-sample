import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { saveBookingData, saveBookingHotel } from '../../modules/searchHotel';
import queryString from 'query-string';
import formatRp from '../../custom/formatRp';
import { history } from '../../store';
import { sessionId } from '../../config';
import moment from 'moment';
import ModalPopup from '../../components/modal';
import Modal from 'react-responsive-modal';

class HotelBooking extends React.Component {

  state = {
    errors:{},
    firstName: '',
    lastName: '',
    fullName: '',
    open: false,
    open2: false,
    titleGuest: 'Mr.',
    genderGuest: 'M',
    errorMsg: '',
  }

  componentDidMount(){
    window.scrollTo(0, 0);
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

  handleReview = e => {
    let errors = {};
    let valid = true;
    // if (this.state[`firstName`] === '' || typeof this.state[`firstName`] === "undefined") {
    //   errors[`firstName`] = "Cannot be empty";
    //   this.setState({errors: errors})
    //   valid = false;
    // } else {
    //   errors[`firstName`] = "";
    //   this.setState({errors: errors})
    //   valid = true;
    // }

    // if (this.state[`guestFirstName`] === '' || typeof this.state[`guestFirstName`] === "undefined") {
    //   errors[`guestFirstName`] = "Cannot be empty";
    //   this.setState({errors: errors})
    //   valid = false;
    // } else {
    //   errors[`guestFirstName`] = "";
    //   this.setState({errors: errors})
    //   valid = true;
    // }

    // if (this.state[`guestLastName`] === '' || typeof this.state[`guestFirstName`] === "undefined") {
    //   errors[`guestLastName`] = "Cannot be empty";
    //   this.setState({errors: errors})
    //   valid = false;
    // } else {
    //   errors[`guestLastName`] = "";
    //   this.setState({errors: errors})
    //   valid = true;
    // }

    // if (this.state[`lastName`] === '' || typeof this.state[`lastName`] === "undefined") {
    //   errors[`lastName`] = "Cannot be empty";
    //   this.setState({errors: errors})
    //   valid = false;
    // } else {
    //   errors[`lastName`] = "";
    //   this.setState({errors: errors})
    //   valid = true;
    // }

    if (this.state[`fullName`] === '' || typeof this.state[`fullName`] === "undefined") {
      errors[`fullName`] = "Cannot be empty";
      this.setState({errors: errors})
      valid = false;
    } else {
      errors[`fullName`] = "";
      this.setState({errors: errors})
      valid = true;
    }

    if (this.state[`guestFullName`] === '' || typeof this.state[`guestFullName`] === "undefined") {
      errors[`guestFullName`] = "Cannot be empty";
      this.setState({errors: errors})
      valid = false;
    } else {
      errors[`guestFullName`] = "";
      this.setState({errors: errors})
      valid = true;
    }

    if (this.state[`email`] === '' || typeof this.state[`email`] === "undefined") {
      errors[`email`] = "Cannot be empty";
      this.setState({errors: errors})
      valid = false;
    } else {
      errors[`email`] = "";
      this.setState({errors: errors})
      valid = true;
    }

    if (this.state[`phone`] === '' || typeof this.state[`phone`] === "undefined") {
      errors[`phone`] = "Cannot be empty";
      this.setState({errors: errors})
      valid = false;
    } else {
      errors[`phone`] = "";
      this.setState({errors: errors})
      valid = true;
    }

    // if (this.state[`paxPassport`] === '' || typeof this.state[`paxPassport`] === "undefined") {
    //   errors[`paxPassport`] = "Cannot be empty";
    //   this.setState({errors: errors})
    //   valid = false;
    // } else {
    //   errors[`paxPassport`] = "";
    //   this.setState({errors: errors})
    //   valid = true;
    // }

    
    if (valid) {
      const { hotel, hotelBook } = this.props;
      const { fullName, guestFullName } = this.state;
      let hotelSelected = hotel;
      hotelSelected.roomsCategory = [hotelBook.room];
      
      let roomList = hotelBook.room.roomType;
      //console.log('hb', roomList)
      let firstName = fullName.split(' ').slice(0, -1).join(' ');
      let lastName = fullName.split(' ').slice(-1).join(' ');
      let gFirstName = guestFullName.split(' ').slice(0, -1).join(' ');
      let gLastName = guestFullName.split(' ').slice(-1).join(' ');

      if (firstName === '') {
        firstName = lastName;
      }
      if (gFirstName === '') {
        gFirstName = gLastName;
      }

      const guestArr = [];
      this.setState({
        genderGuest: (this.state.titleGuest === 'Mr.') ? 'M' : 'F',
      })

      for (var i = Math.floor(roomList.adultCount/roomList.roomCount) - 1; i >= 0; i--) {
        guestArr.push({
          guestType: "ADT",
          title: this.state.titleGuest,
          firstName: gFirstName,
          lastName: gLastName,
          gender: this.state.genderGuest,
        })
      }
      roomList.guests = guestArr;
      roomList.sequence = 2;
      //console.log('rr', roomList)
      const roomArr = [];
      const count = roomList.roomCount;
      //console.log('count', count)
      for (let i = 0; i < count; i++) {
        const x = Object.assign({}, roomList); 
        x.sequence = i;
        //console.log(i, x);
        roomArr.push(x)
      }

      hotelSelected.roomsCategory[0].roomList = roomArr;
      // console.log('hotelSelected', hotelSelected)
      const payload = {
        "paxPassport": "CO0094",
        "checkInDate": hotelBook.checkIn,
        "checkOutDate": hotelBook.checkOut,
        "customer": {
          "firstName": firstName,
          "lastName": lastName,
          "phoneNumber": this.state.phone,
          "email": this.state.email
        },
        "hotel": hotelSelected,
        "sessionId": sessionId,
      }
      this.onOpenModal();
      //console.log(payload);
      this.props.saveBookingData(payload)
      this.setState({errorMsg: ''})
      this.props.saveBookingHotel(payload).then(() => {
        this.onCloseModal();
        history.push(`/hotel/review`);
      }).catch((err) => {
        this.onCloseModal();
        this.onOpenModal2();
        window.scrollTo(0, 0);
        this.setState({
          errorMsg: err,
        })
      })
    }
  }

  handleChangeInput = (name, e) => {
    this.setState({
      [name]: e.target.value
    })
  }

  handleImGuest = e => {
    if (this.state.imguest) {
      this.setState({
        imguest: !this.state.imguest,
        guestFullName: '',
      })
    } else {
      this.setState({
      imguest: !this.state.imguest,
      guestFullName: this.state.fullName,
    })
    }
    
  }


  render() {
    const { hotel, hotelBook } = this.props;
    //console.log('H', hotel, hotelBook)
    const checkIn = moment(hotelBook.checkIn, 'YYYY-MM-DD');
    const checkOut = moment(hotelBook.checkOut, 'YYYY-MM-DD');

    return (
      <div className="jumbotron" style={{marginBottom:0,background:'#FFF'}}>
      <div className="top-book">
        <div className="container">
        <div className="row">
        <div className="col-md-12">
          <h1>Hotel Booking</h1>
        </div>
        </div>
        </div>
      </div>
      <div className="container">
        <br/>
        <div className="row">
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-6">
               <img src={hotel.heroImage} style={{width:'100%'}}/>
            </div>
            <div className="col-md-6 ht-book-detail">
              <h2>Booking Detail</h2>
              <span>{hotel.hotelName}</span>
              <p>
                Room Type
              </p>
              <span>{hotel.roomsCategory[0].name}</span>

              <div className="row">
                <div className="col-md-4">
                  <p>No. Room</p>
                  <span>{hotelBook.noOfRoom} Room</span>
                </div>
                <div className="col-md-4">
                  <p>Guest</p>
                  <span>{hotelBook.guest} Guest</span>
                </div>
                <div className="col-md-4">
                  <p>Duration</p>
                  <span>{hotelBook.duration} night</span>
                </div>
              </div>

              <div className="row">
                <div className="col-md-5">
                  <p>Check-in</p>
                  <div class="media">
                  <div class="media-left">
                    <span className="sp-check">{checkIn.format('D')}</span>
                  </div>
                  <div class="media-body">
                    <h4 class="media-heading">{checkIn.format('MMM')}</h4>
                    <p style={{margin:0}}>{checkIn.format('dddd')}</p>
                  </div>
                </div>
                </div>
                <div className="col-md-2" >
                  <div style={{borderTop:'1px solid #CCC',marginTop:'60px'}}></div>
                </div>
                <div className="col-md-5">
                  <p>Check-out</p>
                  <div class="media">
                  <div class="media-left">
                    <span className="sp-check">{checkOut.format('D')}</span>
                  </div>
                  <div class="media-body">
                    <h4 class="media-heading">{checkOut.format('MMM')}</h4>
                    <p style={{margin:0}}>{checkOut.format('dddd')}</p>
                  </div>
                </div>
                </div>
              </div>
            </div>
          </div>
          <h3 className="your-i">Your Information</h3>
          <div className="clear"></div>
          {this.state.errorMsg !== '' &&
            <div className="alert alert-danger" role="alert">
              {this.state.errorMsg}
            </div>
          }
          <div className="book-form">
            <div className="row">
              <div className="col-md-12">
              <div className="form-group">
                <label>Full name <span style={{color:'red'}}>*</span></label>
                <input type="text" className="form-control" 
                value={this.state.fullName} onChange={this.handleChangeInput.bind(this, 'fullName')} />
                <span style={{color: "red"}}>{this.state.errors["fullName"]}</span>
                <p>As in Passport/Official ID Card (without title/special characters)</p>
              </div>
              </div>
            </div>
            {/*<div className="row">
              <div className="col-md-6">
              <div className="form-group">
                <label>First name <span style={{color:'red'}}>*</span></label>
                <input type="text" className="form-control" 
                value={this.state.firstName} onChange={this.handleChangeInput.bind(this, 'firstName')} />
                <span style={{color: "red"}}>{this.state.errors["firstName"]}</span>
                <p>As in Passport/Official ID Card (without title/special characters)</p>
              </div>
              </div>
              <div className="col-md-6">
              <div className="form-group">
                <label>Last name <span style={{color:'red'}}>*</span></label>
                <input type="text" className="form-control" 
                value={this.state.lastName} onChange={this.handleChangeInput.bind(this, 'lastName')} />
                <span style={{color: "red"}}>{this.state.errors["lastName"]}</span>
                <p>As in Passport/Official ID Card (without title/special characters)</p>
              </div>
              </div>
            </div>*/}
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                <label>Phone Number <span style={{color:'red'}}>*</span></label>
                <input type="text" className="form-control" 
                value={this.state.phone} onChange={this.handleChangeInput.bind(this, 'phone')}/>
                <span style={{color: "red"}}>{this.state.errors["phone"]}</span>
                <p>e.g. +62812345678, for Country Code (+62) and Mobile No. 0812345678</p>
              </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                <label>Email address <span style={{color:'red'}}>*</span></label>
                <input type="text" className="form-control" 
                value={this.state.email} onChange={this.handleChangeInput.bind(this, 'email')}/>
                <span style={{color: "red"}}>{this.state.errors["email"]}</span>
                <p>e.g.: email@example.com</p>
              </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="checkbox">
                <label>
                  <input type="checkbox" onClick={this.handleImGuest} checked={this.state.imguest}/>
                  <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                  <span className="crt">Im the guest</span>
                </label>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
              <div className="form-group contact-form">
                <label>Title <span style={{color:'red'}}>*</span></label>
                <select className="form-control" value={this.state.titleContact} 
                    onChange={this.handleChangeInput.bind(this, 'titleGuest')}>
                      <option value="Mr.">Mr</option>
                      <option value="Mrs.">Mrs</option>
                    </select>
                    <p>Mr or Mrs</p>
              </div>
              </div>
              <div className="col-md-6">
              {/*<div className="form-group contact-form">
                <label>Gender <span style={{color:'red'}}>*</span></label>
                <select className="form-control" value={this.state.titleContact} 
                    onChange={this.handleChangeInput.bind(this, 'genderGuest')}>
                      <option value="M">M</option>
                      <option value="F">F</option>
                    </select>
                    <p>M or F</p>
              </div>*/}
              </div>
            </div>
            <div className="row">
              {/*<div className="col-md-6">
                <div className="form-group">
                  <label>Guest's First name <span style={{color:'red'}}>*</span></label>
                  <input type="text" className="form-control" value={this.state.guestFirstName} onChange={this.handleChangeInput.bind(this, 'guestFirstName')}/>
                  <span style={{color: "red"}}>{this.state.errors["guestFirstName"]}</span>
                  <p>As in Passport/Official ID Card (without title/special characters)</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>Guest's Last name <span style={{color:'red'}}>*</span></label>
                  <input type="text" className="form-control" value={this.state.guestLastName} onChange={this.handleChangeInput.bind(this, 'guestLastName')}/>
                  <span style={{color: "red"}}>{this.state.errors["guestLastName"]}</span>
                  <p>As in Passport/Official ID Card (without title/special characters)</p>
                </div>
              </div>*/}
              <div className="col-md-12">
                <div className="form-group">
                  <label>Guest's full name <span style={{color:'red'}}>*</span></label>
                  <input type="text" className="form-control" value={this.state.guestFullName} onChange={this.handleChangeInput.bind(this, 'fullName')}/>
                  <span style={{color: "red"}}>{this.state.errors["guestFullName"]}</span>
                  <p>As in Passport/Official ID Card (without title/special characters)</p>
                </div>
              </div>
            </div>
            
             {/*<div className="row">
              <div className="col-md-12">
                <div className="form-group">
              <label>Pax Passport <span style={{color:'red'}}>*</span></label>
              <input type="text" className="form-control" 
              value={this.state.paxPassport} onChange={this.handleChangeInput.bind(this, 'paxPassport')}/>
              <span style={{color: "red"}}>{this.state.errors["paxPassport"]}</span>
              <p>As in Passport/Official ID Card (without title/special characters)</p>
            </div>
              </div>
            </div>*/}
          </div>

          <button type="button" onClick={this.handleReview} className="btn btn-choose pull-right hidden-xs">Continue</button>

        </div>
        <div className="col-md-4">
          <div className="book-form price-detail-box">
            <div className="total-top">
              <h3>Rp {formatRp(hotelBook.room.netPrice)}</h3>
            </div>
            <div className="book-form pd-box">
              <p>{hotelBook.room.bfTypeName}</p>
              <p>Cancellation Policy</p>
              {hotelBook.room.isRefundable == false &&
                <p>This reservation is non-refundable</p>
              }
              {hotelBook.room.isRefundable == true &&
                <p>This reservation is refundable</p>
              }
              <hr style={{color:'#CCC',background:'#CCC'}}/>
              <p className="pull-left" style={{width:'200px'}}>{hotelBook.room.name} <br/>({hotelBook.duration} Night) x {hotelBook.noOfRoom} room</p> 
              <span className="pull-right" style={{fontSize:'14px',fontWeight:'150'}}>Rp {formatRp(hotelBook.room.netPrice)}</span>
              <div className="clear"></div>
              <p>Tax <span className="pull-right">Rp {formatRp(hotelBook.room.commPrice)}</span></p>
              <div className="clear"></div>
            </div>
            <div className="total-bot">
              <p style={{fontWeight:600}}>Total <span className="pull-right">Rp {formatRp(hotelBook.room.netPrice)}</span></p>
            </div>
            <button type="button" onClick={this.handleReview} className="btn btn-choose pull-right visible-xs">Continue</button>
            {/*<div className="row">
              <div className="col-md-4">
                <img src={hotel.heroImage} style={{width:'100%'}}/>
              </div>
              <div className="col-md-8">
                <p>{hotel.hotelName}</p>
              </div>
            </div>
            <hr style={{color:'#CCC',background:'#CCC'}}/>
            <div className="row book-detail">
              <div className="col-md-12">
                <p><span>Duration</span>{hotelBook.duration}</p>
                <p><span>Check-in</span>{hotelBook.checkIn}</p>
                <p><span>Check-out</span>{hotelBook.checkOut}</p>
                <p><span>No. of rooms</span>{hotelBook.noOfRoom}</p>
              </div>
            </div>*/}
            <div className="modal-loading" >
              <Modal open={this.state.open2} onClose={this.onCloseModal2} little showCloseIcon={false}>
                <img src="/img/iconmodal.png" width="85" />
                <p>{this.state.errorMsg}</p>
                <button className="btn btn-choose" style={{float:'none',display:'block',margin:'auto'}}
                onClick={this.onCloseModal2}>Ok</button>
              </Modal>
            </div>
            <ModalPopup open={this.state.open} 
              onCloseModal={this.onCloseModal} 
              onOpenModal={this.onOpenModal}/>
          </div>
        </div>
        </div>
      </div>
     </div>
    );
  }
}

const mapStateToProps = state => ({
  hotel: state.searchHotel.hotelDetail.hotel,
  hotelBook: state.searchHotel.hotelBook,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  saveBookingData,
  saveBookingHotel,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HotelBooking)
