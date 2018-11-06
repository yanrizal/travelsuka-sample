import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { getHotelList } from '../../modules/searchHotel';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import HotelListCard from '../../components/hotelListCard';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css';
import ReactPaginate from 'react-paginate';
import moment from 'moment';
import { sessionId } from '../../config';
import { history } from '../../store';
import _ from 'lodash';

class HotelList extends React.Component {

  state = {
    destination: '',
    percent: 10,
    pageCount: 1,
    currentPage: 1,
    perPage: 30,
    isCheckedStar1: false,
    checkedStar: [],
    checkedFacility: [],
    filteredhotelList: [],
    showHotelList: {},
    sortBy: '',
    sortType: 'asc'
  }

  componentDidMount() {
    const self = this
    const int = setInterval(() => {
      self.setState({
        percent: self.state.percent + 10
      })
      //console.log(self.state.percent)
      if (self.state.percent >= 90) {
        clearInterval(int)
      }
    }, 500)
  }

  componentWillReceiveProps(props) {
    this.setState({
      filteredhotelList: props.hotelList
    }, () => { this.updateList() })
  }

  handleSortStar = (n, name, e) => {
    console.log(name, n)
    let checkedStar = this.state.checkedStar
    let indexCheckedStar = checkedStar.indexOf(parseInt(n))
    if (indexCheckedStar == -1) {
      checkedStar.push(parseInt(n))
    } else {
      checkedStar.splice(indexCheckedStar, 1);
    }
    this.setState({
      [name]: !this.state[name],
      checkedStar,
      percent: 100
    }, () => { this.updateList() })
  }

  handleFilterFacility = (facility) => {
    let checkedFacility = this.state.checkedFacility
    let indexcheckedFacility = checkedFacility.indexOf(facility)
    if (indexcheckedFacility == -1) {
      checkedFacility.push(facility)
    } else {
      checkedFacility.splice(indexcheckedFacility, 1);
    }
    this.setState({
      checkedFacility,
      percent: 100
    }, () => { this.updateList() })
  }

  handleSort = (key, type) => {
    this.setState({
      sortBy: key,
      sortType: type
    }, () => { this.updateList() })
  }

  updateList = () => {
    let { checkedStar, checkedFacility, sortBy, sortType, currentPage, perPage, showHotelList } = this.state
    let newFilteredhotelList = this.props.hotelList
    console.log(checkedFacility)
    // filter by rating
    if (checkedStar.length > 0) {
      newFilteredhotelList = _.filter(newFilteredhotelList, function (o) {
        return checkedStar.indexOf(parseInt(o.rating)) != -1;
      });
    }
    // filter by facility
    // TODO: need more clarity on all facility options
    if (checkedFacility.length > 0) {
      // newFilteredhotelList = _.filter(newFilteredhotelList, function (o) {
      //   o.facility.map((item, index) => {
      //     return checkedFacility.indexOf(item.facility_name.trim()) != -1;
      //   })      
      // });

      newFilteredhotelList = newFilteredhotelList.filter(function (a) {
        return a.facility.some(function (b) {
            return checkedFacility.indexOf(b.facility_name.trim()) != -1;
        });
      });
    }

    // sorting 
    if (sortBy != "") {
      if (sortBy == "price") {
        newFilteredhotelList = _.orderBy(newFilteredhotelList, function (e) { return e.roomsCategory != null ? e.roomsCategory[0].grossPrice : 0 }, [sortType]);
      } else {
        newFilteredhotelList = _.orderBy(newFilteredhotelList, [sortBy], [sortType]);
      }

    }

    //paging
    if (newFilteredhotelList !== null) {
      if (newFilteredhotelList.length > perPage) {
        showHotelList = newFilteredhotelList.slice((currentPage - 1) * perPage, currentPage * perPage)
      } else {
        showHotelList = newFilteredhotelList
      }
    }

    this.setState({
      filteredhotelList: newFilteredhotelList,
      showHotelList
    })
    // paging
  }

