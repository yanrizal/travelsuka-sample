import React from 'react'

class ContactUs extends React.Component {

  componentDidMount(){
    window.scrollTo(0, 0);
  }

  render(){

  return (
	<div style={{marginBottom:0,background:'#FFF'}}>
		<div className="top-book-st">
            <div className="container">
            <div className="row">
            <div className="col-md-12">
              <h1>Contact Us Travelsuka</h1>
            </div>
            </div>
            </div>
      </div>
	  <div className="container" style={{width:'970px'}}>
       <div class="row">
    <div class="col-sm-12">
        <ul style={{marginTop:'20px',listStyleType:'decimal'}} className="indent-htb">
       <li><b>Layanan Pelanggan Travelsuka</b>
         <p class="normal-weight">Hubungi Layanan Pelanggan kami di:
       <a href="tel:+62-21-2929-5300"> 021 2929 5300<br/>
       </a>Email kami di <span><a href="mailto:cs@mykaha.com?Subject=Hello%20again" target="_top">cs@travelsuka</a></span>.<br/>
       Petugas Layanan Pelanggan kami akan dengan senang hati melayani Anda.</p>
       </li>

       <li><b>Alamat Kami</b>
         <p className="normal-weight">
       Jl. Pinang Emas III No. E1 - E2 Pondok Indah, Jakarta 12310 - Indonesia.</p></li></ul>
    </div>
    
    
  </div>
	    <br/><br/><br/><br/><br/><br/><br/>
	  </div>
  	</div>
    )}
}

export default ContactUs
