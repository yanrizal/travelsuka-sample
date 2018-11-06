import React from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-responsive-modal';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loginRequest, logoutRequest } from '../../modules/auth'; 
import { history } from '../../store';
import { withLocalize, Translate, setActiveLanguage } from "react-localize-redux";
import { renderToStaticMarkup } from "react-dom/server";
import globalTranslations from "../../translations/global.json";

class Header extends React.Component {

  state = {
    open: false,
    email: 'KHDEVU01',
    password: 'password123',
    fade: '',
    curLang: 'id',
  };

  constructor(props) {
    super(props);
    const languages = [
        { name: "English", code: "en" },
        { name: "Indonesia", code: "id" }
      ]
    this.props.initialize({
      languages: languages,
      options: { renderToStaticMarkup }
    });
    this.props.addTranslation(globalTranslations)
    //this.props.setLanguages('id')
    this.props.setActiveLanguage('id')
  }

  handleChangeLang = (id,e) => {
    this.setState({
      curLang: id
    })
    this.props.setActiveLanguage(id)
  }

  getScrollPosition = e => {
    var scrollObject = {};
    scrollObject = {
       x: window.pageXOffset,
       y: window.pageYOffset
    }
    // If you want to check distance
    if(scrollObject.y > 21) {
        // add class
        this.setState({
          fade: 'head-menu-sc'
        })
    } else {
        // remove class
        this.setState({
          fade: ''
        })
    }
  }

  componentDidMount(){
    window.addEventListener('scroll', this.getScrollPosition);
  }

  handleChangeInput = (name, e) => {
    this.setState({
      [name]: e.target.value
    })
  }

  handleRegister = e => {
    history.push('/register')
    this.onCloseModal();
  }

  handleLogin = e => {
    this.props.loginRequest({
      username: this.state.email,
      password: this.state.password,
    })
    this.onCloseModal();
  }

  handleLogout = e => {
    this.props.logoutRequest()
  }

  onOpenModal = () => {
    this.setState({ open: true });
  };

  onCloseModal = () => {
    this.setState({ open: false });
  };

