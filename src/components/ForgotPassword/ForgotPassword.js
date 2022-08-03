import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import Popup from 'react-popup';
import './ForgotPassword.css';
import '../Accounts/Accounts.css'
// import userToken from "../../utils/storageUtils";
import {checkLogin, getUser, saveLogin, saveToken, saveUser} from '../../utils/storageUtils.js';
import config from '../../config'


function ForgotPassword() {
    const [email, setEmail] = useState('')
    const [emailSuc, setEmailSuc] = useState('')
    const [emailErr, setEmailErr] = useState('')
    const [responseSuc, setResponseSuc] = useState('')
    const [responseErr, setResponseErr] = useState('')
    const [validEmail, setValidEmail] = useState(false)
    const [question, setQuestion] = useState('')
    const [response, setResponse] = useState('')
    const [password, setPasswword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [match, setMatch] = useState(true)
    const [user, setUser] = useState(getUser())
    const navigate = useNavigate();

    const regexPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');

  useEffect(() => {
        const login_stat = checkLogin()
        setUser(getUser())
        if (login_stat === true) {
            navigate("/dashboard",{state:{id:1,name:''}})
        }
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Reset Clicked");
    const mailto = "mailto:CS407MTS@outlook.com?subject=Password%20Reset%20Request&body=Dear%20IBF%20Team%2C%0D%0A%0D%0AI%20would%20like%20to%20reset%20my%20password%20for%20my%20account%20with%20the%20email%20address%3A%20" + email + "%0D%0A%0D%0AThank%20you";
    window.location.href = mailto;
    console.log("Mailto processed");
  };

  const findEmail = async (e) => {
      e.preventDefault()
      console.log(email)
      const data = {email: email}
      setEmailErr("")
      setEmailSuc("")
      const requestOptions = {
          method: "POST",
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(data)
      }
      try {
          const response = await fetch(config.API_BASE_URL+'/getEmail', requestOptions)
          const log = await response.json();
          console.log(log)
          if (log.status === 200) {
              setValidEmail(true)
              setQuestion(log.question)
          } else if (log.status === 500) {
              setEmailErr("Account can not be found")
              setValidEmail(false)
          }
      } catch (error) {
          console.log(error)
      }
  }

    const changePass = async (e) => {
        e.preventDefault()
        console.log(email)
        if (password !== confirm) {
            setMatch(false);
            return;
        }

        console.log(regexPassword.test(password))
        if (!regexPassword.test(password)) {
            console.log("Not a valid password!")
            setResponseErr("Ensure that the new password is valid")
            return
        }
        setResponseErr("")
        setResponseSuc("")
        const data = {email: email, password: password, response: response}
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch(config.API_BASE_URL+'/forgetPass', requestOptions)
            const log = await response.json();
            console.log(log)
            if (log.status === 200) {
                setResponseSuc("Password is Reset")
                navigate("/login")
            } else if (log.status === 500) {
                setResponseSuc("")
                setResponseErr("The answer to the security question is wrong")
            } else if (log.status === 501) {
                setResponseSuc("")
                setResponseErr("Error resetting password")
            }
        } catch (error) {
            console.log(error)
        }
    }




  return(
    <div className="forgot-password-box">
        <h2>Forgot Password</h2>
        <form>
            <text>Enter Email:</text>
            <input style={{marginTop: '5px'}} className={"create-account-input"} type="text" value={email}
                   onChange={e => setEmail(e.target.value)}/>
                   <br/>
            <button style={{marginTop: '10px'}} className="create-account-button" onClick={findEmail}>
                Enter</button><br/>
            {emailErr && <div style={{fontSize: 10, marginTop: '5px'}} className="error"> {emailErr} </div>}
            <br/><br/>
            {validEmail &&
            <div>
                <text>Security Question: </text><br/>
                <text style={{marginTop: '15px'}}>{question}</text><br/>
                <text>Answer: </text><br/>
                <input style={{marginTop: 5}} className={"create-account-input"} type="text" value={response}
                       onChange={e => setResponse(e.target.value)}/><br/><br/>
                <text style={{marginTop: 10}}>Enter New Password:</text><br/>
                <input style={{marginTop: 10, marginBottom: 10, borderWidth: 2, borderColor: match? '' : "red"}} 
                        className={"create-account-input"} type="text" value={password}
                       onChange={e => setPasswword(e.target.value)}/><br/>
                <text style={{marginTop: 10}}>Confirm New Password:</text><br/>
                <input style={{marginTop: 5, borderWidth: 2, borderColor: match? '' : "red"}} className={"create-account-input"} type="text" value={confirm}
                       onChange={e => setConfirm(e.target.value)}/><br/>
                {!match? <label style={{marginTop: 10, color:'red', fontSize:13}}>Passwords do not match</label> : null}
                <button style={{marginTop: 10}} className="create-account-button" onClick={changePass}>
                    Submit</button><br/>
                {responseErr && <div style={{fontSize: 10, marginTop: '5px'}} className="error"> {responseErr} </div>}
                {responseSuc && <div style={{fontSize: 10, marginTop: '5px'}} className="success"> {responseSuc} </div>}
            </div>}
        </form>
    </div>

  )
}

export default ForgotPassword;


/*
 <form>
        <h1 style={{color:'orange'}}>Reset Password</h1>
        <label>
          <p style={{color:'orange'}}>Enter the Email associated with your account:</p>
          <input style="create-account-input"
          type="text" value={email} onChange={e => setEmail(e.target.value)}/>
        </label><br />
        {!validEmail? <label style={{color:'red', fontSize:13}}>Email/Username Does Not Exist</label> : null}
        <div>
        <button style={{marginTop: 30, width: 210, height: 30, color: "black", fontWeight: 'bold'}}
         onClick={handleSubmit}>Submit</button>
        </div>
      <div style={{marginTop:50}}>
        <h3 style={{color:"orange", marginTop: 10, textAlign:"center"}}>Don't have an account yet?</h3>
        <button style={{width: 210, height: 30, color: "green", fontWeight: 'bold'}}
         onClick={()=>{navigate('/create_account')}}>Create Account</button>
      </div>
      </form>
 */