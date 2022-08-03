import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import '../../utils/storageUtils'
import { saveRound, getRound, getTournament, checkToken, checkLogin, saveTournament } from "../../utils/storageUtils";
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { MdAddCircle } from "react-icons/md";
import config from '../../config'
import Popup from '../Popup/Popup';

var data = ["West", "East"]
var my_round = {
    id: 1,
    name: "Round1",
    status: 1
}

function Round() {
    const location = useLocation();
    const navigate = useNavigate();
    // const [tournament_id, setTournamentID] = useState(getTournament())
    // const [round_id, setRound] = useState(getRound()) 
    const [tournament, setTournament] = useState(location.state? location.state.tournament:getTournament())
    const [round, setRound] = useState(location.state?location.state.round:getRound())
    const [regions, setRegions] = useState([]) // fetch from backend
    const [selectedFile, setSelectedFile] = useState();
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [open, setOpen] = useState(false)
    const [header, setHeader] = useState("")
    const [msg, setMsg] = useState("")
    const [loading, setLoading] = useState(false)
    const [uploading, setUploading] = useState(false);
    const [scoreUploaded, setUploaded] = useState(false)
    const [refresh, setRefresh] = useState(false)
    useEffect(() => {
        console.log("Round UseEffect")
        const login_stat = checkLogin()
        if (login_stat === false) {
            navigate('/require_login')
        } else {
            checkToken().then((expired) => {
                if (expired) {
                    navigate('/expired');
                } else {
                    console.log("location.state.round", location.state.round)
                    if (location.state == undefined || location.state.tournament == undefined 
                        || location.state.round == undefined) {
                        navigate('/dashboard');
                    }  else {
                        console.log("round tournament", tournament)
                        console.log("round round", round)
                        if (round.status != -1) 
                            get_regions()
                    }
                }
            });
            // console.log("location.state.round", location.state.round)
            // if (location.state == undefined || location.state.tournament == undefined 
            //     || location.state.round == undefined) {
            //     navigate('/dashboard');
            // }  else {
            //     console.log("round tournament", tournament)
            //     console.log("round round", round)
            //     if (round.status != -1) 
            //         get_regions()
            // }
        }
    }, [refresh]);

    const get_regions = async() => {
        try {
            const body = {tournament_id: location.state.tournament.id, round_id:round.id}
            const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json',
                      'Accept': 'application/json',
                      //   Authorization: 'Bearer ' + getToken()
                     },
            body: JSON.stringify(body)
        }
            console.log("fetching data")
            const response = await fetch(config.API_BASE_URL + "/getRegions", requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                // saveToken(data.access_token);
                console.log(data)
                setRound(data.round);
                setTournament(data.tournament);
                saveTournament(data.tournament);
                setRegions(data.regions)
            } else {
                console.log("error fetching regions")
            }
        } catch (error) {
            console.log(error)
        }
    };

    const createSchedules = async() => {
        console.log(tournament)
        if (round.id == 4 && tournament.wild_uploaded == 0) {            // You need to upload wild card teams first
            setHeader("Error")
            setMsg("Wild card teams are not uploaded!")
            setOpen(true);
            return
        }
        setLoading(true)
        console.log(tournament)
        const data = {tournament_id: tournament.id, round_num:round.id}
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
            const response = await fetch(config.API_BASE_URL + "/createSchedules", requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                // saveToken(data.access_token);
                setRound((prev) => ({
                    ...prev,
                    status: 0
                }))
                setRefresh(!refresh)
            } else {
                console.log("error creating schedules")
            }
            setLoading(false)

        } catch (error) {
            console.log(error)
        }
    }

    const changeHandler = (e) => {
        setSelectedFile(e.target.files[0]);
        setIsFilePicked(true);
    };

    const handleSubmission = async() => {
        setUploading(true)
        setHeader("")
        setMsg("Uploading and saving scores to the database...")
        setOpen(true);
        const formData = new FormData();
        formData.append('File', selectedFile);
        formData.append("tournament_id", tournament.id);
        formData.append("round_num", round.id)
        const requestOptions = {
            method: "POST",
            headers: {'Accept': 'application/json',
                      //   Authorization: 'Bearer ' + getToken()
                     },
            body: formData
        }
        try {
            const response = await fetch(config.API_BASE_URL + "/uploadScore", requestOptions);
            const data = await response.json();
            console.log("upload score response", data)
            if (data.code == 0) {
                console.log('Successful score upload:', data);
                setTournament(data.tournament);
                setRound((prev) => ({
                    ...prev,
                    status: 1
                }))
                setRefresh(!refresh)
                setUploaded(true)
                setOpen(false)
            } else if (data.code == -4) {
                setUploading(false);
                let missed = data.missed
                // Warn Missing Colums
                setHeader("Error");
                setMsg("Missing Columns: " + missed);
            } else if (data.code == -5) {
                setHeader("Error");
                setMsg("Courtroom" + data.wrong_courtroom + " Not Found!");
            } else {
                setHeader("Error");
                setMsg("Something Went Wrong")
                console.error('Error uploading score file:');
            }
            setUploading(false);
        } catch (error) {
            setUploading(false);
            console.error('Error score file:', error);
        }
    };

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
            onClick={()=>{navigate('/tournament', {state: {tournament: tournament}})}}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size:30 }}>
                <BsFillArrowLeftCircleFill/>
                </IconContext.Provider> Back to Rounds </div>
            <div style={{color: "orange", margin:10}}><h2>Round{round.id} Schedules:</h2></div>
            {round.status != undefined && round.status == -1? 
             <div
                style={{color: "white", margin:10, textAlign: "center", display: "inline-block", cursor: "pointer"}}
                onClick={createSchedules}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size:35 }}>
                <MdAddCircle/>
                </IconContext.Provider> Create Schedules for Round{round.id}
                {loading? <p style={{color: "orange" }}>  Creating Schedules... </p>:null}
            </div>
             :null}
            {regions.map((region, index) => {
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
                        <li style={{cursor:'pointer', textDecorationLine: "underline"}}
                            onClick={() => {
                            navigate('/schedule', {state:{tournament: tournament, round: round, region:region}})
                        }}> {region == "StateWide"?
                        (round.id == 4? "State Final":"Championship Trial")
                        : region + " Regional Competition"}</li>
                    </div>
                );
            })}
            {round.status == 0 ?
             ((<div style={{marginTop:100, margin:10}}>
                <h1 style={{color: "orange"}}>Upload Round{round.id} Scores</h1>
                <input  style={{color: "white"}} type="file" name="file" onChange={changeHandler} accept=".csv,.xls,.xlsx" />
                <button onClick={handleSubmission}>Submit</button>
                {scoreUploaded? <p style={{color:"#32a852"}}>Scores uploaded</p>:null}
             </div>)) :
             (round.status == 1? <div style={{marginTop:100, marginLeft:10}}>
                <h2 style={{color: "orange", cursor: 'pointer', textDecorationLine: "underline"}}
                    onClick={()=>{navigate("/scoreoverview", {state:{tournament: tournament, round:round, previous_state: location.state}})}}
                >View Round {round.id} Scores</h2></div>
                :null)
            }
            {open? <Popup
                content={
                  <div>
                  <h4>{header}</h4>
                  <p>{msg}</p>
                  <div>
                  <button onClick={()=>{setOpen(false)}} style={{float: 'left'}}>Cancel</button>
                  <button disabled={uploading} onClick={()=>{setOpen(false)}}  style={{float: 'right'}}> OK </button>
                  </div>
                  </div>
                }
                handleClose={()=>{setOpen(false);}}
            />: null}
        </div>
    );
}


export default Round;
