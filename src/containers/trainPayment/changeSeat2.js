import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { getSeatMap, postManualSeat } from '../../modules/searchTrain';
import { snapTokenRequest, saveOfflinePayment, addDiscount, removeDiscount } from '../../modules/auth';
import moment from 'moment';
import formatRp from '../../custom/formatRp';
import { Link } from 'react-router-dom';
import ToggleButton from 'react-toggle-button';
import { history } from '../../store';
import Modal from 'react-responsive-modal';
import snap from 'snap';
import { sessionId } from '../../config';
import {seats} from '../../custom/seat';
import _ from 'lodash';

class ChangeSeat2 extends React.Component {

  state = {
    seatData: {
      Wagons: [
        {
          Seats:[{},{},{},{},{},{seatCode:''}]
        }
      ]
    },
    seat: [],
    selected: 0,
    wagonIdSelected: '',
    //seatData: seats[0],
    selected: 0,
    loading: true,
    passenger: 1,
    passengerDetails: [],
    originPassengerDetails: [],
    people: 0,
  }

  componentDidMount(){
    const { bookingSummary } = this.props;
    const bkSummary = bookingSummary.bookingsSummary[0];
    const bkSummary2 = (bookingSummary.bookingsSummary.length > 1) ? bookingSummary.bookingsSummary[1] : bookingSummary.bookingsSummary[0];
    
    this.setState({
      loading:true,
    })
    this.props.getSeatMap({
      sessionId: sessionId,
      transactionId: bookingSummary.transactionId
    }).then((result) => {
      //console.log(bkSummary2.passengerDetails)
      const seat = result.data.seatMap[1]
      const wagons = seat.Wagons
      const sortedWagons = _.sortBy(wagons, [function(o) { return `${o.WagonId}-${o.WagonNo}` }]);
      //console.log(sortedWagons)
      seat.Wagons = sortedWagons;
      //const pD = this.state.originPassengerDetails.concat(bkSummary2.passengerDetails);
      //console.log(pD,'pd')

      this.setState({
        passengerDetails: bkSummary2.passengerDetails,
        //originPassengerDetails: Object.assign({}, pD),
        passenger: bkSummary2.passengerDetails.length,
        seatData: seat,
        loading: false,
        wagonIdSelected: seat.Wagons[0].WagonId,
      },() => {
        bkSummary2.passengerDetails.map((item,index) => {
          const newSeat = this.state.seat;
          const idx = sortedWagons.findIndex((o) => {
            let str = '';
            if (o.WagonId.indexOf('EKO') !== -1) {
              str = 'EKO'
            }
            if (o.WagonId.indexOf('BIS') !== -1) {
              str = 'BIS'
            }
            if (o.WagonId.indexOf('PREMIUM') !== -1) {
              str = 'PREMIUM'
            }
            if (o.WagonId.indexOf('EKS') !== -1) {
              str = 'EKS'
            }
            //console.log(o.WagonId, str, item.seatInfo[0].WagonId)
            return item.seatInfo[0].WagonId.indexOf(str) !== -1 && o.WagonNo == item.seatInfo[0].WagonNo;
          });
          const seat = {
            seatCode:item.seatInfo[0].SeatCode,
            seatNumber:item.seatInfo[0].SeatNumber,
            wagon:idx,
            people: index
          }
          newSeat.push(seat);
          this.setState({
            [`${idx}-${item.seatInfo[0].SeatCode}/${item.seatInfo[0].SeatNumber}`]: 'active',
            seat: newSeat
          })
        })
      })
    });
  }

  checkSeatInfo = e => {
    const idx = this.state.seat.filter((item) => {
      return item.people == this.state.people
    })
    //console.log('ch', idx)
    if (idx.length > 0) {
      //alert('ada')
      return true;
    }
    return false;
  }

  alertSeatInfo = e => {
    const idx = this.state.seat.filter((item) => {
      return item.people == this.state.people
    })
    //console.log('ch', idx)
    if (idx.length > 0) {
      alert('harap kurangi jumlah kursi terpilih sebelum memilih kursi yang baru')
      return true;
    }
    return false;
  }

  checkSeatEmpty = (seatCode, seatNumber, selected, people, e) => {
    //console.log(this.state.seat)
    const idx = this.state.seat.filter((item) => {
      return (item.seatCode == seatCode && item.seatNumber == seatNumber && item.wagon == selected && item.people !== people)
    })
    //console.log('ch', people, idx)
    if (idx.length > 0) {
      //alert('ada')
      return true;
    }
    return false;
  }

