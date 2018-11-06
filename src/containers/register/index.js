import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { retreiveBookingFlight } from '../../modules/searchFlight';
import { retreiveBookingHotel } from '../../modules/searchHotel';
import { sessionId } from '../../config';
import { Link } from 'react-router-dom';
import { history } from '../../store';

class Register extends React.Component {

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
    phoneNumber: '',
  }

  handleChangeInput = (name, e) => {
    this.setState({
      [name]: e.target.value
    })
  }

  handleRegister = e => {
    this.props.loginRequest({
      username: this.state.email,
    })
    this.onCloseModal();
  }

  handleLogin = e => {
    this.onCloseModal();
  }

  handleLogout = e => {
    this.props.logoutRequest()
  }

  render() {
    const { transactionData } = this.props;
    return (
      <div>
        <div className="top-static">
          <h1>Sign in or register</h1>
          <p>for exclusive savings on flights, hotels and train</p>
        </div>
        <div className="jumbotron" style={{marginBottom:0,background:'#FFF'}}>
          <div className="container">
            <div className="row">
              <div className="col-md-6">
              <div className="reg-box">
                <h3>Create an account</h3>
                <p>Join Us and become a member!</p>
                 <div className="form-group">
                  <label>Email or Mobile no.</label>
                  <input type="email" class="form-control" placeholder="" onChange={this.handleChangeInput.bind(this, 'email')}/>
                </div>
                <div className="form-group">
                  <label>Password</label>
                  <input type="password" class="form-control" placeholder="" onChange={this.handleChangeInput.bind(this, 'email')}/>
                </div>
                <div className="form-group">
                  <label>Confirm Password</label>
                  <input type="password" class="form-control" placeholder="" onChange={this.handleChangeInput.bind(this, 'email')}/>
                </div>
                <button type="button" className="btn btn-choose pull-left" style={{marginBottom:'0px',marginTop:'0'}} onClick={this.handleRegister}>Register</button>
                <p className="pull-right" style={{marginTop:'20px',fontSize:'14px'}}>Already registered??&nbsp; 
                <a onClick={this.handleLogin} href="javascript:void(0)">Login</a></p>
                <div className="clear"></div>
              </div>
              </div>
              <div className="col-md-6 right-reg">
                <img style={{display:'block',margin:'auto'}} src="/img/iconreg.png"/>
                <p style={{textAlign:'center'}} className="benefit-reg">Enjoy benefits as registered user
                </p>
                <div className="media">
                  <div className="media-left media-middle">
                    <a href="#">
                      <img className="media-object" src="/img/reg1.png" alt="..."/>
                    </a>
                  </div>
                  <div className="media-body">
                    <h4 className="media-heading">Price Alert</h4>
                    <p>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
                  </div>
                </div>
                <div className="media">
                  <div className="media-left media-middle">
                    <a href="#">
                      <img className="media-object" src="/img/reg2.png" alt="..."/>
                    </a>
                  </div>
                  <div className="media-body">
                    <h4 className="media-heading">Price Alert</h4>
                    <p>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
                  </div>
                </div>
                <div className="media">
                  <div className="media-left media-middle">
                    <a href="#">
                      <img className="media-object" src="/img/reg2.png" alt="..."/>
                    </a>
                  </div>
                  <div className="media-body">
                    <h4 className="media-heading">Price Alert</h4>
                    <p>Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum Lorem ipsum</p>
                  </div>
                </div>
              </div>
            </div>
            <br/><br/>
            <br/><br/>
          </div>
        </div>
      </div>  
    );
  }
}

const mapStateToProps = state => ({
  transactionData: state.account.transactionData,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  retreiveBookingFlight,
  retreiveBookingHotel
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register)
