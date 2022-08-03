import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
// import userToken from "../../utils/storageUtils";
import { IconContext } from "react-icons";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {checkLogin, saveLogin, saveToken, saveUser} from '../../utils/storageUtils.js';
import config from '../../config'


export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validEmail, setValidEmail] = useState(true)
  const [validPwd, setValidPwd] = useState(true)
  const [success, setSuccess] = useState(true)
  const [visible, setVisible] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const login_stat = checkLogin()
    if (login_stat === true) {
      navigate("/dashboard",{state:{id:1,name:''}})
    }
  }, []);

  const login = async (e) => {
    e.preventDefault();
    console.log("Login Clicked");
    const data = {email: email, password: password}
    const requestOptions = {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    }
    try {
      const response = await fetch(config.API_BASE_URL+'/login', requestOptions)
      const data = await response.json();
        if (data && data.code === 0) {
          // If Login successfully
          setValidEmail(true)
          setValidPwd(true)
          saveToken(data.access_token)
          console.log(data.access_token)
          // const user = {id: data.uid, email: email, password: password}
          const user = data.user
          console.log("user", user)
          saveUser(user)
          saveLogin(true)
          navigate("/dashboard")
        } else if (data && data.code === -1) {
          setValidEmail(false)
          console.log(data.msg);
        } else if (data && data.code === -2) {
          setValidPwd(false)
          console.log(data.msg)
        }
      } catch (error) {
        console.log(error)
      }
      
  };

  const forgotPwd = async () => {
    console.log("forgotPwd clicked")
    navigate("/forgot_password");
  }

  function changeBackgroundColor(e) {
    e.target.style.background = 'green';
  }

  return(
    <div className="login-wrapper">
      <form>
        <h1 style={{color:'orange'}}>Please Log In</h1>
        <label style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-start'}}>
          <p style={{color:'orange', textAlign: "left"}}>Username/Email:</p>
          <input style={{height:20, width: 200, borderWidth: 2, borderColor: validEmail? '' : "red"}} 
          type="text" value={email} onChange={e => setEmail(e.target.value)}/>
        </label><br />
        {!validEmail? <label style={{color:'red', fontSize:13}}>Email/Username Does Not Exist</label> : null}
        <label style={{color:'orange'}}>
          <p style={{color:'orange', textAlign: "left"}}>Password:</p>
          <div>
              <input style={{height:20, width: 200, borderWidth: 2, borderColor: validPwd? '' : "red"}}
                 value={password}
                 type={visible? "text":"password"}
                 onChange={e => setPassword(e.target.value)}/>
              <span onClick={()=>{setVisible(!visible)}}>
              <IconContext.Provider value={{ color: "orange", className: "react-icons", size: 30 }}>
              {!visible? <AiFillEyeInvisible/>:<AiFillEye />}
              </IconContext.Provider>
              </span>
          </div>
        </label><br />
        {!validPwd? <label style={{color:'red', fontSize:13}}>Wrong Password</label> : null}
        <div>
        <button style={{marginTop: 30, width: 220, height: 40, color: "black", fontWeight: 'bold'}}
         onClick={login}>Submit</button>
        </div>
        <div><p style={{color: "red", cursor:"pointer", textAlign: "left"}} onClick={forgotPwd}>Forgot Password?</p></div>
      <div style={{marginTop:50}}>
        <h3 style={{color:"orange", marginTop: 10, textAlign:"center"}}>Don't have an account yet?</h3>
        <button style={{width: 220, height: 40, color: "green", fontWeight: 'bold'}}
         onClick={()=>{navigate('/create_account')}}>Create Account</button>
      </div>
      </form>
    </div>
    
  )
}