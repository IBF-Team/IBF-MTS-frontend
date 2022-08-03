import React, {useEffect, useState} from "react";
//import Header from "../Header/Header";
import {Link, useNavigate} from "react-router-dom";
// import userToken from "../../utils/storageUtils";
import {checkLogin, getUser, saveToken} from '../../utils/storageUtils'
import DeletePopup from "./DeletePopup";
import config from "../../config";
import Popup from '../Popup/Popup';

function HandleAccounts() {
    // const {saveToken} = userToken();
    //hooks
    const [invite, setInvite] = useState(''); //emaiol for invite
    const [del, setDel] = useState(''); //email for delete account
    const [role, setRole] = useState('') //email for edit role
    const [code, setCode] = useState('') //email for authCode
    const [inviteError, setInviteError] = React.useState('');
    const [deleteError, setDeleteError] = React.useState('');
    const [roleError, setRoleError] = React.useState('');
    const [codeError, setCodeError] = React.useState('');
    const [inviteSuccess, setInviteSuccess] = React.useState('');
    const [deleteSuccess, setDeleteSucess] = React.useState('');
    const [roleSuccess, setRoleSuccess] = React.useState('');
    const [codeSuccess, setCodeSuccess] = React.useState('');
    const [deletePopup, setDeletePopup] = React.useState(false)
    const [user, setUser] = useState(getUser())
    const navigate = useNavigate();


    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    useEffect(() => {
        const login_stat = checkLogin()
        setUser(getUser())
        if (login_stat === false) {
            navigate('/require_login')
            return;
        }
        if (user.role === 'admin') {
            navigate('/invalid_access')

        }
    }, []);

    const handleInvite = async (e) => {
        e.preventDefault()
        //console.log(invite)
        let email = validateEmail(invite)
        if (email == null) {
            console.log("Email is not of valid form");
            setInviteError("Make sure a valid email address is entered")
            return;
        }
        setInviteError("")
        email = email[0]
        const data = {email: email}
        //once login is set up, need to assert that current user is of type root
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch(config.API_BASE_URL+'/sendInvite', requestOptions)
            const log = await response.json();
            console.log(log)
            if (log.status === 502) {
                setInviteError("Email already used.")
                setInviteSuccess("")
            } else if (log.status === 503) {
                setInviteError("Error in initializing the account. Please try again")
                setInviteSuccess("")
                //need to check to see if error in sending invitation email
            } else {
                setInviteError("")
                setInviteSuccess("Acount initialized and email sent successfully.\n Authentication Code: " + log.authCode)
                log.access_token && saveToken(log.access_token)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const handleRole = async (e) => {
        e.preventDefault()
        let email = validateEmail(role)
        if (email == null) {
            console.log("Email is not of valid form");
            setRoleError("Make sure a valid email address is entered")
            return;
        }
        setRoleError("")
        setRoleSuccess("")
        email = email[0]
        const data = {email: email}
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch(config.API_BASE_URL+'/editRole', requestOptions)
            const log = await response.json();
            console.log(log)
            if (log.status === 200) {
                setRoleError("")
                setRoleSuccess("Account successfully changed to " + log.role)
            } else if (log.status === 502) {
                setRoleError("Could Not Find Account")
                setRoleSuccess("")
            } else if (log.status === 503) {
                setRoleError("Error in changing role. Please try again")
                setRoleSuccess("")
            } else if (log.status === 504) {
                setRoleError("Error: Not enough admins remaining")
                setRoleSuccess("")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleCode = async (e) => {
        e.preventDefault()
        console.log(code)
        setCodeError("");
        setCodeSuccess("")
        if (code.includes(" ")) {
            setCodeError("No spaces allowed in Code")
            return
        }
        const data = {code: code}
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch(config.API_BASE_URL+'/setCode', requestOptions)
            const log = await response.json()
            console.log(log)
            if (log.status === 200) {
                setCodeSuccess("Code Changed Successfully to: " + code)
                setCodeError("")
            } else if (log.status === 400) {
                setCodeError("Code not able to be changed")
                setCodeSuccess("")
            }
        } catch (error) {
            console.log(error)
        }
    }


    const handleDelete = async (e) => {
        e.preventDefault()
        console.log(del)
        let email = validateEmail(del)
        if (email == null) {
            console.log("Email is not of valid form");
            setDeleteError("Make sure a valid email address is entered")
            return;
        }
        setDeleteError("")
        setDeleteSucess("")
        email = email[0]
        const data = {email: email}
        //once login is set up, need to assert that current user is of type root
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch(config.API_BASE_URL+'/deleteAccount', requestOptions)
            const log = await response.json();
            console.log(log)
            if (log.status === 502) {
                setDeleteError("Could not find account")
                setDeleteSucess("")
            } else {
                setDeleteError("")
                setDeleteSucess("Account Deleted Successfully")
                log.access_token && saveToken(log.access_token)
            }

        } catch (error) {
            console.log(error)
        }
        setDeletePopup(false)
    }


    return (
        <div className={"App"}>
            <br/>
            <Link to={'/dashboard'}>
                <button className="back-to-home"> Back to Home </button>
            </Link>
            <div className={"invite-box"}>
                <h2>Send Invite Code</h2>
                <form>
                    <text style={{marginRight: '168px'}}> Email </text><br/>
                    <input style={{marginTop: '5px'}} className={"create-account-input"} type="text" value={invite}
                           onChange={e => setInvite(e.target.value)}/><br/>
                    <button style={{marginTop: '10px', marginBottom: 10}} className="create-account-button" onClick={handleInvite}>
                        Send Invite</button>
                </form>
                <br/>
                {inviteError && <div style={{fontSize: 10}} className="error"> {inviteError} </div>}
                {inviteSuccess && <div style={{fontSize: 10}} className="success">{inviteSuccess} </div> }
            </div>
            <div className={"auth-box"}>
                <h2>Edit Authentication Code</h2>
                <text style={{marginRight: '168px'}}> Code </text><br/>
                <input style={{marginTop: '5px'}} className={"create-account-input"} type="text" value={code}
                       onChange={e => setCode(e.target.value)}/><br/>
                <button style={{marginTop: '10px', marginBottom: 10}} className="create-account-button" onClick={handleCode}>
                    Change Code</button>
                {codeError && <div style={{fontSize: 10, marginTop: '5px'}} className="error"> {codeError} </div>}
                {codeSuccess && <div style={{fontSize: 10, marginTop: '5px'}} className="success"> {codeSuccess} </div>}
            </div>
            <div className={"role-box"}>
                <h2> Edit Role </h2>
                <text style={{marginRight: '168px'}}> Email </text><br/>
                <input style={{marginTop: '5px'}} className={"create-account-input"} type="text" value={role}
                       onChange={e => setRole(e.target.value)}/><br/>
                <button style={{marginTop: '10px', marginBottom: 10}} className="create-account-button" onClick={handleRole}>
                    Change Role</button>
                {roleError && <div style={{fontSize: 10, marginTop: '5px'}} className="error"> {roleError} </div>}
                {roleSuccess && <div style={{fontSize: 10, marginTop: '5px'}} className="success"> {roleSuccess} </div>}
            </div>
            <div className={"divide"}/>
            <div className={"delete-box"}>
                <h2>Delete Account</h2>
                <text style={{marginRight: '168px'}}> Email </text><br/>
                <input style={{marginTop: '5px'}} className={"create-account-input"} type="text" value={del}
                       onChange={e => {setDeletePopup(false); setDel(e.target.value)}} /><br/>
                <button style={{marginTop: '10px'}} onClick={() => setDeletePopup(true)} className="create-account-button" >
                    Delete Account</button><br/><br/>
                {deleteError && <div style={{fontSize: 10}} className="error"> {deleteError} </div>}
                {deleteSuccess && <div style={{fontSize: 10}} className="success">{deleteSuccess} </div> }
                <text style={{fontSize: 10}}>Notice: Accounts will be deleted permanently</text>
                {deletePopup? <Popup
                    content={
                    <div>
                        <h4>Delete Account?</h4>
                        <p>Are you sure you want to delete account with email: {del}</p>
                        <button onClick={()=>{setDeletePopup(false)}} style={{float: 'left'}}>Cancel</button>
                        <button onClick={handleDelete} style={{float: 'right'}}>Confirm</button>
                    </div>
                    }
                    handleClose={()=>{setDeletePopup(false);}}
                />:null}

            </div>
        </div>

    )
}

export default HandleAccounts;
