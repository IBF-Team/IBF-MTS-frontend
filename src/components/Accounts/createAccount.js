import React, {useEffect, useState} from 'react';
import './Accounts.css'
import {Link, useNavigate} from "react-router-dom";
import {checkLogin, saveLogin, saveUser} from "../../utils/storageUtils";
import config from '../../config';
import Popup from '../Popup/Popup';


function CreateAccount() {

    //hooks for create account
    //const [username, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirm, setConfirm] = useState('')
    const [code, setCode] = useState('')
    const [region, setRegion] = useState('')
    const [secQ, setSeqQ] = useState('')
    const [secA, setSeqA] = useState('')
    const [errMsg, setErrMsg] = useState('')
    const [sucMSG, setSucMSG] = useState('')
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    useEffect(() => {
        const login_stat = checkLogin()
        if (login_stat === true) {
            navigate("/dashboard",{state:{id:1,name:''}})
        }
    }, []);


    const regexPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        let valEmail = validateEmail(email)
        if (valEmail == null) {
            console.log("Email is not of valid form");
            setErrMsg("Ensure a valid email address is entered")
            return;
        }
        console.log(password)
        if (password !== confirm) {
            console.log("passwords do not match")
            setErrMsg("Ensure that the passwords match")
            return
        }
        console.log(regexPassword.test(password))
        if (!regexPassword.test(password)) {
            console.log("Not a valid password!")
            setErrMsg("Ensure that password is valid")
            return
        }
        if (secQ === "" || secQ === "None") {
            console.log("You have to select a security Question");
            setErrMsg("Security question cannot be None");
            return
        }

        if (region === "" || region === "None") {
            console.log("You have to select a region for the account");
            setErrMsg("Region cannot be None");
            return
        }

        setErrMsg("")
        setSucMSG("")
        valEmail = valEmail[0]
        const data = {email: valEmail, password: password, authCode: code, region: region, secQ: secQ, secA: secA}
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch(config.API_BASE_URL+'/createAccount', requestOptions)
            const log = await response.json();
            console.log(log)
            if (log.status === 502) {
                setErrMsg("Account already created")
                setSucMSG("")
            } else if (log.status === 404) {
                setErrMsg("Please Provide a valid authCode")
                setSucMSG("")
            } else if (log.status === 200) {
                setErrMsg("")
                setSucMSG("Account created Succesfully")
                navigate('/dashboard')
            } else {
                setOpen(true);
            }
        } catch (error) {
            setOpen(true)
            console.log(error)
        }
    }

    return(
        <div className="App">
            <br/>
            <br/>
            <div>
                <Link to={'/home'}>
                    <button className="back-to-home"> Back to Home </button>
                </Link>

                <div className={"create-account"}>
                    <h2>Create Account</h2>
                    <form>
                        <text style={{marginRight: '168px', paddingTop: '10px'}}>Email</text><br/>
                        <input className={"create-account-input"} type="text" value={email}
                               onChange={e => setEmail(e.target.value)}/><br/><br/>
                        <text style={{marginRight: '138px'}}>Password</text><br/>
                        <input className={"create-account-input"} type="password" value={password}
                               onChange={e => setPassword(e.target.value)}/><br/><br/>
                        <text style={{marginRight: '78px'}}>Confirm Password</text><br/>
                        <input className={"create-account-input"} type="password" value={confirm}
                               onChange={e => setConfirm(e.target.value)}/><br/><br/>
                        <text style={{marginRight: '65px'}}>Authentication Code</text><br/>
                        <input className={"create-account-input"} type="text" value={code}
                               onChange={e => setCode(e.target.value)}/><br/><br/>
                        <text style={{marginRight: '160px'}}>Region</text><br/>
                        <select style={{height: 30}} className={"create-account-input"} onChange={e => setRegion(e.target.value)}>
                            <option value="None">None</option>
                            <option value="NW">NW</option>
                            <option value="Central">Central</option>
                            <option value="NE">NE</option>
                            <option value="SW">SW</option>
                        </select><br/><br/>
                        <text style={{marginRight: '85px'}}>Security Question</text><br/>
                        <select className={"create-account-input"} style={{height: 30}} value={secQ} onChange={e => setSeqQ(e.target.value)}>
                            <option value="None">None</option>
                            <option value="What is your mother's maiden name?">What is your mother's maiden name?</option>
                            <option value="What was the name of your first pet?">What was the name of your first pet?</option>
                            <option value="On what street did you grow up on?">On what street did you grow up on?</option>
                            <option value="What was the name of your high school?">What was the name of your high school?</option>
                            <option value="What was the first concert you attended?">What was the first concert you attended?</option>
                        </select><br/><br/>
                        <text style={{marginRight: '157px'}}>Answer</text><br/>
                        <input className={"create-account-input"} type="text" value={secA}
                               onChange={e => setSeqA(e.target.value)}/><br/>
                        <button className="create-account-button" onClick={handleSubmit}> Create Account</button>
                    </form>
                    <br/>
                    {errMsg && <div style={{fontSize: 10}} className="error">{errMsg}</div>}
                    {sucMSG && <div style={{fontSize: 10}} className="success">{sucMSG}</div>}
                    <text style={{fontSize: 10}}> If you do not have an authorization code, please contact your system administrator.</text>
                    <br/>
                    <text style={{fontSize: 10}}>Passwords must contain one lowercase, uppercase, number, and special character.</text>
                </div>
                <div className={"to-sign-in"}>
                    <text> Already have an account? </text>
                    <br/>
                    <Link to={"/login"}>
                        <button className="sign-in-button"> Sign in </button>
                    </Link>
                    <div className={"request-code"}>
                    <a href="mailto:CS407MTS@outlook.com?subject=Authentication%20Code%20Request&body=Hello%20IBF%20Team%2C%0D%0A%0D%0AI%20am%20requesting%20an%20Authentication%20Code%20for%20the%20process%20of%20creating%20my%20admin%20account!">
                        <button className="request-code-button">Request Authentication Code!</button>
                    </a>
                </div>
                </div>
            </div>
            {open? <Popup
                    content={
                    <div>
                        <h4>Error</h4>
                        <p>Something went wrong. Please try again later</p>
                        <button onClick={()=>{setOpen(false)}} style={{float: 'left'}}>Cancel</button>
                        <button onClick={()=>{setOpen(false)}} style={{float: 'right'}}>Ok</button>
                    </div>
                    }
                    handleClose={()=>{setOpen(false);}}
                />:null}
        </div>
    )
}

export default CreateAccount;

