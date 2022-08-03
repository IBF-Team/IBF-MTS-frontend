import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { checkToken, getRound, getTournament, getToken, saveToken, checkLogin } from "../../utils/storageUtils";
import { Link } from "react-router-dom";
import config from '../../config'
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import "./ScoreOverview.css"

function ScoreOverview(params) {
    const location = useLocation();
    const navigate = useNavigate();
    const [scores, setScores] = useState([]);
    const [tournament, setTournament] = useState(location.state ? location.state.tournament : undefined)
    const [round, setRound] = useState(location.state ? location.state.round : undefined)

    useEffect(() => {
        console.log("scoreoverview useeffect")

        const login_stat = checkLogin()
        if (login_stat == false) {
            navigate('/require_login')
        } else {
            checkToken().then((expired) => {
                if (expired) {
                    navigate('/expired');
                } else {
                    console.log(round)
                    getScores()
                }
            })
            // console.log(round)
            // getScores();
        }
    }, []);

    const getScores = async () => {
        // tournament id
        const data = { tournament_id: location.state.tournament.id, round_id: location.state.round.id }
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
            const response = await fetch(config.API_BASE_URL + '/getScoreOverview', requestOptions);
            const data = await response.json();
            console.log(data)
            if (data && data.code == 0) {
                setScores(data.matches)
                console.log(data)
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
                onClick={() => { navigate('/round', { state: { tournament: location.state.previous_state.tournament, round: round } }) }}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size: 30 }}>
                    <BsFillArrowLeftCircleFill />
                </IconContext.Provider> Back to Round View
            </div>
            <h2 style={{ color: "orange", paddingLeft: "15px" }}>Round {round.id} Overview </h2>
            <div class="container">
                {
                    scores.map((item, index) => {
                        return (
                            // <div
                            //     style={{
                            //         display: 'flex',
                            //         flexDirection: 'column',
                            //         alignItems: 'flex-start',
                            //         justifyContent: 'center',
                            //         margin: '20px',
                            //         color: "white",
                            //     }}>
                            //     <li>Courtroom {item.id}, Winner: {item.winner_team}
                            //         <ul class="ul.no-bullets">
                            //             <li>Defense: {item.teams[0]}
                            //                 <ul><li>
                            //                     Defense score: {item.defense_score}
                            //                 </li>
                            //                 </ul>
                            //             </li>
                            //             <li>Plaintiff: {item.teams[1]}
                            //                 <ul><li>
                            //                     Plaintiff score: {item.plaintiff_score}
                            //                 </li>
                            //                 </ul>
                            //             </li>
                            //         </ul>
                            //     </li>

                            <div className="item">
                                <div className="courtroom"> Courtroom {item.id} <span> Winner: {item.winner_team} </span> </div>
                                <div className="item-info">
                                    <div className={`sub-item defense ${item.winner_team == item.teams[0] ? "winner" : ""}`}>
                                        <div> Defense </div>
                                        <div> {item.teams[0]} </div>
                                        <div> Score: {item.defense_score} </div>
                                    </div>
                                    <div className={`sub-item plaintiff ${item.winner_team == item.teams[1] ? "winner" : ""}`}>
                                        <div> Plaintiff </div>
                                        <div> {item.teams[1]} </div>
                                        <div> Score: {item.plaintiff_score} </div>
                                    </div>
                                </div>
                            </div>
                            // </div>
                        )
                    })
                }
            </div>
        </div>
    )

}

export default ScoreOverview