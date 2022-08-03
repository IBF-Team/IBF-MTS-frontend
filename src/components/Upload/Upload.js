import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { checkLogin, getTournament, checkToken } from '../../utils/storageUtils'
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Popup from '../Popup/Popup';
import config from '../../config';
import "./Upload.css";


const error1 = "The tournament has begun, cannot change judges/teams anymore!";
const warning1 = "Are you sure to upload new teams to replace the existing teams?";
const warning2 = "Are you sure to ipload new judges to replace the existing judges?";
const warning3 = "Are you sure to upload new wild card teams to replace the existing wild card teams?";

export default function Upload() {
    const location = useLocation();
    const navigate = useNavigate();
    const [token, setToken] = useState();
    const [tournament, setTournament] = useState(location.state ? location.state.tournament : getTournament())
    const [selectedTeamFile, setSelectedTeamFile] = useState();
    const [isFileTeamPicked, setIsFileTeamPicked] = useState(false);
    const [selectedJudgeFile, setSelectedJudgeFile] = useState();
    const [isFileJudgePicked, setIsFileJudgePicked] = useState(false);
    const [selectedWildFile, setSelectedWildFile] = useState();
    const [isFileWildPicked, setIsFileWildPicked] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [teamUploaded, setTeamUploaded] = useState(false);
    const [judgeUploaded, setJudgeUploaded] = useState(false);
    const [wildUploaded, setWildUploaded] = useState(false);
    const [header, setHeader] = useState("")
    const [msg, setMsg] = useState("")
    const [buttonTxt, setButtonTxt] = useState(" OK ")
    const [open, setOpen] = useState(false);
    const [pass, setPass] = useState(false);

    useEffect(() => {
        console.log("upload UseEffect")
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
                    setTournament(location.state.tournament)
                }
            });
            // setTournament(location.state.tournament)
        }
    }, []);

    const changeTeamHandler = (e) => {
        setSelectedTeamFile(e.target.files[0]);
        setIsFileTeamPicked(true);
    }

    const changeJudgeHandler = (e) => {
        setSelectedJudgeFile(e.target.files[0]);
        setIsFileJudgePicked(true);
    }

    const changeWildHandler = (e) => {
        setSelectedWildFile(e.target.files[0]);
        setIsFileWildPicked(true);
    }

    const handleButton = () => {
        if (buttonTxt === " OK ") {
            setOpen(false);
        } else if (msg === warning1) {
            handleSubmissionTeam()
        } else if (msg === warning2) {
            handleSubmissionJudge()
        } else if (msg === warning3) {
            handleSubmissionWild()
        }
    }

    const handleSubmissionJudge = async () => {
        if (tournament.current_round >= 1) {
            // The tournament has begun, cannot change judges anymore
            setOpen(true);
            setHeader("Error");
            setMsg(error1);
            setButtonTxt(" OK ");
            return;
        } else if (!pass && tournament.judge_uploaded == 1) {
            // Replace the judges
            setOpen(true);
            setHeader("Replace Judges?")
            setMsg(warning2);
            setButtonTxt("Confirm");
            setPass(true);
            return;
        } else {
            setOpen(true);
            setHeader("");
            setMsg("");
            setButtonTxt(" OK ");
        }
        setUploading(true);
        const formData = new FormData();
        formData.append('File', selectedJudgeFile);
        formData.append('tournament_id', tournament.id)
        const requestOptions = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                //   Authorization: 'Bearer ' + getToken()
            },
            body: formData
        }
        try {
            const response = await fetch(config.API_BASE_URL + "/uploadjudge", requestOptions);
            const data = await response.json();
            if (data.code == 0) {
                console.log('Successful Team upload:', data);
                setTournament((prev) => ({
                    ...prev,
                    judge_uploaded: 1
                }))
                setUploading(false);
                setJudgeUploaded(true);
                setOpen(false);
            } else if (data.code == -4) {
                setUploading(false);
                let missed = data.missed
                // Warn Missing Colums
                setHeader("Error");
                setMsg("Missing Colums: " + missed);
                setButtonTxt(" OK ");
            } else {
                setUploading(false);
                setHeader("Error");
                setMsg("Error uploading judge File. Please try Again")
                setButtonTxt(" OK ");
                console.error('Error uploading judge file:');
                console.log(data.msg)
            }
            setUploading(false);
        } catch (error) {
            console.error('Error uploading judge file:', error);
            setUploading(false);
        }
        setPass(false);
    }

    const handleSubmissionTeam = async () => {
        console.log(tournament)
        if (tournament.current_round >= 1) {
            // The tournament has began, cannot change teams anymore
            setOpen(true);
            setHeader("Error");
            setMsg(error1);
            setButtonTxt(" OK ");
            return;
        }
        if (!pass && tournament.team_uploaded == 1) {
            // Replace the teams
            setOpen(true);
            setHeader("Replace Teams?");
            setMsg(warning1);
            setButtonTxt("Confirm");
            setPass(true);
            return;
        } else {
            setOpen(true);
            setHeader("");
            setMsg("");
            setButtonTxt(" OK ");
        }
        setUploading(true)
        const formData = new FormData();
        formData.append('File', selectedTeamFile);
        formData.append('tournament_id', tournament.id)
        formData.append('wild', 0)
        const requestOptions = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                //   Authorization: 'Bearer ' + getToken()
            },
            body: formData
        }
        try {
            const response = await fetch(config.API_BASE_URL + "/uploadteam", requestOptions);
            const data = await response.json();
            if (data.code == 0) {
                console.log('Successful Team upload:', data);
                setTournament((prev) => ({
                    ...prev,
                    team_uploaded: 1
                }))
                setTeamUploaded(true)
                setOpen(false);
                setUploading(false);
            } else if (data.code == -4) {
                setUploading(false);
                let missed = data.missed
                setHeader("Error");
                setMsg("Missing Colums: " + missed);
                setButtonTxt(" OK ");
            } else {
                setUploading(false);
                setHeader("Error");
                setMsg("Error uploading team File. Please try Again")
                setButtonTxt(" OK ");
                console.error('Error uploading team file:');
                console.log(data.msg)
            }
        } catch (error) {
            console.error('Error uploading team file:', error);
            setUploading(false);
        }
        setPass(false);
    }

    const handleSubmissionWild = async () => {
        if (!pass && tournament.wild_uploaded == 1) {
            // Replace the teams
            setOpen(true);
            setHeader("Relace Wild Card Teams?");
            setMsg(warning3);
            setButtonTxt("Comfirm")
            setPass(true);
            return;
        }
        setUploading(true)
        setHeader("");
        setMsg("");
        setButtonTxt(" OK ");
        setOpen(true)
        const formData = new FormData();
        formData.append('File', selectedWildFile);
        formData.append('tournament_id', tournament.id)
        formData.append('wild', 1)
        const requestOptions = {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                //   Authorization: 'Bearer ' + getToken()
            },
            body: formData
        }
        try {
            const response = await fetch(config.API_BASE_URL + "/uploadteam", requestOptions);
            const data = await response.json();
            if (data && data.code == 0) {
                console.log('Successful Wild Team upload:', data);
                setTournament((prev) => ({
                    ...prev,
                    wild_uploaded: 1
                }))
                setUploading(false);
                setWildUploaded(true);
                setOpen(false);
            } else if (data.code == -4) {
                setUploading(false);
                setHeader("Error")
                setMsg("Missing columns: " + data.missed);
                setButtonTxt(" OK ")
            } else if (data.code == -5) {
                setUploading(false);
                setHeader("Error");
                setMsg("Expecting 4 Wild Card Teams...");
                setButtonTxt(" OK ");
            } else {
                setUploading(false);
                setHeader("Error");
                setMsg("Error uploading wild card teams. Please try Again")
                setButtonTxt(" OK ");
                console.error('Error uploading team file:');
                console.log(data.msg)
            }
        } catch (error) {
            console.error('Error uploading team file:', error);
            setUploading(false);
        }
    }

    // if (!token) {
    //     return <Login setToken={setToken} />
    // }
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
                onClick={() => { navigate('/tournament', { state: { tournament: tournament } }) }}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size: 30 }}>
                    <BsFillArrowLeftCircleFill />
                </IconContext.Provider> Back to Tournament
            </div>
            <div style={{ color: "orange", margin: 20 }}>
                <h2>Upload Teams for the Tournament</h2>
                {/* <label for="file-upload" class="custom-file-upload">
                    Choose File
                </label> */}
                <input class="custom-file-input" type="file" name="file" onChange={changeTeamHandler} accept=".csv,.xls,.xlsx" />
                <button onClick={handleSubmissionTeam}>Submit</button>
                {teamUploaded ? <p style={{ color: "#32a852" }}>Teams uploaded</p> : null}
            </div>
            <div style={{ color: "orange", margin: 20, marginTop: 50 }}>
                <h2>Upload Judges for the Tournament</h2>
                <input class="custom-file-input" type="file" name="file" onChange={changeJudgeHandler} accept=".csv,.xls,.xlsx" />
                <button onClick={handleSubmissionJudge}>Submit</button>
                {judgeUploaded ? <p style={{ color: "#32a852" }}>Judges uploaded</p> : null}
            </div>
            <div style={{ color: "orange", margin: 20, marginTop: 50 }}>
                <h2>Upload Wild Card Teams for the State Finals</h2>
                <input class="custom-file-input" type="file" name="file" onChange={changeWildHandler} accept=".csv,.xls,.xlsx" />
                <button onClick={handleSubmissionWild}>Submit</button>
                {wildUploaded ? <p style={{ color: "#32a852" }}>Wild Card Teams uploaded</p> : null}
            </div>
            {open ? <Popup
                content={
                    <div>
                        <h4>{header}</h4>
                        <p>{msg}</p>
                        {uploading ? <p style={{ color: "red" }}>Uploading File...</p> : null}
                        <div style={{ flexDirection: "row" }}>
                            <button disabled={uploading} onClick={() => { setOpen(false) }} style={{ float: 'left' }}>Cancel</button>
                            <button disabled={uploading} onClick={handleButton} style={{ float: 'right' }}>{buttonTxt}</button>
                        </div>

                    </div>
                }
                handleClose={() => { setOpen(false); }}
            /> : null}
        </div>
    )
}