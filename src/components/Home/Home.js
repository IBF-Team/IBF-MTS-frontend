import React, {useState, useEffect}from "react";
import graphic from "../../state_faces.png";
import { useNavigate } from 'react-router-dom';
import {Link, Outlet } from 'react-router-dom';
// import userToken from "../../utils/storageUtils";
import { checkLogin, getUser, removeToken, saveLogin } from "../../utils/storageUtils.js";
import config from '../../config'

console.log(graphic);

var m_data = {
    f1: "hi",
    f2: "hi2",
    f3: "hi3",
}

function Home() {
    // const {user, token,loggedIn, getToken, saveToken, removeToken, getUser, saveUser, removeUser, checkLogin, saveLogin } = userToken();
    const navigate = useNavigate();
    const [user, setUser] = useState(null)
    const [loggedIn, setLoggedIn] = useState(false)
    useEffect(() => {
        const login_stat = checkLogin()
        setLoggedIn(login_stat)
        if (login_stat === true) {
            navigate("/dashboard",{state:{id:1,name:''}})
        } else {
            const user = getUser()
            setUser(user)
        }
    }, []);


    return(
        <p className="home">
            <h1> Welcome! </h1>
            <h2> Indiana Bar Foundation - a leader in civic education since 1950 </h2>
            {!loggedIn? <div><button style={{marginTop: 40, width: 100, height: 40, color: "black", fontWeight: 'bold'}}
             onClick={()=>{navigate("/login")}}>Log In</button>
            <label style={{marginLeft: 40, marginRight: 40}}>or</label>
            <button style={{marginTop: 40, width: 150, height: 40, color: "black", fontWeight: 'bold'}}
             onClick={()=>{navigate("/create_account")}}>Create Account</button></div> 
             : null}
            {/* <Link style={{backgroundColor: 'salmon'}} to="/login">Log In</Link> */}
            {/* <h3> or </h3> */}
            {/* <Link style={{backgroundColor: 'white'}} to="/create_Account">Create Account</Link> */}
            <img src={graphic} alt="state_faces" style={{width: 200, float: "right"}}/>
        </p>
    )
}

export default Home;
