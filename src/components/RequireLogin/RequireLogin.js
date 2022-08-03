import React, {useState, useEffect}from "react";
import { useNavigate } from 'react-router-dom';
// import userToken from "../../utils/storageUtils";
import { checkLogin, getUser, removeToken } from "../../utils/storageUtils.js";

function RequireLogin() {
    const navigate = useNavigate();
    const [loggedIn, setLoggedIn] = useState(checkLogin())
    useEffect(() => {
        const login_stat = checkLogin()
        if (login_stat == false) {
            setTimeout(() => {
                navigate('/login')
              }, 2000);
        } else {
            navigate("/")
        }
    }, []);
    
    return(
        <div className="home">
            <div><h1 style={center}> Please Sign In First!</h1>
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

export default RequireLogin;
