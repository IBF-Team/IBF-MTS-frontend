import React, {useState, useEffect} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {getToken, saveToken, checkLogin, getTournament, checkToken } from "../../utils/storageUtils";
import config from '../../config'
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import {AiFillEdit} from "react-icons/ai";
import {checkNames, get_defense_other_members, get_plaintiff_other_members} from "./functions";
import Popup from '../Popup/Popup';
import './TeamRosters.css';

var data1 = {
    teamName: "Early College High School Verdictbrae",
    PlaintiffWitness1: "Jordan Patel",
    PlaintiffWitness2: "Bobby Brennan",
    PlaintiffWitness3: "Alex Diaz",
    ProsecutionAttorney1: "Shayla Dina",
    ProsecutionAttorney2: "Dyson Korrine",
    ProsecutionAttorney3: "Sly Jayce",
    TimeKeeper: "Kalla Leyla",
    members: ["Jordan Patel","Bobby Brennan", "Alex Diaz", "Shayla Dina",
        "Dyson Korrine", "Sly Jayce", "Kalla Leyla", "Jannine Wilder", "Sherill Lauraine", "Kaycee Callista"],
    other_members: ["Jannine Wilder", "Sherill Lauraine", "Kaycee Callista"]
}
var data2 = {
    teamName: "Signature School Wasted Potential",
    DefenseWitness1: "Cameron Miller",
    DefenseWitness2: "Morgan DeLuca",
    DefenseWitness3: "Joe Strickland",
    DefenseAttorney1: "Walter White",
    DefenseAttorney2: "Sansa Stark",
    DefenseAttorney3: "Sherlock Holmes",
    TimeKeeper: "Thomas Shelby",
    members: ["Cameron Miller", "Morgan DeLuca", "Joe Strickland", "Walter White", "Sansa Stark", "Sherlock Holmes",
        "Thomas Shelby", "Tom Brady", "Kyrie Irving"],
    other_members:["Tom Brady","Kyrie Irving"]
}

var m_round = {
    state: 0
}

function TeamRosters(){
    return (
        RosterPage(data1, data2)
    );
}

