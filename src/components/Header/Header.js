import React from "react";
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { checkLogin, getUser, removeToken, saveLogin, getToken } from "../../utils/storageUtils.js";
import '../Accounts/Accounts.css'
import config from '../../config'
import logo from "../../INBF Logo - Standard.jpg"


function Header() {
    // const {user,loggedIn, removeToken, getUser, saveLogin } = userToken();
    const navigate = useNavigate();
    const location = useLocation()
    const [user, setUser] = useState(getUser())
    const [login, setLogin] = useState(checkLogin())
    const [role, setRole] = useState('')

    useEffect(() => {
        console.log("useEffect")
        setLogin(checkLogin())
        if (checkLogin()) {
            let u = getUser()
            setUser(u)
            if (u.role === 'root' || u.roler === "Header") {
                setRole('Root')
            } else {
                setRole('Admin')
            }
        }
    }, [location.key]);

    const logout = async () => {
        console.log("Logout Clicked");
        var user = getUser()
        const data = {uid: user.id}
        const requestOptions = {
            method: "POST",
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + getToken() },
            body: JSON.stringify(data)
        }
        try {
          const response = await fetch(config.API_BASE_URL+'/logout', requestOptions)
          const data = await response.json();
          console.log(data)
            if (data && data.code === 0) {
                // If logout successfully
                console.log(data.msg);
            }
        } catch (error) {
            console.log(error)
        }
        removeToken();
        saveLogin(false);
        navigate("/");

    };


    return (
        <div className="header">
            <a href="/">
                <img className="IBF-logo" style={{width: "100%"}}  src={logo}/>
            </a>
            <h1 className="centered">Mock Trial Scheduler</h1>
            <div className="right">
                <div style={{ display: "inline-block", paddingTop: 10 }}>
                    {login? 
                        <div style={{textAlign:"left"}}>
                        <p style={{width:200}}>{user.email}</p>
                        <p>Role: {role}</p>
                        </div>
                        : <h4 ><Link to="/login" style={{color: '#217ec0' }}> Sign In</Link></h4>}
                </div>
                {login ? <button style={button} className="back-to-home" onClick={logout}>Log Out</button> : null}
                <button style={button} className="back-to-home"
                    onClick={() => { navigate("/contact") }}>Contact Us</button>
                {/* <button style={button}
                onClick={()=>{console.log("clicked"); saveLogin(true); navigate('/')}}>Login</button> */}
                {/* <h4 style={{backgroundColor: 'white', textAlign: "center"}}><Link to="/contact">Contact Us </Link></h4> */}
                {/* {(window.location.pathname == "/dashboard" || window.location.pathname == "/preferences" || window.location.pathname == "/upload" || window.location.pathname == "/tournament")? 
                    <h4 style={{backgroundColor: 'red', textAlign: "center"}}><Link to="/">Log Out </Link></h4>: null } */}
            </div>
        </div>
    );
}

const button = {
    marginTop: 30,
    width: 120,
    height: 40,
    color: "black",
    fontWeight: 'bold',
}

export default Header;