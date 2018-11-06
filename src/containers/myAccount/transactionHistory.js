import React from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import { retreiveBookingFlight } from '../../modules/searchFlight';
import { retreiveBookingHotel } from '../../modules/searchHotel';
import { sessionId } from '../../config';

class TransactionHistory extends React.Component {

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

  render() {
    const { transactionData } = this.props;
    return (
      <div>
        <div className="jumbotron" style={{marginBottom:0}}>
          <div className="container">
            <div className="table-transaction">
            <table className="table">
             <thead>
                <tr>
                   <th>Transaction ID</th>
                   <th>Booking Code</th>
                   <th>Date</th>
                   <th>Guest/Pax</th>
                </tr>
             </thead>
             <tbody>
              {transactionData.map((item) => (
                <tr>
                   <th scope="row">{item.id}</th>
                   <td>{item.bookingCode}</td>
                   <td>{item.date}</td>
                   <td>{item.pax}</td>
                </tr>
              ))}
             </tbody>
          </table>
          </div>
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
)(TransactionHistory)
