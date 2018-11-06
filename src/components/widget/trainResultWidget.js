import React from 'react';
import Select from 'react-select';
import { SingleDatePicker } from 'react-dates';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { startSearchTrain, getSearchTrain } from '../../modules/searchTrain';
import { startSearchFlight, startSearchFlightTwoWay } from '../../modules/searchFlight';
import moment from 'moment';
import queryString from 'query-string';
import { history } from '../../store';
import { sessionId } from '../../config';

class TrainResultWidget extends React.Component {

  state = {
    adultCount: 1,
    infantCount: 0,
    childCount: 0,
    departureDate: moment().add(1, 'days'),
    returnDate: moment().add(2, 'days'),
    return: false,
  }

  componentDidMount(){
    const parsed = queryString.parse(window.location.search);
    this.setState({
      from: parsed.from,
      to: parsed.to,
      adultCount: parsed.adultCount,
      infantCount: parsed.infantCount,
      departureDate: moment(parsed.departureDate, 'DD-MM-YYYY'),
      returnDate: (parsed.return === 'true') ? moment(parsed.returnDate, 'DD-MM-YYYY') : moment(parsed.departureDate, 'DD-MM-YYYY').add(1, 'days'),
      return: (parsed.return === 'true') ? true : false,
    })
    this.props.getSearchTrain();
  }

  handleSearchTrain = e => {
    const obj = {
      from: this.state.from,
      to: this.state.to,
      adultCount: this.state.adultCount,
      childCount: this.state.childCount,
      infantCount: this.state.infantCount,
      departureDate: moment(this.state.departureDate).format('DD-MM-YYYY'),
      returnDate: (this.state.return) ? moment(this.state.returnDate).format('DD-MM-YYYY') : '',
      return: this.state.return,
    }
    
    const stringified = queryString.stringify(obj);
    history.push(`/kereta-api/search?${stringified}`);
    let payload = {
      departureAirport: {
        code: this.state.from
      },
      arrivalAirport: {
        code: this.state.to
      },
      departureDate: moment(this.state.departureDate, 'DD-MM-YYYY').format('MM-DD-YYYY'),
      returnDate: (this.state.return) ? moment(this.state.returnDate).format('DD-MM-YYYY') : '',
      promotionCode: "",
      currency: "IDR",
      airlines: [
        {
          code: "KAI"
        }
      ],
      noOfAdt: this.state.adultCount,
      noOfChd: this.state.childCount,
      noOfInf: this.state.infantCount,
      cabin: this.state.cabin,
      sessionId: sessionId,
      platform: "",
      appVersion: ""
    }
    //console.log(payload)
    if (this.state.return === 'true') {
      this.props.startSearchFlightTwoWay(payload, 0);
    } else {
      this.props.startSearchFlight(payload, 0);
    }
    this.props.handleChangeSearch({
      obj
    })
    //this.props.startSearchTrain(payload);
  }

  handleChangeTrain = (name, selectedOption) => {
    this.setState({ 
      [name]: selectedOption.value
    });
  }

  handleChangeDate = (date) => {
    this.setState({
      startDate: date
    });
  }

  handleCheckReturn = e => {
    this.setState({
      return: !this.state.return
    })
  }

  render() {
    const { trains } = this.props;
    const trainsValue = [];
    trains.map((item) => {
      Object.defineProperty(item, 'label', {
        value: `${item.name} ${item.code}`,
        writable: true
      });
      Object.defineProperty(item, 'value', {
        value: item.code,
        writable: true
      });
      trainsValue.push(item)
      return false;
    })

    return (
      <div>
            <div className="row">
              <div className="col-md-6">
                <span className="glyphicon glyphicon-map-marker mark-wd mark-fl"></span>
                <Select
                  name="origin"
                  value={this.state.from}
                  placeholder="From"
                  onChange={this.handleChangeTrain.bind(this, 'from')}
                  options={trainsValue}
                  className="sel-wg"
                />  
              </div>
              <div className="col-md-6">
                <span className="glyphicon glyphicon-map-marker mark-wd mark-fl" style={{left:'23px'}}></span>
                <Select
                  name="to"
                  value={this.state.to}
                  placeholder="To"
                  onChange={this.handleChangeTrain.bind(this, 'to')}
                  options={trainsValue}
                  className="sel-wg"
                />
              </div>
            </div>
            <div className="row">
              <h4 style={{marginTop:'20px',color:'#FFF',marginLeft:'15px'}}><input type="checkbox" onClick={this.handleCheckReturn}/>&nbsp;Return</h4>
              <div className="col-md-6 date-wg">
                <span className="glyphicon glyphicon-calendar ic-cal" style={{top:'22px',left:'27px'}}></span>
                <SingleDatePicker
                  displayFormat="DD MMM YYYY"
                  date={this.state.departureDate} // momentPropTypes.momentObj or null
                  onDateChange={departureDate => this.setState({ departureDate, returnDate: moment(departureDate).add(0, 'days') })} // PropTypes.func.isRequired
                  focused={this.state.focused} // PropTypes.bool
                  onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                />
              </div>
              <div className="col-md-6 date-wg">
                <span className="glyphicon glyphicon-calendar ic-cal" style={{top:'22px',left:'27px'}}></span>
                <SingleDatePicker
                  displayFormat="DD MMM YYYY"
                  date={this.state.returnDate} // momentPropTypes.momentObj or null
                  onDateChange={returnDate => this.setState({ returnDate })} // PropTypes.func.isRequired
                  focused={this.state.focused2} // PropTypes.bool
                  onFocusChange={({ focused: focused2 }) => this.setState({ focused2 })} // PropTypes.func.isRequired
                  isOutsideRange={(day) => day.isBefore(this.state.departureDate)}
                  disabled={(this.state.return) ? false : true}
                />  
              </div>
              <div className="clear"></div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <span className="glyphicon glyphicon-user user-wd2" style={{top:'31px'}}></span>
                <Select
                  name="form-field-name"
                  value={this.state.adultCount}
                  className="sel-wg"
                  style={{marginTop:'20px'}}
                  onChange={this.handleChangeTrain.bind(this, 'adultCount')}
                  options={[
                    { value: '1', label: '1 Adult' },
                    { value: '2', label: '2 Adult' },
                    { value: '3', label: '3 Adult' },
                    { value: '4', label: '4 Adult' },
                    { value: '5', label: '5 Adult' },
                  ]}
                />  
              </div>
              <div className="col-md-6">
                <span className="glyphicon glyphicon-user user-wd2" style={{left:'25px', top:'32px'}}></span>
                <Select
                  name="form-field-name"
                  value={this.state.infantCount}
                  className="sel-wg"
                  style={{marginTop:'20px'}}
                  onChange={this.handleChangeTrain.bind(this, 'infantCount')}
                  options={[
                    { value: '1', label: '1 Infant' },
                    { value: '2', label: '2 Infant' },
                    { value: '3', label: '3 Infant' },
                    { value: '4', label: '4 Infant' },
                    { value: '5', label: '5 Infant' },
                  ]}
                />  
              </div>
            </div><br/>
            <button type="button" className="btn change-btn" style={{marginTop:'10px',marginBottom:'20px'}} onClick={this.handleSearchTrain}>Search Train</button>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    trains: state.searchTrain.trains
  }
}

const mapDispatchToProps = dispatch => bindActionCreators({
  startSearchTrain,
  getSearchTrain,
  startSearchFlight,
  startSearchFlightTwoWay
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrainResultWidget)