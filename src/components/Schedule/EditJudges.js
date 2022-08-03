import React, {useEffect, useState} from "react";
import './Schedule.css'
import {useLocation, useNavigate} from "react-router-dom";
import {checkLogin} from "../../utils/storageUtils";
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Popup from '../Popup/Popup';

function EditJudges() {
    const[courtroom, setCourtroom] = useState('')
    const[id, setId] = useState('')
    const navigate = useNavigate()
    const location = useLocation()
    const [tournamentId, setTournamentId] = useState(location.state.tournament.id)
    const [room, setRoom] = useState(location.state.room)
    const [matches, setMatches] = useState(location.state.matches)
    const [presJudge, setPresJudge] = useState('')
    const [firstJudge, setFirstJudge] = useState('')
    const [secondJudge, setSecondJudge] = useState('')
    const [thirdJudge, setThirdJudge] = useState('')
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
        if (location.state == undefined) {
                navigate('/dashboard')
                return;
        }
        console.log("IN EDITJUDGES!")
        console.log(tournamentId)
        console.log(room)
        console.log(matches)
        for (var i = 0; i < matches.length; i++) {
            console.log(matches[i].presidingJudge)
            if (matches[i].courtroom.toString() === room) {
                setPresJudge(matches[i].presidingJudge)
                setFirstJudge(matches[i].scoringJudgeFirst)
                setSecondJudge(matches[i].scoringJudgeSecond)
                setThirdJudge(matches[i].scoringJudgeThird)
            }
        }
    }, []);

    //NEED TO PASS TOURNAMENT_ID in the this page to be able to make the format necessary.
    const edit = async (e) => {
        e.preventDefault()
        setHeader('')
        setLoading(true)
        //super(e)
        const data = {tournament_id: tournamentId, match: {courtroom: parseInt(room), presidingJudge: presJudge,
                scoringJudgeFirst: firstJudge, scoringJudgeSecond: secondJudge, scoringJudgeThird: thirdJudge}}
        console.log(data)
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch('/changeJudgeAssignment', requestOptions)
            const log = await response.json()
            console.log(log)
            if (log.code == 0) {
                setOpen(true)
                setHeader("Success")
                setMsg(log.msg)
                setLoading(false)
            } else {
                setOpen(true)
                setHeader("Error")
                let msg = log.msg
                if (log.recommend) {
                    msg += "  Available Judges: " + log.recommend.toString();
                }
                setMsg(msg)
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
            onClick={()=>{navigate('/schedule', {state:{tournament: location.state.tournament, round:location.state.round, 
            region: location.state.region}})}}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size:30 }}>
                <BsFillArrowLeftCircleFill/>
                </IconContext.Provider> Back to Competitions
            </div>
            <div className="edit-judges-box">
            <h2>Edit Judges</h2>
            <form>
            <text>Courtroom:</text><br/>
            <input id={"courtroom"} type="text" required value={room}
                   onChange={e => setCourtroom(e.target.value)}/><br/><br/>
            <text></text>
            <text>Presiding Judge:</text><br/>
            <input type="text" required  value={presJudge}
                   onChange={e => setPresJudge(e.target.value)}/><br/><br/>
            <text>1st Scoring Judge:</text><br/>
            <input type="text"  required value={firstJudge}
                   onChange={e => setFirstJudge(e.target.value)}/><br/><br/>
            <text>2nd Scoring Judge:</text><br/>
            <input type="text" required  value={secondJudge}
                   onChange={e => setSecondJudge(e.target.value)}/><br/><br/>
            <text>3rd Scoring Judge:</text><br/>
            <input type="text" required  value={thirdJudge}
                   onChange={e => setThirdJudge(e.target.value)}/><br/><br/>
            <button className="edit-judge-button" onClick={edit} style={{width:150}}>
                Edit Judges
            </button>
            </form></div>
            {open? <Popup
                content={
                  <div>
                  <h3>{header}</h3>
                  <p>{msg}</p>
                  <button disabled={loading} onClick={()=>{setOpen(false)}}  style={{float: 'left'}}>Cancel</button>
                  <button onClick={()=>{setOpen(false)}}  style={{float: 'right'}} disabled={loading}>Ok</button>
                  {loading? <p style={{color: "red"}}>  Changing judge assignment... </p>:null}
                  </div>
                }
                handleClose={()=>{setOpen(false);}}
            />: null}
        </div>
    )
}

export default EditJudges

