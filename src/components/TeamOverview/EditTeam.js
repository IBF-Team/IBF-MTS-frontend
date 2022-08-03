import React, {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {checkLogin} from "../../utils/storageUtils";
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Popup from '../Popup/Popup';

function EditTeam() {
    const navigate = useNavigate()
    const location = useLocation()
    const [tournamentId, setTournamentId] = useState(location.state?location.state.tournament.id:-1)
    const [team, setTeam] = useState(location.state?location.state.team:{})
    const [id, setID] =  useState(location.state?location.state.team.id:'')
    const [name, setName] = useState(location.state?location.state.team.name:'')
    const [region, setRegion] = useState(location.state?location.state.team.region:'')
    const [members, setMembers] = useState(location.state?location.state.team.members.join(", "):'')
    const [header, setHeader] = useState('')
    const [msg, setMsg] = useState('')
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const login_stat = checkLogin()
        if (login_stat === false) {
            navigate('/require_login')
            return;
        }
        // if (location.state == undefined) {
        //     navigate('/dashboard')
        //     return;
        // }
        console.log("IN EDITTEAM!")
        console.log(tournamentId)
    }, []);

    //NEED TO PASS TOURNAMENT_ID in the this page to be able to make the format necessary.
    const edit = async (e) => {
        e.preventDefault()
        setHeader('')
        setLoading(true)
        //super(e)
        const data = {tournament_id: tournamentId, team_id: id, name:name, region: region, members:members}
        console.log(data)
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch('/editTeam', requestOptions)
            const log = await response.json()
            console.log(log)
            if (log.code == 0) {
                setOpen(true)
                setHeader("Success")
                setMsg("Team Info updated!")
                setLoading(false)
            } else {
                setOpen(true)
                setHeader("Error")
                setMsg("Something went wrong. Please try again later")
                setLoading(false)
            }

        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    return (
        <div>
            <div 
            style={{ 
                color: "white", 
                paddingLeft: "5px", 
                fontSize: 20, 
                marginTop: 20, 
                textAlign: "center",
                display: "inline-block",
                cursor: 'pointer',
                }}
            onClick={()=>{navigate('/teamoverview', {state:{tournament:location.state.tournament}})}}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size:30 }}>
                <BsFillArrowLeftCircleFill/>
                </IconContext.Provider> Back to TeamOverview
            </div>
            <div style={editTeamBox}>
            <h2>Edit Team</h2>
            <form>
            <text>Team Name:</text><br/>
            <input type="text" required value={name}
                onChange={e => setName(e.target.value)}/><br/><br/>
            <label>Region:</label><br/>
            <select style={regionBox} onChange={e => setRegion(e.target.value)}>
                <option value="NW">NW</option>
                <option value="Central">Central</option>
                <option value="NE">NE</option>
                <option value="SW">SW</option>
                <option value="SW">{team.region}</option>
            </select><br/><br/>
            <text>Members:</text><br/>
            <textarea type="text" required value={members}
                style={memberBox}
                onChange={e => setMembers(e.target.value)}/><br/><br/>
            <button className="edit-judge-button" onClick={edit} style={{width:180}}>
                Update Team
            </button>
            </form></div>
            {open? <Popup
                content={
                  <div>
                  <h3>{header}</h3>
                  <p>{msg}</p>
                  <button disabled={loading} onClick={()=>{setOpen(false)}}  style={{float: 'left'}}>Cancel</button>
                  <button onClick={()=>{setOpen(false)}}  style={{float: 'right'}} disabled={loading}>Ok</button>
                  {loading? <p style={{color: "red"}}>  Update Team Info... </p>:null}
                  </div>
                }
                handleClose={()=>{setOpen(false);}}
            />: null}
        </div>
    )
}

const editTeamBox = {
    display: "inline-block",
    width: 275,
    height: 200,
    position: "fixed",
    margin: "auto",
    top: "20%",
    left: "40%",
    borderRadius: 25,
    textAlign: "left",
    color: "#f7a642",
}

const regionBox = {
    borderRadius: 5,
    border: "none",
    color: "#217ec0",
    width: 180,
    height: 30,
}

const memberBox = {
    borderRadius: "0.5rem",
    border: "0.05rem solid #217ec0",
    color: "#217ec0",
    fontSize: "1rem",
    width:200,
    height:150
}

export default EditTeam