  render() {
    const { isAuth } = this.props;

    return (
      <header>
        <div className="bs-example bs-navbar-top-example" data-example-id="navbar-fixed-to-top">
         <nav className={`navbar navbar-default head-menu navbar-fixed-top ${this.state.fade}`}>
            <div className="container">
               <div className="navbar-header"> 
               <button type="button" className="collapsed navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-6" aria-expanded="false"> 
               <span className="sr-only">Toggle navigation</span> <span className="icon-bar"></span> <span className="icon-bar"></span> <span className="icon-bar"></span> 
               </button> <Link to="/" className="navbar-brand logo">
                <img src="/img/logo_travelsuka.png" width="150"/>
               </Link> </div>
               <div className="collapse navbar-collapse pull-right" id="bs-example-navbar-collapse-6">
                  <ul className="nav navbar-nav" style={{paddingTop:'5px'}}>
                    <li><Link to="/retrieve/booking"><img src="/img/headicon1-2.png" width="19"/>&nbsp;Retrieve Booking</Link></li>
                    <li><Link to="/">
                      <img style={{float:'left'}} src="/img/headicon4-2.png" width="24"/>&nbsp;
                      <p style={{float:'left',
                      textAlign:'center',fontWeight:'600',
                      fontSize:'16px',marginTop: '-8px',marginLeft:'8px',lineHeight:'15px'}}><span style={{fontSize:'10px'}}>CALL CENTER</span> <br/>2929 5300</p>
                    </Link></li>

                    {/*!isAuth &&
                      <li className="mz" style={{cursor:'pointer'}}>
                      <div className="dropdown">
                              <a type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style={{paddingRight:'15px'}}>
                              <img src="/img/headicon2.png" width="17" className="pull-left mzi" style={{marginTop:'1px'}}/>
                              &nbsp;<span style={{marginTop:'2px'}} className="mz2">My Account</span></a>
                            <div className="dropdown-menu drop-login" aria-labelledby="dropdownMenu1">
                              <p>Log In to your account</p>
                              <div className="form-group">
                                <label>Email or Mobile no.</label>
                                <input type="email" class="form-control" placeholder="" onChange={this.handleChangeInput.bind(this, 'email')}/>
                              </div>
                              <div className="form-group">
                                <label style={{width:'100%'}}>Password<Link to="/" style={{fontWeight:'300',fontSize:'14px'}} className="pull-right">Forgot?</Link></label>
                                <input type="password" className="form-control" placeholder="" onChange={this.handleChangeInput.bind(this, 'password')}/>
                              </div>
                              <button type="button" className="btn btn-choose pull-left" style={{marginBottom:'0px',marginTop:'0'}} onClick={this.handleLogin}>Login</button>
                              <p className="pull-right" style={{marginTop:'0',fontSize:'14px',width:'100px'}}>No account yet?&nbsp; 
                              <a onClick={this.handleRegister} href="javascript:void(0)">Register</a></p>
                            </div>
                          </div>
                      </li>
                    */}
                    {isAuth &&
                      <li style={{cursor:'pointer'}}>
                        <div className="dropdown">
                              <a type="button" id="dropdownMenu1" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" style={{paddingRight:'15px'}}>
                              <img src="/img/headicon2-2.png" width="17" className="pull-left" style={{marginTop:'1px'}}/>
                              &nbsp;<span style={{marginTop:'2px'}}>My Account</span></a>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
                              <li><Link to="/myaccount/transaction-history">Transaction History</Link></li>
                              <li><a href="#">Profile</a></li>
                              <li><a href="#">Change Password</a></li>
                              <li role="separator" class="divider"></li>
                              <li><a onClick={this.handleLogout}>Logout</a></li>
                            </ul>
                          </div>

                     </li>
                    }
                    <li><Link target="_blank" to="/public/faq"><img src="/img/headicon3-2.png" width="19"/>&nbsp;FAQ</Link></li>
                    {this.state.curLang === 'id' &&
                    <li onClick={this.handleChangeLang.bind(this, 'en')}>
                      <a href="javascript:void(0)">
                      <img src="/img/idflag.png" width="25" style={{marginTop:'-2px'}}/> &nbsp;ID
                      </a>
                      </li>
                    }
                    {this.state.curLang === 'en' &&
                    <li onClick={this.handleChangeLang.bind(this, 'id')}>
                    <a href="javascript:void(0)">
                    <img src="/img/usflag.png" width="25" style={{marginTop:'-2px'}}/> &nbsp;EN
                    </a>
                    </li>
                    }
                  </ul>
               </div>
            </div>
         </nav>
        </div>
        {/*<div className="modal-login" >
          <Modal open={this.state.open} onClose={this.onCloseModal} little>
            <p>Log In to your account</p>
            <div className="form-group">
              <label>Email or Mobile no.</label>
              <input type="email" class="form-control" placeholder="" onChange={this.handleChangeInput.bind(this, 'email')}/>
            </div>
            <div className="form-group">
              <label style={{width:'100%'}}>Password<Link to="/" style={{fontWeight:'300',fontSize:'14px'}} className="pull-right">Forgot?</Link></label>
              <input type="password" className="form-control" placeholder="" onChange={this.handleChangeInput.bind(this, 'password')}/>
            </div>
            <button type="button" className="btn btn-search pull-left" style={{marginTop:'5px'}} onClick={this.handleLogin}>Login</button>
            <p className="pull-right" style={{marginTop:'20px',fontSize:'14px'}}>No account yet?&nbsp; 
            <a onClick={this.handleRegister} href="javascript:void(0)">Register</a></p>
          </Modal>
        </div>*/}
      </header>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    isAuth: state.auth.isAuth,
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  loginRequest,
  logoutRequest
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withLocalize(Header))