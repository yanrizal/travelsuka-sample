import React from 'react'
import moment from 'moment';
import formatRp from '../../custom/formatRp';
import formatDuration from '../../custom/formatDuration';
import { Link } from 'react-router-dom';
import { history } from '../../store';
import queryString from 'query-string';
import { sessionId } from '../../config';
import { Tooltip } from 'react-tippy';

class HotelListCard extends React.Component {

  state = {
    
  }

  handleChooseHotel = (ct, name, cd, e) => {
    const parsed = queryString.parse(window.location.search);
    const payload = {
      roomCode: "",
      oldPrice: "",
      paxPassport: "CO0189",
      destCountryCode: parsed.destCountryCode,
      destCityCode: parsed.destCityCode,
      hotelCode: cd,
      checkInDate: moment(parsed.startDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      checkOutDate: moment(parsed.endDate, 'DD-MM-YYYY').format('YYYY-MM-DD'),
      bedType: "Empty",
      numberOfResults: 0,
      page: 0,
      room: parsed.room,
      adultCount: parsed.adultCount,
      childCount: parsed.childCount,
      sessionId: sessionId
    }
    const stringified = queryString.stringify(payload);
    var win = window.open(`/hotel/detail/${ct}/${name}${window.location.search}&code=${cd}`, '_blank');
    win.focus();
    //history.push(`/hotel/detail/${ct}/${name}${window.location.search}&code=${cd}`);
  }

  render() {
    const { item, duration, room, index } = this.props;
    const slug = item.hotelName.replace(/ /g,"-");
    return (
      <div className="hotel-card">
        <div className="row">
        <div className="col-md-5" style={{paddingRight:0}}>
          <div className="img-hotel" style={{overflow:'hidden',height:'245px',width:'250px'}}>
            <img src={item.heroImage} style={{height:'245px',minWidth:'250px'}}/>
            <caption>
                <div class="media">
                  <div class="media-left">
                    {/*<div className="score">
                      {item.rating}/5
                    </div>*/}
                  </div>
                  <div class="media-body">
                  <div className="pull-left">
                    <h4 class="media-heading">{item.availType}</h4>
                    <p>{item.tripAdvisorReviewCount} reviews</p>
                    </div>
                    <div className="pull-right">
                      {item.facility.map((item) => {
                        //console.log(item.facility_name)
                        if(item.facility_name.trim() === 'Free breakfast') {
                          return (
                            <p className="bfi">Breakfast Included</p>
                          )
                        } 
                      })
                      
                      }
                    </div>
                  </div>
                </div>
            </caption>
          </div>
        </div>
        <div className="col-md-4 hotel-info" style={{marginLeft:'-35px'}}>
          <h3>{item.hotelName}</h3>
          <p class="loc"><span className="glyphicon glyphicon-map-marker"></span>&nbsp;{item.cityName}, {item.countryName}</p>
          {item.tripAdvisorRatingUrl &&
          <img width="80" src={item.tripAdvisorRatingUrl} style={{display:'block',marginBottom:'10px'}}/>
          }

          {/*<img width="80" src={`https://www.tripadvisor.com/img/cdsi/img2/ratings/traveler/${item.tripAdvisorRating}-26258-5.svg`}/>*/}
          {/*<img src="/img/tooltip.png"/>&nbsp;*/}
          {[...Array(parseInt(item.rating))].map((x, i) => (
          <svg fill="orange" stroke="none" viewBox="0 0 15 12" className="star" height="20" stroke-linecap="round" width="20"><g transform="translate(-0.133333,-1)"><path d="M7.62065263,11.1718057 L4.09190471,12.9302233 C3.59746349,13.1766093 3.27461245,12.9454386 3.37582363,12.3861087 L4.04155097,8.70705634 L1.20404148,6.08542085 C0.794471432,5.70701035 0.901391279,5.33979253 1.45149824,5.26402626 L5.40864616,4.71900805 L7.16232346,1.35099122 C7.41545167,0.864847003 7.824788,0.862800476 8.07898181,1.35099122 L9.83265911,4.71900805 L13.789807,5.26402626 C14.3360437,5.33925947 14.448558,5.70541735 14.0372638,6.08542085 L11.1997543,8.70705634 L11.8654816,12.3861087 C11.9644422,12.9330009 11.6363949,13.1728984 11.1494006,12.9302233 L7.62065263,11.1718057 Z"></path></g></svg>
          ))}
          <div className="clear"></div>
          <div style={{margin: '10px 0'}}>
          {item.facility.map((item, index) => {
              //console.log(item.facility_name)

              if(item.facility_name.trim() === 'Free self parking') {
                return (
                  <Tooltip
                    title="Free self parking"
                    position="top"
                    trigger="mouseenter"
                    arrow="true"
                  >
                    <img src="/img/f1.png"/>
                  </Tooltip>
                )
              }
              if(item.facility_name.trim() === 'Free WiFi' && item.type.trim() === 'PropertyAmenity') {
                return (
                  <Tooltip
                    title="Free WiFi"
                    position="top"
                    trigger="mouseenter"
                    arrow="true"
                  >
                    <img src="/img/f2.png" style={{marginTop:'2px'}} />
                  </Tooltip>
                 
                )
              } 
              if(item.facility_name.trim() === 'Laundry facilities') {
                return (
                  <Tooltip
                    title="Laundry facilities"
                    position="top"
                    trigger="mouseenter"
                    arrow="true"
                  >
                    <img src="/img/f3.png"/>
                  </Tooltip>
                )
              }  
            })
            
            }
            
          </div>
          {item.description !== null &&  
          <span className="shd">Short Description</span>
          }
          {item.description === null &&  
          <span className="shd">Location Name</span>
          }
          {item.description !== null &&
          <p className="sdp">{item.description}</p>
          }
          {item.description === null &&
          <p className="sdp">{item.locationName}</p>
          }
        </div>
        <div className="col-md-3 hcd" style={{marginLeft:'30px',paddingLeft:'0'}}>
          <div className="price-for pull-right hidden-xs hidden-sm">
            Price for 1 Nights
          </div>
          {item.roomsCategory !== null &&
            <span className="price-net">Rp {formatRp(item.roomsCategory[0].grossPrice)}</span>
          }<br/>
          {item.roomsCategory !== null &&
            <button type="button" onClick={this.handleChooseHotel.bind(this, (item.countryName !== null)? item.countryName.toLowerCase(): '-', slug.toLowerCase(), item.hotelCode)} 
            className="btn btn-choose">Choose</button>
          }
          {item.roomsCategory == null &&
            <button type="button"
            className="btn btn-choose">Sold Out</button>
          }
          <div className="clear"></div>
          {/*item.roomsCategory !== null &&
          <a data-toggle="collapse" href={`#collapse-${index}`} aria-expanded="false" 
          aria-controls={`collapse-${index}`}>price detail</a>
          */}
        </div>
        <div className="clear"></div>
        <div className="col-md-12">
        <div className="collapse" id={`collapse-${index}`}>
          {item.roomsCategory !== null &&
          <ul className="price-hotel-col">
            {[...Array(duration)].map((x, i) => (
              <li><span>Night(s) {i+1}</span>{` Rp ${formatRp(item.roomsCategory[0].grossPrice)}`}</li>
            ))}
          </ul>
          }
          <hr/>
          {item.roomsCategory !== null &&
          <p>Total Payment: {formatRp(duration * item.roomsCategory[0].grossPrice *room)}</p>
          } 
        </div>  
        </div>
        </div>
      </div>
    );
  }
}

export default HotelListCard
