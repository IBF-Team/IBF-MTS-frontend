import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, checkToken, saveToken, saveTournament, checkLogin } from "../../utils/storageUtils";
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { MdAddCircle, MdIndeterminateCheckBox } from "react-icons/md";
import config from "../../config";


function Team(params) {
    const location = useLocation();
    const navigate = useNavigate();
    const [team, setTeam] = useState([]);
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
                    getPlayers();
                }
            })
            // getPlayers();
        }
    }, []);

    const getPlayers = async() => {
        console.log(location.state.team)
        const data = { tournament_id: location.state.tournament.id, team_name:location.state.team }
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
            console.log("fetching player team data...")
            const response = await fetch(config.API_BASE_URL + '/getTeam', requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                console.log(data.team)
                setTeam(data.team)
                return data.team
            } else {
                console.log("error getting the team")
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
                onClick={() => { navigate('/schedule', { state: { tournament: location.state.tournament, round: location.state.round, region: location.state.region} }) }}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size: 30 }}>
                    <BsFillArrowLeftCircleFill />
                </IconContext.Provider> Back to Schedule View
            </div>
            <h2 style={{ color: "orange", paddingLeft: "15px" }}>{location.state.name} Overview</h2>
            <ul class="a" style={{ color: "white", fontSize: "20px" }}>
                {
                    team.map((item, index) => {
                        if (item.name != location.state.team) {
                            return null
                        }
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
                                <li>{item.name}
                                <ul><li>ID: {item.id}</li>
                                <li>Region: {item.region}</li>
                                <li>Members: {item.members.join(", ")}</li>
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

export default Team