  handlePageClick = (data) => {
    this.setState({
      currentPage: parseInt(data.selected) + 1
    }, () => { this.updateList() })
    window.scrollTo(0,430)
    // const parsed = queryString.parse(window.location.search);
    // console.log('parsed', parsed)
    // const payload = {
    //   paxPassport: "CO0094",
    //   destCountryCode: parsed.destCountryCode,
    //   destCityCode: parsed.destCityCode,
    //   checkInDate: moment(parsed.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    //   checkOutDate: moment(parsed.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
    //   bedType: "Empty",
    //   occupancy: [`${parsed.guest}|0`],
    //   page: data.selected + 1,
    //   //numberOfResults: 30,
    //   hotelCode: "",
    //   sessionId: sessionId,
    // }
    // const stringified = queryString.stringify({
    //   destCountryCode: parsed.destCountryCode,
    //   destCityCode: parsed.destCityCode,
    //   startDate: parsed.startDate,
    //   endDate: parsed.endDate,
    //   guest: parsed.guest,
    //   page: data.selected + 1,
    //   numberOfResults: 30,
    // });
    // history.push(`/hotel/search?${stringified}`);
    // this.getHotel(payload)
    // window.scrollTo(0, 0);

  };

  getHotel = (payload) => {
    const self = this
    this.props.getHotelList(payload).then((res) => {
      if (res.hotels == null) {
        self.getHotel(payload)
      }
    });
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-4">
          <div className="filter-hotel">
            <div className="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
              <div className="panel panel-default">
                <div className="panel-heading" role="tab" id="headingOne">
                  <h4 className="panel-title">
                    <a role="button" data-toggle="collapse" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                      Sort result<span className="glyphicon glyphicon-menu-right pull-right"></span>
                    </a>
                    <p>Choose prefered hotel result</p>
                  </h4>
                </div>
                <div id="collapseOne" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
                  <div className="panel-body">
                    <div className="row">
                      <div className="col-md-5">
                        <img style={{ marginLeft: '20px' }} src="/img/hotelside.png" />
                      </div>
                      <div className="col-md-7">
                        <div className="radio">
                          <label><input type="radio" name="optradio" onClick={this.handleSort.bind(this, 'hotelName', 'asc')} />
                            <span class="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>Name</label>
                        </div>
                        <div className="radio">
                          <label><input type="radio" name="optradio" onClick={this.handleSort.bind(this, 'price', 'asc')} />
                            <span class="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>Cheapest price</label>
                        </div>
                        <div className="radio">
                          <label><input type="radio" name="optradio" onClick={this.handleSort.bind(this, 'price', 'desc')} />
                            <span class="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>Highest price</label>
                        </div>
                        <div className="radio">
                          <label><input type="radio" name="optradio" onClick={this.handleSort.bind(this, 'rating', 'desc')} />
                            <span class="cr"><i className="cr-icon glyphicon glyphicon-ok-sign"></i></span>Champion score</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel-side">
                <div className="panel panel-default">
                  <div className="panel-heading" role="tab" id="headingTwo">
                    <h4 className="panel-title">
                      <a className="collapsed" role="button" data-toggle="collapse" href="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
                        Star Rating<span className="glyphicon glyphicon-menu-right pull-right"></span>
                      </a>
                    </h4>
                  </div>
                  <div id="collapseTwo" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingTwo">
                    <div className="panel-body">
                      <div className="checkbox" >
                        <label>
                          <input type="checkbox" value={this.state.isCheckedStar1} onClick={this.handleSortStar.bind(this, '1', 'isCheckedStar1')} />
                          <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star-d" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star-d" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star-d" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star-d" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          &nbsp;<span className="crt">One star</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleSortStar.bind(this, '2', 'isCheckedStar1')} />
                          <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star-d" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star-d" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star-d" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          &nbsp;<span className="crt">Two star</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleSortStar.bind(this, '3', 'isCheckedStar1')} />
                          <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star-d" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star-d" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          &nbsp;<span className="crt">Three star</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleSortStar.bind(this, '4', 'isCheckedStar1')} />
                          <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star-d" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          &nbsp;<span className="crt">Four star</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleSortStar.bind(this, '5', 'isCheckedStar1')} />
                          <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="24" stroke-linecap="round" width="24"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
                          &nbsp;<span className="crt">Five star</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="panel panel-default">
                  <div className="panel-heading" role="tab" id="headingThree">
                    <h4 className="panel-title">
                      <a className="collapsed" role="button" data-toggle="collapse" href="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
                        Facility<span className="glyphicon glyphicon-menu-right pull-right"></span>
                      </a>
                    </h4>
                  </div>
                  <div id="collapseThree" className="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingThree">
                    <div className="panel-body">
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleFilterFacility.bind(this, 'Free WiFi')} />
                          <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <span className="crt">WiFi</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleFilterFacility.bind(this, 'Outdoor pool')} />
                          <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <span className="crt">Outdoor Pool</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleFilterFacility.bind(this, 'Free self parking')}/>
                          <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <span className="crt">Parking</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleFilterFacility.bind(this, 'Laundry facilities')}/>
                          <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <span className="crt">Laundry</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleFilterFacility.bind(this, 'Restaurant')}/>
                          <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <span className="crt">Restaurant</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleFilterFacility.bind(this, '24-hour front desk')}/> <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <span className="crt">24-Hour Front Desk</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleFilterFacility.bind(this, 'Indoor pool')} />
                          <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <span className="crt">Indoor Pool</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleFilterFacility.bind(this, 'Daily housekeeping')}/> <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <span className="crt">Daily housekeeping</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleFilterFacility.bind(this, 'Fitness facilities')}/> <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <span className="crt">Fitness Center</span>
                        </label>
                      </div>
                      <div className="checkbox">
                        <label>
                          <input type="checkbox" onClick={this.handleFilterFacility.bind(this, 'Meeting rooms 12')}/> <span className="cr"><i className="cr-icon glyphicon glyphicon-ok"></i></span>
                          <span className="crt"> Meeting Facilities</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.props.hotelList == null || this.props.hotelList.length == 0 &&
          <div className="col-md-8">
            <div className="progress">
              <div className="progress-bar progress-bar-warning" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style={{ width: `${this.state.percent}%`, background: '#ffb000' }}>
                <span className="sr-only">{this.state.percent}% Complete</span>
              </div>
            </div>

          </div>
        }
        {(this.state.percent <= 90 && this.state.showHotelList.length == 0) &&
          <div className="col-md-8">
            {[...Array(parseInt(8))].map((x, i) => (
            <div className="hotel-card">
              <div className="row">
                <div className="col-md-4" style={{paddingRight:0}}>
                  <div className="animate-flicker3"></div>
                </div>
                <div className="col-md-8" style={{paddingRight:0}}>
                  <div className="animate-flicker4"></div>
                  <div className="animate-flicker4"></div>
                  <div className="animate-flicker4"></div>
                </div>
              </div>
            </div>
            ))}
          </div>
        }
        {this.state.percent > 90 && this.state.showHotelList.length == 0 &&
          <div style={{textAlign:'center'}}>
            <img src="/img/notfound.png" /><br/><br/>
            <p style={{color:'#888'}}>Hotels Not Found</p>
          </div>
        }
        {(this.state.showHotelList !== null && this.state.showHotelList.length > 0) &&
          <div className="col-md-8">
            {this.state.showHotelList.map((item, index) => (
              <HotelListCard item={item} duration={this.props.duration} room={this.props.room} index={index} />
            ))
            }
            <ReactPaginate previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={<a href="">...</a>}
              breakClassName={"break-me"}
              pageCount={Math.ceil((this.state.filteredhotelList !== null) ? this.state.filteredhotelList.length / 30 : 1)}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={this.handlePageClick}
              containerClassName={"pagination"}
              subContainerClassName={"pages pagination"}
              activeClassName={"active"} />
              <div className="clear"></div>
              <p className="page-sm pull-left">{this.props.destination}: {this.props.hotelList.length} hotel found</p>
              <div className="alert alert-info info-sm pull-right" role="alert">
                Not what you're looking for?<br/>
                <Link to="/">you can search again.</Link>
              </div>
              <div className="clear"></div>
          </div>
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  hotelList: state.searchHotel.hotelList.hotels,
  totalPage: state.searchHotel.hotelList.totalPage,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getHotelList
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HotelList)
