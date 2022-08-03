import React, {useState, useEffect}from "react";
import { useNavigate } from 'react-router-dom';
// import userToken from "../../utils/storageUtils";
import { checkLogin, getUser, removeToken } from "../../utils/storageUtils.js";

function SessionExpired() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(checkLogin())
    useEffect(() => {
        setTimeout(() => {
            navigate('/login')
          }, 2000);
        
    }, []);
    
    return(
        <div className="home">
            <div><h1 style={center}> Login Session Expired!</h1>
                <h1 style={center}>Please Login Again...</h1>
               <h2 style={center}>Redirecting to Login Page...</h2>
               <h2 style={center}></h2>
            </div>
        </div>
    )
}

const center = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}
export const button = {
    width: "20%", 
    height: 30, 
    color: "black", 
    fontWeight: 'bold',
}

export default SessionExpired;
