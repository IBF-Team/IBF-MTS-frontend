import React, { useState, useEffect } from "react";
import './Tournament.css'
import { useLocation, useNavigate } from "react-router-dom";
import { checkLogin, getTournament,saveRound, saveTournament, checkToken } from '../../utils/storageUtils'
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import {AiFillEdit} from "react-icons/ai";
import config from "../../config";
import Popup from '../Popup/Popup';

var data = [
    {
        id: 1,
        name: "Round1",
        status: 1
    },
    {
        id: 2,
        name: "Round2",
        status: 1
    },
    {
        id: 3,
        name: "Round3",
        status: 1
    },
    {
        id: 4,
        name: "Round4",
        status: 1
    },
    // {
    //     id: 5,
    //     name: "Round5",
    //     status: -1
    // }
]



function Tournament(params) {
    const location = useLocation();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(location.state ? location.state.tournament : getTournament())
    const [name, setName] = useState(location.state ? location.state.tournament.name : "");
    const [edit, setEdit] = useState(false)
    const [rounds, setRounds] = useState([]) // should fetch from backend
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        console.log("UseEffect")
        const login_stat = checkLogin()
        if (login_stat == false) {
            navigate('/require_login')
        } else if (location.state == undefined || location.state.tournament == undefined) {
            navigate('/dashboard')
        } else {
            checkToken().then((expired) => {
                if (expired) {
                    navigate('/expired');
                } else {
                    console.log("tournament tournament", tournament)
                    get_rounds().then((response) => {
                    appendRound(response)
            })
                }
            })
            // console.log("tournament tournament", tournament)
            // get_rounds().then((response) => {
            //     appendRound(response)
            // })
        }
    }, []);

    const appendRound = (rounds) => {
        if (rounds == undefined) {
            setRounds(data);
            return;
        }
        var size = rounds.length
        var new_rounds = [...rounds]
        if ((size == 0 && tournament.team_uploaded == 1) ||
            (size > 0 && rounds[size - 1].id < 5 && rounds[size - 1].status == 1)) {
            new_rounds.push({
                id: size + 1,
                name: "Round" + (size + 1),
                status: -1
            });
            setRounds(new_rounds);
            console.log(new_rounds)
        } else {
            setRounds(rounds)
            console.log(rounds)
        }
    }

    const get_rounds = async () => {
        const data = { tournament_id: location.state.tournament.id }
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
            console.log("getting rounds")
            const response = await fetch(config.API_BASE_URL + '/getRounds', requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                // saveToken(data.access_token);
                setTournament(data.tournament)
                saveTournament(data.tournament)
                console.log(data.rounds)
                return data.rounds
            } else {
                console.log("error renaming tournament")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const changeName = async () => {
        setLoading(true)
        const data = { tournament_id: tournament.id, name: name}
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
            const response = await fetch(config.API_BASE_URL + '/changeTournamentName', requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                // saveToken(data.access_token);
                setTournament((prev) => ({
                    ...prev,
                    name: name
                }))
                setEdit(false)
                setIsOpen(false)
            } else {
                console.log("error fetching tournament")
            }
        } catch (error) {
            console.log(error)
        }
        setLoading(false);
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
                    marginBottom: 40
                }}
                onClick={() => { navigate('/tournaments') }}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size: 30 }}>
                    <BsFillArrowLeftCircleFill />
                </IconContext.Provider> Back to Tournaments
            </div>
            {edit?
                <div style={{margin: '20px'}}>
                    <input value={name} onChange={e => setName(e.target.value)}></input>
                    <button style={{marginLeft: 10}} onClick={()=>{setIsOpen(true)}}>Submit</button>
                    <button style={{marginLeft: 10}} onClick={()=>{setEdit(false)}}>Cancel</button>
                </div>:
                <div onClick={()=>{setEdit(true)}}><h3 style={{color: "orange", margin: '20px',}}>{tournament.name}
                    <IconContext.Provider value={{ color: "white", className: "react-icons", size: 23 }}>
                        <AiFillEdit />
                    </IconContext.Provider></h3></div>}
            {rounds.map((round, index) => {
                return (
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            justifyContent: 'center',
                            margin: '20px',
                            color: "white",
                        }}
                        key={index}>
                        <li style={{ cursor: 'pointer', textDecorationLine: "underline" }}
                            onClick={() => {
                                console.log("tournament -> round", tournament);
                                saveRound(round);
                                navigate('/round', { state: { tournament: tournament, round: round } });
                            }}>{round.name} {round.status == 0 ? " (Ongoing) " : (round.status == -1 ? "(Create Schedules)" : "")}</li>
                    </div>
                );
            })}
            <br />
            <div
                style={{
                    color: "orange",
                    fontSize: 20,
                    marginTop: 20,
                    textAlign: "center",
                    display: "inline-block",
                    cursor: 'pointer',
                    margin: 20,
                    textDecorationLine: "underline"
                }}
                onClick={() => { navigate('/upload', { state: { tournament: tournament } }) }}>
                Upload Teams and/or Judges for this tournament
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    margin: '20px',
                    color: "orange",
                    cursor: 'pointer',
                    textDecorationLine: "underline"
                }}
                onClick={() => {navigate('/teamoverview', {state:{tournament:tournament}})}}>
                View teams
            </div>
            {isOpen? <Popup
                content={
                    <div>
                        <h4>Change the name to "{name}"?</h4>
                        <button onClick={()=>{setIsOpen(false)}} style={{float: 'left'}}>Cancel</button>
                        <button onClick={changeName} diabled={loading} style={{float: 'right'}}>Confirm</button>
                        {loading? <p style={{color: "red"}}>  Changing Tournament Name... </p>:null}
                    </div>
                }
                handleClose={()=>{setIsOpen(!isOpen);}}
            />: null}
        </div>
    );
}


export default Tournament;