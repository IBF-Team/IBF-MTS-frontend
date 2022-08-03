import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { saveRound, getRound, getTournament, getToken, checkToken, checkLogin } from "../../utils/storageUtils";
import { Link } from "react-router-dom";
import config from '../../config'
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";


function ScoreMatch(params) {
    const location = useLocation();
    const navigate = useNavigate();
    const [scores, setScores] = useState([]);
    const [actual, setActual] = useState([]);
    // const [round, setRound] = useState(location.state?location.state.round:getRound())

    useEffect(() => {
        const login_stat = checkLogin()
        if (login_stat == false) {
            navigate('/require_login')
        } else {
            checkToken().then((expired) => {
                if (expired) {
                    navigate('/expired');
                } else {
                    console.log(location.state.tournament.id)
                    console.log(location.state.round)
                    getScores()
                }
            });
            // console.log(location.state.tournament.id)
            // console.log(location.state.round)
            // getScores()
        }
    }, []);

    const getScores = async () => {
        // tournament id
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
            const response = await fetch(config.API_BASE_URL + '/getScores', requestOptions);
            const data = await response.json();
            //console.log(data)
            if (data && data.code == 0) {
                setScores(data.teams)
                console.log(data.teams.courtroom)

                return data
            } else {
                console.log("error getting score")
                console.log("\tbad data", data)
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
                onClick={() => { navigate('/round', { state: { tournament: location.state.tournament, round: location.state.round } }) }}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size: 30 }}>
                    <BsFillArrowLeftCircleFill />
                </IconContext.Provider> Back to Round View
            </div>
            <h2 style={{ color: "orange", paddingLeft: "15px" }}>Round {location.state.round_id}, Courtroom {location.state.courtroom} Score Overview</h2>
            {
                scores.map((item, index) => {

                    if (item.courtroom == location.state.courtroom && (item.defense == location.state.first_side || item.plaintiff == location.state.first_side)) {
                        console.log("10000000")
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
                            <li>Scores:
                                <ul>
                                    <li>Defense: {item.defense}
                                    <li>
                                        defense score: {item["defense score"]}
                                    </li>
                                    </li>
                                    
                                    <li>Plaintiff: {item.plaintiff}
                                    <li>
                                        plaintiff score: {item["plaintiff score"]}
                                    </li>
                                    </li>
                                </ul>
                            </li>
                        </div>
                    )
                    }
                    else return null
                })
            }
        </div>
    )

}

export default ScoreMatch