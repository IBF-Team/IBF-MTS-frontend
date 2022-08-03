import React from "react";
import {Link, useNavigate} from "react-router-dom";



function Contact() {
    return(
        <div>
            <Link to={'/home'}>
                    <button className="back-to-home" style={{margin: 20}}> Back to Home </button>
            </Link>
            <h1 style={{color: 'DarkKhaki', textAlign: "center"}}> Contact Us</h1>
            <p style={{color: 'DarkKhaki', fontSize: 20, fontWeight: "bold"}}> Phone Number: 
            <a style={{color: 'DarkKhaki', marginLeft: 20, fontSize: 20, fontWeight: "normal"}} 
            href="tel:1 (317) 269-2415">+1 (317) 269-2415</a></p>
             <p style={{color: 'DarkKhaki', fontSize: 20, fontWeight: "bold"}}> E-Mail:
             <a style={{color: 'DarkKhaki', marginLeft: 20, fontSize: 20, fontWeight: "normal"}} 
             href="mailto:info@inbf.org" class="center-text">info@inbf.org</a></p>
            
        </div>
    )
}

export default Contact;