  handleChooseSeat = (seatCode, seatNumber, available, e) => {
    //console.log('originPassengerDetails',this.state.originPassengerDetails)
    if (available && this.state.seat.length < this.state.passenger) {
      //const currentSeat = this.state.seat;
    }
    const checkSeatInfo = this.checkSeatInfo()
    const checkSeatEmpty = this.checkSeatEmpty(seatCode, seatNumber, this.state.selected, this.state.people)
    if (this.state[`${this.state.selected}-${seatCode}/${seatNumber}`] !== 'active' && available 
      && this.state.seat.length < this.state.passenger && !checkSeatInfo) {
      const seat = {
        seatCode,
        seatNumber,
        wagon:this.state.selected,
        people: this.state.people
      }
      //console.log(seatCode, seatNumber, this.state.seatData.Wagons)
      const passengerDetails = this.state.passengerDetails;
      const newSeat = this.state.seat;
      passengerDetails[this.state.people].seatInfo[0].SeatNumber = seatNumber;
      passengerDetails[this.state.people].seatInfo[0].SeatCode = seatCode;
      passengerDetails[this.state.people].seatInfo[0].WagonNo = this.state.seatData.Wagons[this.state.selected].WagonNo;
      passengerDetails[this.state.people].seatInfo[0].WagonId = this.state.wagonIdSelected;

      newSeat.push(seat);
      //console.log(newSeat)
      this.setState({
        passengerDetails: passengerDetails,
        [`${this.state.selected}-${seatCode}/${seatNumber}`]: 'active',
        seat: newSeat
      })
    } else {
      const currentSeat = this.state.seat;
      const index = currentSeat.findIndex((item) => {
        return `${item.wagon}-${item.seatCode}/${item.seatNumber}` === `${this.state.selected}-${seatCode}/${seatNumber}`;
      });
      if (index > -1){
        currentSeat.splice(index, 1);
      }
      const passengerDetails = this.state.passengerDetails;
      // const originPassengerDetails = this.state.originPassengerDetails
      // console.log(originPassengerDetails)
      // passengerDetails[index].seatInfo[0].SeatNumber = originPassengerDetails[index].seatInfo[0].SeatNumber;
      // passengerDetails[index].seatInfo[0].SeatCode = originPassengerDetails[index].seatInfo[0].SeatCode;
      // passengerDetails[index].seatInfo[0].WagonId = originPassengerDetails[index].seatInfo[0].WagonId;
      //console.log(index)
      this.setState({
        passengerDetails: passengerDetails,
        seat: currentSeat,
        [`${this.state.selected}-${seatCode}/${seatNumber}`]: ''
      },() => {
        this.alertSeatInfo()
      })
    }
  }

  handleChangeSeat = e => {
    const { bookingSummary, payloadSearch, selectedFlight, selectedFlight2 } = this.props;
    let departureSeats = [];
    let returnSeats = [];
    const bkSummary = bookingSummary.bookingsSummary[0];
    const bkSummary2 = bookingSummary.bookingsSummary[1];
    console.log(selectedFlight2)
    bkSummary.passengerDetails.map((item) => {
      departureSeats.push({
        "JourneySellKey": `${bookingSummary.transactionId}#${bkSummary.bookingCode}#${bkSummary.flightJourneys[0].departureAirport.code}#${bkSummary.flightJourneys[0].arrivalAirport.code}#${selectedFlight.flightSegments[0].flightDesignator.flightNumber}`,
        "SegmentSellKey": null,
        "WagonId": item.seatInfo[0].WagonId,
        "WagonNo": item.seatInfo[0].WagonNo,
        "SeatNumber": item.seatInfo[0].SeatNumber,
        "SeatCode": item.seatInfo[0].SeatCode,
        "Origin": bkSummary.flightJourneys[0].departureAirport.code,
        "Destination": bkSummary.flightJourneys[0].arrivalAirport.code,
        "CarrierNo": selectedFlight.flightSegments[0].flightDesignator.flightNumber,
        "DepartureDate": null
      })
    })
    //console.log(selectedFlight, this.state.seatData, this.state.wagon)
    this.state.seat.map((item) => {
      const wagonNum = this.state.seatData.Wagons[parseInt(item.wagon)].WagonNo
      const wagonNumId = this.state.seatData.Wagons[parseInt(item.wagon)].WagonId
      returnSeats.push({
        "JourneySellKey": `${bookingSummary.transactionId}#${bkSummary2.bookingCode}#${bkSummary2.flightJourneys[0].departureAirport.code}#${bkSummary2.flightJourneys[0].arrivalAirport.code}#${selectedFlight2.flightSegments[0].flightDesignator.flightNumber}`,
        "SegmentSellKey": null,
        "WagonId": wagonNumId,
        "WagonNo": wagonNum,
        "SeatNumber": item.seatNumber,
        "SeatCode": item.seatCode,
        "Origin": bkSummary2.flightJourneys[0].departureAirport.code,
        "Destination": bkSummary2.flightJourneys[0].arrivalAirport.code,
        "CarrierNo": selectedFlight2.flightSegments[0].flightDesignator.flightNumber,
        "DepartureDate": null
      })
    });
    const payload = {
      "transactionNo": bookingSummary.transactionId,
      "departureSeats": departureSeats,
      "returnSeats": returnSeats,
      "sessionId": sessionId,
      "platform": null,
      "appVersion": null
    }
    console.log(payload)
    this.props.postManualSeat(payload).then((res) => {
      //console.log(res);
      if (res.data.errors[0].type === 'ERROR') {
        alert(res.data.errors[0].message);
      } else {
        history.push(`/kereta-api/payment/${bookingSummary.transactionId}`);
      }
      
    })
  }