function RosterPage(members1, members2){
    const location = useLocation();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(location.state? location.state.tournament:getTournament())
    const [round, setRound] = useState(location.state? location.state.round:m_round)
    const [courtroom_id, setCourtroomID] = useState(location.state? location.state.courtroom_id:0)
    const [plaintiffData, setPlaintiffData] = useState(data1)
    const [defenseData, setDefenseData] = useState(data2)
    const [editPlaintiff, setEditPlaintiff] = useState(false)
    const [editDefense, setEditDefense] = useState(false)
    const [loading, setLoading] = useState(false)
    const [DWitness1, setDWitness1] = useState("")
    const [DWitness2, setDWitness2] = useState("")
    const [DWitness3, setDWitness3] = useState("")
    const [DAttorney1, setDAttorney1] = useState("")
    const [DAttorney2, setDAttorney2] = useState("")
    const [DAttorney3, setDAttorney3] = useState("")
    const [DTimeKeeper, setDTimeKeeper] = useState("")
    const [PWitness1, setPWitness1] = useState("")
    const [PWitness2, setPWitness2] = useState("")
    const [PWitness3, setPWitness3] = useState("")
    const [PAttorney1, setPAttorney1] = useState("")
    const [PAttorney2, setPAttorney2] = useState("")
    const [PAttorney3, setPAttorney3] = useState("")
    const [PTimeKeeper, setPTimeKeeper] = useState("")
    const [invalidDefense, setInvalidDefense] = useState(false)
    const [invalidPlaintiff, setInvalidPlaintiff] = useState(false)
    const [invalidStr, setInvalidStr] = useState("")

    useEffect(() => {
        console.log("TeamRoster UseEffect")
        const login_stat = checkLogin()
        if (login_stat == false) {
            navigate('/require_login')
        } else if (location.state == undefined || location.state.tournament == undefined 
                    || location.state.courtroom_id == undefined) {
            navigate('/dashboard');
        } else {
            checkToken().then((expired) => {
                if (expired) {
                    navigate('/expired');
                } else {
                    if (location.state == undefined || location.state.tournament == undefined
                        || location.state.courtroom_id == undefined) {
                        navigate('/dashboard')
                    }  else {
                        console.log(round)
                        getTeamRoster()
                    }
                }
            });
            // console.log(round)
            // getTeamRoster();
        }
    }, []);

    const getTeamRoster = async()=>{
        const data = {tournament_id: tournament.id, match_id: courtroom_id}
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json',
                'Accept': 'application/json',
                //   Authorization: 'Bearer ' + getToken()
            },
            body: JSON.stringify(data)
        }
        try {
            console.log("fetching data")
            const response = await fetch(config.API_BASE_URL + "/getTeamRoster", requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                // saveToken(data.access_token);
                console.log(data)
                data.teamRoster.defenseData.other_members = get_defense_other_members(data.teamRoster.defenseData)
                data.teamRoster.plaintiffData.other_members = get_plaintiff_other_members(data.teamRoster.plaintiffData)
                setDefenseData(data.teamRoster.defenseData)
                setPlaintiffData(data.teamRoster.plaintiffData)
            } else {
                console.log("error fetching schedules")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const editD = () => {
        console.log("EditD Clicked")
        resetD()
        setEditDefense(!editDefense)
    }

    const editP = () => {
        console.log("EditP Clicked")
        resetP()
        setEditPlaintiff(!editPlaintiff)
    }

    const resetD = () => {
        setDWitness1(defenseData.DefenseWitness1)
        setDWitness2(defenseData.DefenseWitness2)
        setDWitness3(defenseData.DefenseWitness3)
        setDAttorney1(defenseData.DefenseAttorney1)
        setDAttorney2(defenseData.DefenseAttorney2)
        setDAttorney3(defenseData.DefenseAttorney3)
        setDTimeKeeper(defenseData.TimeKeeper)
        setInvalidDefense(false)
    }

    const resetP = () => {
        setPWitness1(plaintiffData.PlaintiffWitness1)
        setPWitness2(plaintiffData.PlaintiffWitness2)
        setPWitness3(plaintiffData.PlaintiffWitness3)
        setPAttorney1(plaintiffData.ProsecutionAttorney1)
        setPAttorney2(plaintiffData.ProsecutionAttorney2)
        setPAttorney3(plaintiffData.ProsecutionAttorney3)
        setPTimeKeeper(plaintiffData.TimeKeeper)
        setInvalidPlaintiff(false)
    }

    const updateTeamRosterDefense = async() => {
        let ret = checkNames(DWitness1, DWitness2, DWitness3, DAttorney1, DAttorney2, DAttorney3, DTimeKeeper, defenseData);
        if (!ret.valid) {
            setInvalidDefense(true)
            setInvalidStr(ret.invalid_str)
            return;
        }
        let newDefensefData = {
            teamName: defenseData.teamName,
            DefenseWitness1: DWitness1,
            DefenseWitness2: DWitness2,
            DefenseWitness3: DWitness3,
            DefenseAttorney1: DAttorney1,
            DefenseAttorney2: DAttorney2,
            DefenseAttorney3: DAttorney3,
            other_members: ret.other_members,
            TimeKeeper: DTimeKeeper
        }
        setDefenseData(newDefensefData)
        setLoading(true)
        const data = { tournament_id: tournament.id, match_id: courtroom_id, defenseData: newDefensefData};
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                //   Authorization: 'Bearer ' + getToken()
            },
            body: JSON.stringify(data)
        }
        try {
            console.log("fetching data")
            const response = await fetch(config.API_BASE_URL + '/updateTeamRosterDefense', requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                // saveToken(data.access_token);
                setEditDefense(false)
                setLoading(false)
            } else {
                console.log("error updating defense teamRoster")
            }
        } catch (error) {
            console.log(error)
        }

    }

    const updateTeamRosterPlaintiff = async() => {
        let ret = checkNames(PWitness1, PWitness2, PWitness3, PAttorney1, PAttorney2, PAttorney3, PTimeKeeper, plaintiffData);
        console.log("I am back")
        console.log(ret)
        if (!ret.valid) {
            console.log("Invalid!")
            setInvalidPlaintiff(true)
            setInvalidStr(ret.invalid_str)
            return;
        }
        let newPlaintiffData = {
            teamName: plaintiffData.teamName,
            PlaintiffWitness1: PWitness1,
            PlaintiffWitness2: PWitness2,
            PlaintiffWitness3: PWitness3,
            ProsecutionAttorney1: PAttorney1,
            ProsecutionAttorney2: PAttorney2,
            ProsecutionAttorney3: PAttorney3,
            TimeKeeper: PTimeKeeper,
            other_members: ret.other_members
        }
        setLoading(true)
        const data = { tournament_id: tournament.id, match_id: courtroom_id, plaintiffData: newPlaintiffData};
        const requestOptions = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                //   Authorization: 'Bearer ' + getToken()
            },
            body: JSON.stringify(data)
        }
        try {
            console.log("fetching data")
            const response = await fetch(config.API_BASE_URL + '/updateTeamRosterPlaintiff', requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                // saveToken(data.access_token);
                setPlaintiffData(newPlaintiffData)
                setEditPlaintiff(false)
                setLoading(false)
            } else {
                console.log("error updating Plaintiff teamRoster")
            }
        } catch (error) {
            console.log(error)
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
                onClick={()=>{navigate('/round', {state:{tournament: tournament, round:location.state.round, region:location.state.region}})}}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size:30 }}>
                    <BsFillArrowLeftCircleFill/>
                </IconContext.Provider> Back to Schedule
            </div>
            <h1 style={{textAlign: "center", color:"white", marginTop:50}}>Team Rosters</h1>
            <div id="team-1">
                <h1 style={{textAlign:"center"}}>{plaintiffData.teamName}
                    {round.state != 1 && <IconContext.Provider value={{ color: "black", className: "react-icons", size: 23 }}>
                        <AiFillEdit onClick={editP}/></IconContext.Provider>}
                </h1>
                <div id="team-members">
                    <div style={{height: "40px"}}>
                        <h3 style={{display:"inline-block"}}>Plaintiff Witness 1:</h3>
                        {editPlaintiff?
                            <input value={PWitness1}
                                   onChange={e => setPWitness1(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{plaintiffData.PlaintiffWitness1}</p>}
                    </div>
                    <div style={{height: "40px"}}>
                        <h3 style={{display:"inline-block"}}>Plaintiff Witness 2:</h3>
                        {editPlaintiff?
                            <input value={PWitness2}
                                   onChange={e => setPWitness2(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{plaintiffData.PlaintiffWitness2}</p>}
                    </div>
                    <div style={{height: "40px", paddingBottom: "10px"}}>
                        <h3 style={{display:"inline-block"}}>Plaintiff Witness 3:</h3>
                        {editPlaintiff?
                            <input value={PWitness3}
                                   onChange={e => setPWitness3(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{plaintiffData.PlaintiffWitness3}</p>}
                    </div>
                    <div style={{height: "40px"}}>
                        <h3 style={{display:"inline-block"}}>Prosecution Attorney:</h3>
                        {editPlaintiff?
                            <input value={PAttorney1}
                                   onChange={e => setPAttorney1(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{plaintiffData.ProsecutionAttorney1}</p>}
                    </div>
                    <div style={{height: "40px"}}>
                        <h3 style={{display:"inline-block"}}>Prosecution Attorney:</h3>
                        {editPlaintiff?
                            <input value={PAttorney2}
                                   onChange={e => setPAttorney2(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{plaintiffData.ProsecutionAttorney2}</p>}
                    </div>
                    <div style={{height: "40px", paddingBottom: "10px"}}>
                        <h3 style={{display:"inline-block"}}>Prosecution Attorney:</h3>
                        {editPlaintiff?
                            <input value={PAttorney3}
                                   onChange={e => setPAttorney3(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{plaintiffData.ProsecutionAttorney3}</p>}
                    </div>
                    <div style={{height: "40px", paddingBottom: "20px"}}>
                        <h3 style={{display:"inline-block"}}>Time Keeper:</h3>
                        {editPlaintiff?
                            <input value={PTimeKeeper}
                                   onChange={e => setPTimeKeeper(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{plaintiffData.TimeKeeper}</p>}
                    </div>
                    {editPlaintiff?
                        <div>
                            <button onClick={editP}>Cancel</button>
                            <button onClick={resetP} style={{marginLeft: 20}}>Reset</button>
                            <button onClick={updateTeamRosterPlaintiff} style={{marginLeft:20}}>Confirm</button>
                            {invalidPlaintiff? <div style={{color:"red"}}><p>{invalidStr}</p>
                                    <p>Choose From: {plaintiffData.members.join("; ")}</p></div>
                                : null}
                            {loading? <p style={{color: "red"}}>  Updating</p>: null}
                        </div>
                        : null}
                    <h3>Other Team Members:</h3>
                    {
                        plaintiffData.other_members.map((item) => {
                                return (
                                    <p style={{textAlign: "left"}}>{item}</p>
                                )
                            }
                        )
                    }
                </div>
            </div>
            <div id="team-2">
                <h1 style={{textAlign:"center"}}>{defenseData.teamName}
                    {round.state && <IconContext.Provider value={{ color: "black", className: "react-icons", size: 23 }}>
                        <AiFillEdit onClick={editD}/></IconContext.Provider>}
                </h1>
                <div id="team-members">
                    <div style={{height: "40px"}}>
                        <h3 style={{display:"inline-block"}}>Defense Witness 1:</h3>
                        {editDefense?
                            <input value={DWitness1}
                                   onChange={e => setDWitness1(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{defenseData.DefenseWitness1}</p>}
                    </div>
                    <div style={{height: "40px"}}>
                        <h3 style={{display:"inline-block"}}>Defense Witness 2:</h3>
                        {editDefense?
                            <input value={DWitness2}
                                   onChange={e => setDWitness2(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{defenseData.DefenseWitness2}</p>}
                    </div>
                    <div style={{height: "40px", paddingBottom: "10px"}}>
                        <h3 style={{display:"inline-block"}}>Defense Witness 3:</h3>
                        {editDefense?
                            <input value={DWitness3}
                                   onChange={e => setDWitness3(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{defenseData.DefenseWitness3}</p>}
                    </div>
                    <div style={{height: "40px"}}>
                        <h3 style={{display:"inline-block"}}>Defense Attorney:</h3>
                        {editDefense?
                            <input value={DAttorney1}
                                   onChange={e => setDAttorney1(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{defenseData.DefenseAttorney1}</p>}
                    </div>
                    <div style={{height: "40px"}}>
                        <h3 style={{display:"inline-block"}}>Defense Attorney:</h3>
                        {editDefense?
                            <input value={DAttorney2}
                                   onChange={e => setDAttorney2(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{defenseData.DefenseAttorney2}</p>}
                    </div>
                    <div style={{height: "40px", paddingBottom: "10px"}}>
                        <h3 style={{display:"inline-block"}}>Defense Attorney:</h3>
                        {editDefense?
                            <input value={DAttorney3}
                                   onChange={e => setDAttorney3(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{defenseData.DefenseAttorney3}</p>}
                    </div>
                    <div style={{height: "40px", paddingBottom: "20px"}}>
                        <h3 style={{display:"inline-block"}}>Time Keeper:</h3>
                        {editDefense?
                            <input value={DTimeKeeper}
                                   onChange={e => setDTimeKeeper(e.target.value)}></input>
                            :<p style={{display:"inline-block", padding: "1rem"}}>{defenseData.TimeKeeper}</p>}
                    </div>
                    {editDefense?
                        <div>
                            <button onClick={editD}>Cancel</button>
                            <button onClick={resetD} style={{marginLeft: 20}}>Reset</button>
                            <button onClick={updateTeamRosterDefense} style={{marginLeft:20}}>Confirm</button>
                            {invalidDefense? <div style={{color:"red"}}><p>{invalidStr}</p>
                                    <p>Choose From: {defenseData.members.join("; ")}</p></div>
                                : null}
                            {loading? <p style={{color: "red"}}>  Updating</p>: null}
                        </div>
                        : null}
                    <h3>Other Team Members:</h3>
                    {
                        defenseData.other_members.map((item) => {
                                return (
                                    <p style={{textAlign: "left"}}>{item}</p>
                                )
                            }
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default TeamRosters;