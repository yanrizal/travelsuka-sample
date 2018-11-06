import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-dates/initialize';
import 'react-tabs/style/react-tabs.css';
import HotelWidget from './hotelWidget';
import FlightWidget from './flightWidget';
import TrainWidget from './trainWidget';

class Widget extends React.Component {

  render() {
    return (
      <div className="wg">
        <Tabs>
          <TabList className="widget-tab">
            <Tab><img src="/img/flight.png" width="37"/>&nbsp;<span className="hidden-xs">Flight</span></Tab>
            <Tab><img src="/img/hotelwg.png" width="23"/>&nbsp;<span className="hidden-xs">Hotel</span></Tab>
            <Tab style={{marginRight:0}}><img src="/img/trainwg.png" width="25"/>&nbsp;<span className="hidden-xs">Train</span></Tab>
            {/*<Tab>Railink</Tab>*/}
          </TabList>
          <div className="widget">
          <TabPanel>
            <FlightWidget/>
          </TabPanel>
          <TabPanel>
            <HotelWidget/>
          </TabPanel>
          <TabPanel>
            <TrainWidget/>
          </TabPanel>
          </div>
        </Tabs>
      </div>
    );
  }

}

export default Widget