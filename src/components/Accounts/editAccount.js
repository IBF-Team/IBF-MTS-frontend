import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import './Accounts.css'
import {checkLogin, getUser, saveToken, saveLogin, removeUser} from "../../utils/storageUtils";
import { IconContext } from "react-icons";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import config from '../../config'
import Popup from '../Popup/Popup';


function EditAccount() {
    const [region, setRegion] = useState('')
    const [oldPass, setOldPass] = useState('')
    const [newPass, setNewPass] = useState('')
    const [regionSucess, setRegionSucess] = useState('')
    const [regionError, setRegionError] = useState()
    const [user, setUser] = useState(getUser())
    const [passError, setPassError] = useState('')
    const [passSuccess, setPassSuccess] = useState('')
    const [deletePopup, setDeletePopup] = React.useState(false)
    const [msg, setMsg] = useState("");
    const [header, setHeader] = useState("")
    const [open, setOpen] = useState(false)
    const [oldVisible, setOldVisible] = useState(false)
    const [newVisible, setNewVisible] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const navigate = useNavigate();

    const regexPassword = new RegExp('^(?=.*?[A-Za-z])(?=.*?[0-9]).{6,}$');

    useEffect(() => {
        const login_stat = checkLogin()
        setUser(getUser())
        if (login_stat === false) {
            navigate('/require_login')
            return;
        }
    }, [refresh]);

    const changeRegion = async (e) => {
        e.preventDefault()
        console.log(region)
        setRegionSucess("")
        setRegionError("")
        const data = {region: region, email: user.email}
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch(config.API_BASE_URL+'/editRegion', requestOptions)
            const log = await response.json()
            console.log(log)
            if (log.status === 200) {
                setRegionSucess("Region Changed Successfully to: " + region)
                setRegionError("")
            } else if (log.status === 400) {
                setRegionError("Code not able to be changed")
                setRegionSucess("")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const changePassword = async (e) => {
        e.preventDefault()
        console.log(oldPass, newPass)
        console.log(user)
        console.log(regexPassword.test(newPass))
        if (!regexPassword.test(newPass)) {
            console.log("New a valid password!")
            setPassError("Ensure that the new password is valid")
            return
        }
        setPassError("")
        setPassSuccess("")
        const data = {newPass: newPass, oldPass: oldPass, email: user.email}
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch(config.API_BASE_URL+'/changePass', requestOptions)
            const log = await response.json();
            console.log(log)
            if (log.status === 200) {
                setPassSuccess("Password Changed Successfully")
                setPassError("")
                saveLogin(false);
                setRefresh(!refresh);
            } else if (log.status === 501) {
                setPassSuccess("")
                setPassError("Old password does not match")
            } else if (log.status === 502) {
                setPassSuccess("")
                setPassError("Error changing password")
            }
        } catch (error) {
            console.log(error)
        }

    }

    const deleteMyAccount = async() => {
        console.log("delete Account...")
        setDeletePopup(false);
        const data = {email: getUser().email}
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch(config.API_BASE_URL+'/deleteAccount', requestOptions)
            const log = await response.json();
            console.log(log)
            if (log.status === 200) {
                saveLogin(false)
                removeUser()
                navigate("/account_deleted")
            } else {
                setOpen(true)
                setHeader("Error");
                setMsg("Something went wrong. Please try agin later")
                setOpen(true);
            }

        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div>

            <br/>
            <Link to={'/dashboard'}>
                <button className="back-to-home"> Back to Home </button>
            </Link>
            <div className="edit-region-box">
                <h2>Edit Region</h2>
                <form>
                    <text style={{marginRight: '153px'}}>Region</text><br/>
                    <select style={{marginTop: '10px', height: 30}} className={"create-account-input"} onChange={e => setRegion(e.target.value)}>
                        <option value="NW">NW</option>
                        <option value="Central">Central</option>
                        <option value="NE">NE</option>
                        <option value="SW">SW</option>
                    </select>
                    <button style={{marginTop: '10px'}} className="create-account-button" onClick={changeRegion}>
                        Submit</button>
                </form>
                <br/>
                {regionError && <div style={{fontSize: 10}} className="error"> {regionError} </div>}
                {regionSucess && <div style={{fontSize: 10}} className="success">{regionSucess} </div> }
            </div>
            <div className="edit-password-box">
                <h2>Change Password</h2>
                <form>
                    <text style={{marginRight: '110px'}}>Old Password</text><br/>
                    <div style={input_box}>
                        <input type={oldVisible? "text":"password"} value={oldPass}
                           style={input_style}
                           onChange={e => setOldPass(e.target.value)}/>
                        <span onClick={()=>{setOldVisible(!oldVisible)}}>
                        <IconContext.Provider value={{ color: "orange", className: "react-icons", size: 30 }}>
                        {!oldVisible? <AiFillEyeInvisible/>:<AiFillEye />}
                        </IconContext.Provider>
                        </span>
                    </div><br/>
                    <text style={{marginRight: '105px'}}>New Password</text><br/>
                    <div style={input_box}>
                        <input style={input_style} value={newPass}
                           type={newVisible? "text":"password"}
                           onChange={e => setNewPass(e.target.value)}/>
                        <span onClick={()=>{setNewVisible(!newVisible)}}>
                        <IconContext.Provider value={{ color: "orange", className: "react-icons", size: 30 }}>
                        {!newVisible? <AiFillEyeInvisible/>:<AiFillEye />}
                        </IconContext.Provider>
                        </span>
                    </div><br/>
                    <button style={{marginTop: '10px'}} className="create-account-button" onClick={changePassword}>
                        Change Password</button>
                </form>
                {passError && <div style={{fontSize: 10, marginTop: '5px'}} className="error"> {passError} </div>}
                {passSuccess && <div style={{fontSize: 10, marginTop: '5px'}} className="success">{passSuccess} </div> }
                <text style={{fontSize: 10}}>Passwords must contain one lowercase, uppercase, number, and special character.</text>
            </div>
            <div className="delete-account-box">
                <button className="create-account-button" onClick={()=>{setDeletePopup(true)}}>
                    Delete Account</button>
            </div>
            {deletePopup? <Popup
                    content={
                    <div>
                        <h4>Delete Account?</h4>
                        <p>Are you sure you want to delete this account?</p>
                        <button onClick={()=>{setDeletePopup(false)}} style={{float: 'left'}}>Cancel</button>
                        <button onClick={deleteMyAccount} style={{float: 'right'}}>Confirm</button>
                    </div>
                    }
                    handleClose={()=>{setDeletePopup(false);}}
                />:null}
            
            {open? <Popup
                    content={
                    <div>
                        <h4>{header}</h4>
                        <p>{msg}</p>
                        <button disabled={header === "Success"} onClick={()=>{setOpen(false)}} style={{float: 'left'}}>Cancel</button>
                        <button onClick={()=>{setOpen(false)}} style={{float: 'right'}}>OK</button>
                    </div>
                    }
                    handleClose={()=>{setOpen(false);}}
                />:null}


        </div>
    )
}

const input_box = {
//     backgroundColor: "#f7a642",
//     borderRadius: "5px",
//     border: "none",
//     color: "#112848",
//     width: "208px",
//     marginTop: '5px', 
//     marginLeft:30,
//     justifyItems: "flex-start",
//     justifyContent: "row",
}
const input_style = {
    backgroundColor: "#f7a642",
    borderRadius: "5px",
    border: "none",
    color: "#112848",
    width: 170,
    marginTop: 5
}

export default EditAccount;