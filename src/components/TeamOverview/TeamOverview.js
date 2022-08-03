import React, { useState, useEffect } from "react";
import { renderMatches, useLocation, useNavigate } from "react-router-dom";
import { getUser, checkToken, saveToken, saveTournament, checkLogin } from "../../utils/storageUtils";
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import {AiFillEdit} from "react-icons/ai";
import { MdAddCircle, MdIndeterminateCheckBox } from "react-icons/md";
import config from "../../config";

function TeamOverview(params) {
    const location = useLocation();
    const navigate = useNavigate();
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const login_stat = checkLogin()
        if (login_stat == false) {
            navigate('/require_login')
        } else {
            checkToken().then((expired) => {
                if (expired) {
                    navigate('/expired');
                } else {
                    getTeams();
                }
            });
            // getTeams();
            
        }
    }, []);

    const getTeams = async () => {
        console.log(location.state.tournament.id)
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
            console.log("fetching team data...")
            const response = await fetch(config.API_BASE_URL + '/getTeams', requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                // console.log(data.teams)
                // console.log(data.teams[0].members)
                setTeams(data.teams)
                return data.teams
            } else {
                console.log("error getting teams")
                console.log('\tbad data', data)
            }
        } catch (error) {
            console.log(error)
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
                onClick={() => { navigate('/tournament', { state: { tournament: location.state.tournament } }) }}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size: 30 }}>
                    <BsFillArrowLeftCircleFill />
                </IconContext.Provider> Back to Tournament View
            </div>
            <h2 style={{ color: "orange", paddingLeft: "15px" }}>Teams List</h2>
            <ul class="a" style={{ color: "white", fontSize: "20px" }}>
                {
                    teams.map((item, index) => {
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    margin: '20px',
                                    color: "white",
                                }}>
                                <li>
                                    <label onClick={()=>{navigate("/editTeam", {state:{tournament:location.state.tournament, team:item}})}}>
                                    {item.name}{item.wild? " (Wild Card Team)":""}
                                <IconContext.Provider value={{ color: "white", className: "react-icons", size: 23 }}>
                                <AiFillEdit/>
                                </IconContext.Provider></label>
                                <ul>
                                    <li>ID: {item.id}</li>
                                    <li>Region: {item.region}</li>
                                    <li>Team Members: {item.members.join(", ")}</li>
                                </ul>
                                </li>
                            </div>
                        )
                    })
                }
            </ul>
        </div>
    )
}

export default TeamOverview;