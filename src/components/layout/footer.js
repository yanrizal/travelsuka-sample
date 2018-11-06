import React from 'react';
import { Link } from 'react-router-dom';

class Footer extends React.Component {

  render() {
    return (
      <footer>
        <div className="container">
          <div className="row">
	        <div className="col-md-9 col-sm-12 col-xs-12">
	          <p>
	          	{/*<a>About us</a>*/}
	          	<a>Flights</a>
	          	<a>Hotels</a>
	          	{/*<a>Train</a>
	          	<a>Affiliate</a>
	          	<a>Apps</a>*/}
	          	<Link to="/public/termofuse" target="_blank">Terms of use</Link>
	          	<Link to="/public/privacypolicy" target="_blank">Privacy policy</Link>
	          	{/*<a>Cookies</a>
	          	<a>Help</a>*/}
	          	<Link to="/public/contactus" target="_blank">Contact us</Link>
	          </p>
	        </div>
	          <div className="col-md-3 col-sm-12 col-xs-12">
	        	<div className="socmed">
	        	<a href="https://www.youtube.com/channel/UCvju1bMTtGHfJGel1_Vv4JA" target="_blank" style={{marginRight:0}}>
	        	  <img src="/img/yt.png"/>
	        	</a>
	        	{/*<img src="/img/fb.png"/>*/}
	        	<a href="https://Instagram.com/travelsuka" target="_blank" style={{marginRight:0}}>
	        	  <img src="/img/inst.png"/>
	        	</a>
	        	<a href="https://Twitter.com/travelsuka" target="_blank" style={{marginRight:0}}>
	        		<img src="/img/tw.png"/>
	        	</a>
	          </div>
	        </div>
	        <div className="clear"></div><br/><br/>
	        <div className="col-md-12">
	          <p className="cp">Copyright &copy; 2018 All rights reserved</p>
	          <p className="cp">Search flights, hotels and searches hundreds of other features at once to get you the information you need to make the right decisions travel.</p>
	        </div>
          </div>
          
        </div>
      </footer>
    );
  }

}

export default Footer;