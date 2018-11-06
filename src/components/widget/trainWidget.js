import React from 'react';
import Select from "react-virtualized-select";
import { SingleDatePicker } from 'react-dates';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { startSearchTrain, getSearchTrain, postSearchTrain } from '../../modules/searchTrain';
import moment from 'moment';
import queryString from 'query-string';
import { history } from '../../store';
import { Translate } from "react-localize-redux";

class TrainWidget extends React.Component {

  state = {
    from: 'GMR',
    to: 'BD',
    adultCount: 1,
    infantCount: 0,
    childCount: 0,
    departureDate: moment().add(1, 'days'),
    returnDate: moment().add(2, 'days'),
    passengers: 'Adult 1, Infant 0',
    return: false,
    dropdown: 'dropdown-content',
  }

  componentDidMount() {
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
      cabin: this.state.seat,
    }
    const stringified = queryString.stringify(obj);
    history.push(`/kereta-api/search?${stringified}`);
    //this.props.postSearchTrain(payload);
  }

  handleChangeTrain = (name, selectedOption) => {
    if (selectedOption !== null) {
      this.setState({ 
        [name]: selectedOption.value
      });
    }
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

  handleInc = (name, e) => {
    if (this.state['adultCount'] + this.state['childCount'] === 4) {
      if (name === 'infantCount' && (this.state['infantCount'] + 1) <= this.state['adultCount']) {
        this.setState({
          [name]: this.state[name] + 1
        })
      }
    }
    else if (name === 'infantCount' && (this.state['infantCount'] + 1) > this.state['adultCount']) {

    } else {
      this.setState({
        [name]: this.state[name] + 1
      })
    }
    setTimeout(() => {
      this.setState({
        passengers: 'Adult ' + (this.state.adultCount) + ', Infant ' + (this.state.infantCount)
      })
    }, 50)

  }

  handleDec = (name, e) => {
    if (this.state[name] !== 0) {
      if (name === 'adultCount' && this.state['adultCount'] === 1) {

      }
      else if (name === 'adultCount' && (this.state['adultCount'] - 1) < this.state['infantCount']) {

      }
      else {
        this.setState({
          [name]: this.state[name] - 1
        })
      }

      setTimeout(() => {
        this.setState({
          passengers: 'Adult ' + (this.state.adultCount) + ', Infant ' + (this.state.infantCount)
        })
      }, 50)
    }
  }

  handleBlur = e => {
    this.setState({
      dropdown: 'dropdown-content'
    })
  }

  handleFocus = e => {
    this.setState({
      dropdown: 'dropdown-content show'
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
              <div className="col-md-12">
                <h3 style={{ margin: '20px 0 5px', fontWeight: '600' }}><Translate id="home.tWidget"/></h3>
                <p style={{ margin: 0 }}>and new deals every day</p>
                <ul className="nav nav-pills widget-pills">
                <li role="presentation" className={(this.state.return) ? "" : "active"} 
                onClick={this.handleCheckReturn.bind(this,false)}><a href="#"><Translate id="home.oneWay"/></a></li>
                <li role="presentation" className={(!this.state.return) ? "" : "active"} 
                onClick={this.handleCheckReturn.bind(this,true)}><a href="#"><Translate id="home.return"/></a></li>
              </ul>
              </div>
              <div className="col-md-3" style={{paddingRight:'5px'}}>
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
              <div className="col-md-3" style={{paddingRight:'5px',paddingLeft:0}}>
                <span className="glyphicon glyphicon-map-marker mark-wd mark-fl" style={{left:'8px'}}></span>
                <Select
                  name="to"
                  value={this.state.to}
                  placeholder="To"
                  onChange={this.handleChangeTrain.bind(this, 'to')}
                  options={trainsValue}
                  className="sel-wg"
                />  
              </div>
              <div className="col-md-3 date-wg" style={{paddingRight:'5px',paddingLeft:0}}>
                <span className="glyphicon glyphicon-calendar ic-cal"></span>
                <SingleDatePicker
                  displayFormat="DD MMM YYYY"
                  date={this.state.departureDate} // momentPropTypes.momentObj or null
                  onDateChange={departureDate => this.setState({ departureDate, returnDate: moment(departureDate).add(0, 'days') })} // PropTypes.func.isRequired
                  focused={this.state.focused} // PropTypes.bool
                  isOutsideRange={(day) => {
                    return day.isBefore(moment(this.state.departureDate).subtract(2, 'days')) || day.isAfter(moment().add(91, 'days'))
                  }
                  }
                  onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                />
              </div>
              <div className="col-md-3 date-wg" style={{paddingLeft:0}}>
                <span className="glyphicon glyphicon-calendar ic-cal"></span>
                <SingleDatePicker
                  displayFormat="DD MMM YYYY"
                  date={this.state.returnDate} // momentPropTypes.momentObj or null
                  onDateChange={returnDate => this.setState({ returnDate })} // PropTypes.func.isRequired
                  focused={this.state.focused2} // PropTypes.bool
                  onFocusChange={({ focused: focused2 }) => this.setState({ focused2 })} // PropTypes.func.isRequired
                  isOutsideRange={(day) => {
                    return day.isBefore(this.state.departureDate) || day.isAfter(moment().add(91, 'days'))
                  }
                  }
                  disabled={(this.state.return) ? false : true}
                />  
              </div>
              <div className="clear"></div>
            </div>
            <div className="row">
                        <div className="col-md-6 fl-psg" style={{paddingRight:'5px'}}>
            <div className="form-group" style={{ position: 'relative' }}>
              <span className="glyphicon glyphicon-user user-wd" ></span>
              <input onFocus={this.handleFocus}
                value={this.state.passengers}
                onChange={() => { }}
                type="text" className="form-control input-wg" placeholder="Passengers" />
              <div className={this.state.dropdown} onBlur={this.handleBlur} tabIndex="1" style={{width:'350px'}}>
                <div className="row">
                  <div className="col-md-6">
                    <span>Adult</span>
                  </div>
                  <div className="col-md-6">
                    <div>
                      <span className="dec" onClick={this.handleDec.bind(this, 'adultCount')}>-</span>
                      <span className="count" style={{width:'40px',display:'inlineBlock',paddingLeft:'18px'}}>{this.state.adultCount}</span>
                      <span className="inc" onClick={this.handleInc.bind(this, 'adultCount')}>+</span>
                    </div>
                  </div>
                </div>
                {/*<div className="row">
                  <div className="col-md-6">
                    <span>Child</span>
                  </div>
                  <div className="col-md-6">
                    <div>
                      <span className="dec" onClick={this.handleDec.bind(this, 'childCount')}>-</span>
                      <span className="count" style={{width:'40px',display:'inlineBlock',paddingLeft:'15px'}}>{this.state.childCount}</span>
                      <span className="inc" onClick={this.handleInc.bind(this, 'childCount')}>+</span>
                    </div>
                  </div>
                </div>*/}
                <div className="row">
                  <div className="col-md-6">
                    <span>Infant {`(<= 3 tahun)`}</span>
                  </div>
                  <div className="col-md-6">
                    <div>
                      <span className="dec" onClick={this.handleDec.bind(this, 'infantCount')}>-</span>
                      <span className="count" style={{width:'40px',display:'inlineBlock',paddingLeft:'15px'}}>{this.state.infantCount}</span>
                      <span className="inc" onClick={this.handleInc.bind(this, 'infantCount')}>+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
              {/*<div className="col-md-6" style={{paddingRight:'5px'}}>
                <span className="glyphicon glyphicon-user user-wd2" ></span>
                <Select
                  name="form-field-name"
                  value={this.state.adultCount}
                  className="sel-wg"
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
              <div className="col-md-6" style={{paddingLeft:0}}>
                <span className="glyphicon glyphicon-user user-wd2" style={{left:'11px'}}></span>
                <Select
                  name="form-field-name"
                  value={this.state.infantCount}
                  className="sel-wg"
                  onChange={this.handleChangeTrain.bind(this, 'infantCount')}
                  options={[
                    { value: '1', label: '1 Infant' },
                    { value: '2', label: '2 Infant' },
                    { value: '3', label: '3 Infant' },
                    { value: '4', label: '4 Infant' },
                    { value: '5', label: '5 Infant' },
                  ]}
                />  
              </div>*/}
            </div>
            <button type="button" className="btn btn-search" onClick={this.handleSearchTrain}>
            <span className="glyphicon glyphicon-search" style={{marginRight:'5px',marginTop:'3px',float:'left'}}></span><Translate id="home.search"/></button>
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
  postSearchTrain
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TrainWidget)