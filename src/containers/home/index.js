import React from 'react'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  increment,
  incrementAsync,
  decrement,
  decrementAsync
} from '../../modules/counter';
import Widget from '../../components/widget';
import moment from 'moment';
import { sessionId } from '../../config';
import { getHotelListHome, postBookHotel } from '../../modules/searchHotel';
import formatRp from '../../custom/formatRp';
import queryString from 'query-string';
import { history } from '../../store';
import { withLocalize, Translate, setActiveLanguage } from "react-localize-redux";
import { renderToStaticMarkup } from "react-dom/server";
import globalTranslations from "../../translations/global.json";

class Home extends React.Component {

  state = {
    zIndex: 1,
    display: 'none',
    startDate: moment().add(1, 'days').format('DD-MM-YYYY'),
    endDate: moment().add(2, 'days').format('DD-MM-YYYY'),
  }

  handleOverlay = e => {
    this.setState({
      display: 'block',
      zIndex: 3
    })
  }

  handleCloseOverlay = e => {
    this.setState({
      display: 'none',
      zIndex: 1
    })
  }

  handleChooseHotel = (ct, name, cd, e) => {
    const parsed = queryString.parse(window.location.search);
    const payload = {
      roomCode: "",
      oldPrice: "",
      paxPassport:"CO0094",
      destCountryCode:"CO0094",
      destCityCode:"CI000021",
      hotelCode: cd,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      bedType: "Empty",
      numberOfResults: 0,
      page: 0,
      room: 1,
      adultCount: 1,
      childCount: 0,
      sessionId: sessionId
    }
    const stringified = queryString.stringify(payload);
    history.push(`/hotel/detail/${ct}/${name}?${stringified}&code=${cd}`);
  }

  componentDidMount() {
    const payload = {
      paxPassport:"CO0094",
      destCountryCode:"CO0094",
      destCityCode:"CI000021",
      hotelCode:null,
      checkInDate:moment(this.state.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      checkOutDate:moment(this.state.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      occupancy:["1|0"],
      roomInfo:null,
      bedType:"Empty",
      page:1,
      numberOfResults:4,
      sessionId: sessionId,
    }
    // this.getHotel(payload)
  }

  getHotel = (payload) => {
    const self = this
    this.props.getHotelListHome(payload).then((res) => {
      if (res.hotels == null || res.hotels.length === 0) {
        self.getHotel(payload)
      }
    });
  }

  render() {
    return (
      <div>
        <div id="overlay" style={{display:`${this.state.display}`}} onClick={this.handleCloseOverlay}></div>
        <div className="jumbotron homebg">
        <div className="container">
          <div className="row">
            <div className="col-md-8" style={{marginLeft:'0',zIndex:`${this.state.zIndex}`}} onClick={this.handleOverlay}>
              <Widget />
            </div>
            <div className="col-md-3">
              {/*<img src="/img/hotel1.png" width="320" style={{marginTop:'10px'}}/>*/}
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray">
      <div className="container">
        <div className="row mid-txt">
          <div className="col-md-12">
            <h3><Translate id="home.title" /></h3>
            <p>Get inspired, find the best deals and start your holiday needs in one place</p>
          </div>
        </div><br/>
        {/*<div className="row">
            <div className="col-md-3">
              <div className="home-card hc1">
                <div className="caption">
                  <h4>Murah dan Jujur</h4>
                  <p>Harga di awal sudah final, gratis biaya transaksi dan tanpa biaya tersembunyi.</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="home-card hc2">
                <div className="caption">
                  <h4>Jaminan Harga Terbaik</h4>
                  <p>Jika Anda menemukan harga yang lebih murah, klaim dan kami akan menggantikannya.</p>
                </div>
              </div>
           </div>
            <div className="col-md-6">
              <div className="home-card hc3">
                <div className="caption">
                  <h4>Siap Membantu Anda 24/7</h4>
                  <p>Menjawab dan mengelola pemesanan Anda dengan bantuan customer service kami.</p>
                </div>
              </div>
            </div>
          </div>*/}
          {/*<div className="row">
            <div className="col-md-12">
              <div className="subscribe-box">
                <div className="row">
                  <div className="col-md-2">
                    <img src="/img/sub.png"/>
                  </div>
                  <div className="col-md-4">
                    <p>Stay up to date <br/>
                      for exclusive coupons <br/>
                      to your email</p>
                  </div>
                  <div className="col-md-6">
                    <form className="form-inline">
                      <div className="form-group">
                        <label className="sr-only">Password</label>
                        <input type="text" className="form-control" id="inputPassword2" placeholder="enter your email address"/>
                      </div>
                      <button type="submit" className="btn btn-default">send me</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
            <div className="col-md-12">
              <h3>Today's top deals</h3>
            </div>
            {this.props.hotelList !== null &&
            <div>
            {this.props.hotelList.map((item, index) => {
              const slug = item.hotelName.replace(/ /g,"-");
            return (
            <div className="col-md-3">
              <div className="top-card">
                <div style={{width:'262px',height:'205px',overflow:'hidden'}}>
                  <img src={item.heroImage} width="302"/>
                </div>
                <div className="caps">
                  <h4 style={{whiteSpace: 'nowrap', 
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'}}>{item.hotelName}</h4>
                  <p>{item.cityName}, {item.countryName}</p>
                  <div className="row">
                    <div className="col-md-7">
                      {item.roomsCategory !== null &&
                      <div>
                      <span>Strating from</span><br/>
                      <span className="top-price">Rp {formatRp(item.roomsCategory[0].grossPrice)}</span>
                      </div>
                      }
                    </div>
                    <div className="col-md-5">
                      {item.roomsCategory !== null &&
                      <button onClick={this.handleChooseHotel.bind(this, (item.countryName !== null)? item.countryName.toLowerCase(): '-', slug.toLowerCase(), item.hotelCode)} 
                      className="btn top-btn pull-right">Detail</button>
                      }
                      {item.roomsCategory == null &&
                      <button 
                      className="btn top-btn pull-right">Sold Out</button>
                      }
                    </div>
                  </div>
                </div>  
              </div>
            </div>
            )}
          )}
          </div>
          }
          </div><br/><br/><br/>
          <div className="row">
            <div className="col-md-12" style={{textAlign:'center'}}>
              <Link to={`/hotel/search?adultCount=1&childCount=0&destCityCode=CI000021&destCountryCode=CO0094&destination=Bandung&endDate=${this.state.endDate}&guest=1&page=1&room=1&startDate=${this.state.startDate}`}>
              <button className="btn btn-more">View more deals</button>
              </Link>
            </div>
          </div><br/><br/>*/}

          <div className="row find-deals">
            <div className="col-md-8 col-sm-6">
              <div className="fd-card1">
                <Link to={`/hotel/search?adultCount=1&childCount=0&destCityCode=CI000021&destCountryCode=CO0094&destination=Bandung&endDate=${this.state.endDate}&guest=1&page=1&room=1&startDate=${this.state.startDate}`}>
                <div className="fd-txt">
                <span>Hotels</span>
                <h4>Bandung</h4>
                {/*<p>Hotels</p>*/}
                </div>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="fd-card2">
                <Link to={`/hotel/search?adultCount=1&childCount=0&destCityCode=CI000419&destCountryCode=CO0094&destination=Semarang&endDate=${this.state.endDate}&guest=1&page=1&room=1&startDate=${this.state.startDate}`}>
                <div className="fd-txt">
                <span>Hotels</span>
                <h4>Semarang</h4>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="fd-card3">
                <Link to={`/hotel/search?adultCount=1&childCount=0&destCityCode=CI000534&destCountryCode=CO0094&destination=Yogyakarta&endDate=${this.state.endDate}&guest=1&page=1&room=1&startDate=${this.state.startDate}`}>
                <div className="fd-txt">
                <span>Hotels</span>
                <h4>Yogyakarta</h4>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="fd-card4">
                <Link to={`/hotel/search?adultCount=1&childCount=0&destCityCode=CI000152&destCountryCode=CO0094&destination=Jakarta&endDate=${this.state.endDate}&guest=1&page=1&room=1&startDate=${this.state.startDate}`}>
                <div className="fd-txt">
                <span>Hotels</span>
                <h4>Jakarta</h4>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="fd-card5">
                <Link to={`/hotel/search?adultCount=1&childCount=0&destCityCode=CI000468&destCountryCode=CO0094&destination=Surabaya&endDate=${this.state.endDate}&guest=1&page=1&room=1&startDate=${this.state.startDate}`}>
                <div className="fd-txt">
                <span>Hotels</span>
                <h4>Surabaya</h4>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-md-4 col-sm-6">
              <div className="fd-card6">
                <Link to={`/hotel/search?adultCount=1&childCount=0&destCityCode=CI000252&destCountryCode=CO0094&destination=Malang&endDate=${this.state.endDate}&guest=1&page=1&room=1&startDate=${this.state.startDate}`}>
                <div className="fd-txt">
                <span>Hotels</span>
                <h4>Malang</h4>
                </div>
                </Link>
              </div>
            </div>
            <div className="col-md-8 col-sm-12">
              <div className="fd-card7">
                <Link to={`/hotel/search?adultCount=1&childCount=0&destCityCode=CI000535&destCountryCode=CO0094&destination=Bali&endDate=${this.state.endDate}&guest=1&page=1&room=1&startDate=${this.state.startDate}`}>
                <div className="fd-txt">
                <span>Hotels</span>
                <h4>Bali</h4>
                </div>
                </Link>
              </div>
            </div>
          </div>  

          <div className="row mid-txt">
          <br/><br/>
          <div className="col-md-12">
            <h3 style={{lineHeight: '40px'}}>Why The Price of Air Tickets and Hotels in Travelsuka cheaper?</h3>
            <p></p>
          </div>
          <div className="col-md-3 col-sm-6 h-info">
            <img src="/img/sprite1-2.png"/>
            <h5 style={{marginTop:'20px'}}>Efficient <br/> Technology</h5>
            <p>To compare more than <br/>200.000 hotels and 200 airlines <br/>worldwide with 1 time touch</p>
          </div>
          <div className="col-md-3 col-sm-6 h-info">
            <img src="/img/sprite2-2.png"/>
            <h5 style={{marginTop:'20px'}}>Not just cheap,<br/> it's an honest price</h5>
            <p>The price at the beginning<br/> of a final, free of transaction fees<br/> and no hidden costs.</p>
          </div>
          <div className="col-md-3 col-sm-6 h-info">
            <img src="/img/sprite3-2.png"/>
            <h5 style={{marginTop:'20px'}}>Travelsuka best<br/> price guarantee</h5>
            <p>We provide the best price<br/> airfare and accomodation, <br/>either domestic or international</p>
          </div>
          <div className="col-md-3 col-sm-6 h-info">
            <img src="/img/sprite4-2.png"/>
            <h5 style={{marginTop:'20px'}}>We're here<br/> to help 24/7</h5>
            <p>Find answers, manage your<br/>booking, trouble booking and<br/> more with our Help Center.</p>
          </div>
        </div>
        <br/>
        </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hotelList: state.searchHotel.hotelListHome.hotels,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  increment,
  incrementAsync,
  decrement,
  decrementAsync,
  getHotelListHome,
  postBookHotel,
  changePage: () => push('/about-us')
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