  handleCancel = e => {
    const { bookingSummary } = this.props;
    history.push(`/kereta-api/payment/${bookingSummary.transactionId}`);
  }

  onValueChange = e => {
    //console.log(e)
    this.setState({
      selected: e.target.value,
      wagon: this.state.seatData.Wagons[e.target.value],
      wagonIdSelected: this.state.seatData.Wagons[e.target.value].WagonId
    })
  }

    setPeople(event) {
    this.setState({
      people: parseInt(event.target.value)
    })
  }

  render() {
    const { bookingSummary, twoway } = this.props;
    const bkSummary = bookingSummary.bookingsSummary[0];

    const seat = this.state.seatData
    return (
      <div className="jumbotron" style={{marginBottom:0,background:'#FFF'}}>
      <div className="top-book">
        <div className="container">
        <div className="row">
        <div className="col-md-12">
          <h1 style={{marginLeft:0}}>Change Seat</h1>
        </div>
        </div>
        </div>
      </div>
      <div className="container">
        <div className="row" style={{paddingTop:0}}>
        <br/>
        <div className="col-md-3">
        {this.state.loading &&
          <span>Loading...</span>
        }
        {(seat.Wagons[this.state.selected].Seats[5].SeatCode === 'A') && !this.state.loading &&
        <div style={{width:'140px'}}>
          <div style={{...styles.seat,border:'none'}}>
            <span style={{marginTop:'2px',marginLeft:'6px',display:'block',color:'#000',fontSize:'12px'}}>A</span>
          </div>
          <div style={{...styles.seat,border:'none'}}>
            <span style={{marginTop:'2px',marginLeft:'6px',display:'block',color:'#000',fontSize:'12px'}}>B</span>
          </div>
          <div style={{width:25,height:25,float:'left'}}>
          </div>
           <div style={{...styles.seat,border:'none'}}>
            <span style={{marginTop:'2px',marginLeft:'6px',display:'block',color:'#000',fontSize:'12px'}}>C</span>
          </div>
          <div style={{...styles.seat,border:'none'}}>
            <span style={{marginTop:'2px',marginLeft:'6px',display:'block',color:'#000',fontSize:'12px'}}>D</span>
          </div>
          <div className="clear"></div>
          {seat.Wagons[this.state.selected].Seats.map((item, index) => {
            if (item.SeatCode === '') {
              return (
                <div style={{width:25,height:25,float:'left'}}>

                </div>
              )
            }
            return (
              <div onClick={this.handleChooseSeat.bind(this, item.SeatCode, item.SeatNumber, item.Available)} style={{...styles.seat,
                backgroundColor:(item.Available)?'#B73550':'#d9e8f3',...styles[this.state[`${this.state.selected}-${item.SeatCode}/${item.SeatNumber}`]]}}>
                <span style={{marginTop:'2px',marginLeft:'6px',display:'block',color:'#FFF',fontSize:'12px'}}>{item.RowNumber}</span>
              </div>
            )
          
          })}
          <div className="clear"></div>
        </div>
        }
        {seat.Wagons[this.state.selected].Seats[5].SeatCode === 'E' &&
        <div style={{width:'170px'}}>
          <div style={{...styles.seat,border:'none'}}>
            <span style={{marginTop:'2px',marginLeft:'6px',display:'block',color:'#000',fontSize:'12px'}}>A</span>
          </div>
          <div style={{...styles.seat,border:'none'}}>
            <span style={{marginTop:'2px',marginLeft:'6px',display:'block',color:'#000',fontSize:'12px'}}>B</span>
          </div>
         
           <div style={{...styles.seat,border:'none'}}>
            <span style={{marginTop:'2px',marginLeft:'6px',display:'block',color:'#000',fontSize:'12px'}}>C</span>
          </div>
           <div style={{width:25,height:25,float:'left'}}>
          </div>
          <div style={{...styles.seat,border:'none'}}>
            <span style={{marginTop:'2px',marginLeft:'6px',display:'block',color:'#000',fontSize:'12px'}}>D</span>
          </div>
          <div style={{...styles.seat,border:'none'}}>
            <span style={{marginTop:'2px',marginLeft:'6px',display:'block',color:'#000',fontSize:'12px'}}>E</span>
          </div>
          <div className="clear"></div>
          {seat.Wagons[this.state.selected].Seats.map((item, index) => {
            if (item.SeatCode === '') {
              return (
                <div style={{width:25,height:25,float:'left'}}>

                </div>
              )
            }
            return (
              <div onClick={this.handleChooseSeat.bind(this, item.SeatCode, item.SeatNumber, item.Available)} 
              style={{...styles.seat,backgroundColor:(item.Available)?'#B73550':'#d9e8f3',
                  ...styles[this.state[`${this.state.selected}-${item.SeatCode}/${item.SeatNumber}`]]}}>
                <span style={{marginTop:'2px',marginLeft:'6px',display:'block',color:'#FFF',fontSize:'12px'}}>{item.RowNumber}</span>
              </div>
            )
          
          })}
          <div className="clear"></div>
        </div>
        }
        </div>
        <div className="col-md-3">
          <div style={{...styles.seat,backgroundColor:'#d9e8f3',}}>
          </div>
          <span style={{float:'left'}}>Not Available</span><div className="clear"/>
          <div style={{...styles.seat,backgroundColor:'#B73550',}}>
          </div>
          <span style={{float:'left'}}>Available</span><div className="clear"/>
          <div style={{...styles.seat,backgroundColor:'#00A563',}}>
          </div>
          <span style={{float:'left'}}>Choosen seat</span><div className="clear"/><br/>
          <div onChange={this.setPeople.bind(this)}>
          {this.state.passengerDetails.map((item, index) => {
            let name2 = ''
            if (item.middleName !== "") {
              const mn = item.middleName.split(" ")
              name2 = mn[0]
            } else {
              name2 = item.lastName
            }
            return (
            <div>
            {item.paxType === 'ADT' &&
            <div style={{marginBottom:10}}>
              <input type="radio" name="name" value={parseInt(index)} checked={(this.state.people == index)} /> {index + 1}. {item.firstName} {name2} {item.seatInfo[0].WagonId} {item.seatInfo[0].WagonNo}/{item.seatInfo[0].SeatNumber}{item.seatInfo[0].SeatCode}<br/>
            </div>
            }
            </div>
            )
          }
          )}
          </div>
          {!this.state.loading &&
          <select className="form-control"
            value={this.state.selected}
            onChange={this.onValueChange}>
            {seat.Wagons.map((item,index) => (
            <option value={index} key={index}>{`${item.WagonId}-${item.WagonNo}`}</option>
            ))}
          </select>
          }
          <button onClick={this.handleChangeSeat} className="btn btn-choose" style={{width:'120px',padding:10}}>Change Seat</button>
          <button onClick={this.handleCancel} className="btn btn-choose" style={{width:'120px',padding:10,background:'#CCC',marginRight:10}}>Cancel</button>
        </div>
      </div>
      <br/><br/><br/><br/>  
      </div>
      </div>
    );
  }
}

const styles = {
  seat: {
    width: 23,
    height: 23,
    borderRadius: 5,
    border: '1px solid #FFF',
    marginBottom:10,
    float:'left',
    marginRight:5,
    color:'#FFF'
  },
  active: {
    backgroundColor: '#00A563',
  }
}

const mapStateToProps = state => ({
  bookingData: state.searchHotel.bookingData,
  ccPayload: state.auth.ccPayload,
  bookingSummary: state.searchFlight.bookingSummary,
  payloadSearch: state.searchTrain.payloadSearchTrain,
  bookingSummaryBefore: state.searchFlight.bookingSummaryBefore,
  selectedFlight: state.searchFlight.selectedFlight,
  selectedFlight2: state.searchFlight.selectedFlight2,
  seatInfo: state.searchTrain.seatInfo,
  adultCount: state.searchFlight.adultCount
})

const mapDispatchToProps = dispatch => bindActionCreators({
  getSeatMap,
  postManualSeat
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeSeat2)
