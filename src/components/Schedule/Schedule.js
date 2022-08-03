import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link} from "react-router-dom";
import {getToken, checkToken, checkLogin, getTournament } from "../../utils/storageUtils";
import DateTimePicker from 'react-datetime-picker';
import config from '../../config'
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import Popup from '../Popup/Popup';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
var data = [
    {
        courtroom: 1,
        sides: {
            first: "Plaintiff",
            second: "Defense"
        },
        teams: {
            first: "Team 1",
            second: "Team 2"
        },
        presidingJudge: "Brad Jones",
        scoringJudgeFirst: "Julie Chambers",
        scoringJudgeSecond: "Mark Price",
        scoringJudgeThird: "Victor Oladipo",
        zoomLink: "link",
        teamRosterLink: "courtroom1"
    },
    {
        courtroom: 2,
        sides: {
            first: "Plaintiff",
            second: "Defense"
        },
        teams: {
            first: "Trinity School (Worth a Shot)",
            second: "Carmel HS (Buzzd Lightyear)"
        },
        presidingJudge: "Walter White",
        scoringJudgeFirst: "Jon Snow",
        scoringJudgeSecond: "Sansa Stark",
        scoringJudgeThird: "",
        zoomLink: "link",
        teamRosterLink: "courtroom1"
    },
    {
        courtroom: 3,
        sides: {
            first: "Plaintiff",
            second: "Defense"
        },
        teams: {
            first: "Team 5",
            second: "Team 6"
        },
        presidingJudge: "Brad Jones",
        scoringJudgeFirst: "Julie Chambers",
        scoringJudgeSecond: "Mark Price",
        scoringJudgeThird: "Victor Oladipo",
        zoomLink: "link",
        teamRosterLink: "courtroom1"
    },
    {
        courtroom: 4,
        sides: {
            first: "Plaintiff",
            second: "Defense"
        },
        teams: {
            first: "Team 7",
            second: "Team 8"
        },
        presidingJudge: "Brad Jones",
        scoringJudgeFirst: "Julie Chambers",
        scoringJudgeSecond: "Mark Price",
        scoringJudgeThird: "",
        zoomLink: "link",
        teamRosterLink: "courtroom1"
    },
    {
        courtroom: 5,
        sides: {
            first: "Plaintiff",
            second: "Defense"
        },
        teams: {
            first: "Team 9",
            second: "Team 10"
        },
        presidingJudge: "Brad Jones",
        scoringJudgeFirst: "Julie Chambers",
        scoringJudgeSecond: "Mark Price",
        scoringJudgeThird: "Victor Oladipo",
        zoomLink: "link",
        teamRosterLink: "courtroom1"
    },
    {
        courtroom: 6,
        sides: {
            first: "Plaintiff",
            second: "Defense"
        },
        teams: {
            first: "Team 11",
            second: "Team 12"
        },
        presidingJudge: "Brad Jones",
        scoringJudgeFirst: "Julie Chambers",
        scoringJudgeSecond: "Mark Price",
        scoringJudgeThird: "Victor Oladipo",
        zoomLink: "link",
        teamRosterLink: "courtroom1"
    },
    {
        courtroom: 7,
        sides: {
            first: "Plaintiff",
            second: "Defense"
        },
        teams: {
            first: "Team 13",
            second: "Team 14"
        },
        presidingJudge: "Brad Jones",
        scoringJudgeFirst: "Julie Chambers",
        scoringJudgeSecond: "Mark Price",
        scoringJudgeThird: "",
        zoomLink: "link",
        teamRosterLink: "courtroom1"
    }
]

var m_region = "West"
var m_round = {
    id: 1
}


function Schedule(params) {
    const location = useLocation();
    const navigate = useNavigate();
    const [tournament, setTournament] = useState(location.state? location.state.tournament:getTournament())
    const [round, setRound] = useState(location.state? location.state.round:m_round)
    const [region, setRegion] = useState(location.state? location.state.region:m_region)
    const [scheduleData, setSchedule] = useState([])
    const [competition, setCompetition] = useState({})
    const [byeTeams, setByeTeams] = useState([])
    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [changeTime, setChangeTime] = useState(false)
    const [editRoom, setEditRoom] = useState()

    useEffect(() => {
        // setSchedule(data)
        const login_stat = checkLogin()
        if (login_stat == false) {
            navigate('/require_login')
        } else if (location.state == undefined || location.state.tournament == undefined || location.state.round == undefined
                    || location.state.region == undefined) {
            navigate('/dashboard')
        }
        else {
            checkToken().then((expired) => {
                if (expired) {
                    navigate('/expired');
                } else {
                    getSchedule();
                    setRound(location.state.round)
                    setTournament(location.state.tournament)
                    setRegion(location.state.region)
                }
            });
            // getSchedule();
            // setRound(location.state.round)
            // setTournament(location.state.tournament)
            // setRegion(location.state.region)
            
        }
    }, []);
    const getSchedule = async() => {
        const data = {tournament_id: location.state.tournament.id, round_num:location.state.round.id, region: location.state.region}
        console.log("body", data)
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
            const response = await fetch(config.API_BASE_URL + "/getSchedule", requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                // saveToken(data.access_token);
                console.log(data)
                if (data.schedule.schedule.time) {
                    setDate(new Date(data.schedule.schedule.time))
                } else {
                    console.log("Time not set yet")
                    setChangeTime(true);
                }
                setCompetition(data.schedule.schedule)
                setByeTeams(data.schedule.bye_teams)
                setSchedule(data.schedule.matches)
                console.log(scheduleData)
            } else {
                console.log("error fetching schedules")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const updateTime = async() => {
        setLoading(true)
        let UTC_date = date.toISOString();
        console.log(UTC_date)
        const data = { tournament_id: tournament.id, schedule_id: competition.id, time:UTC_date}
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
            console.log("Creating zoom Links")
            const response = await fetch(config.API_BASE_URL + '/updateZoom', requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                // saveToken(data.access_token);
                setByeTeams(data.schedule.bye_teams)
                setSchedule(data.schedule.matches)
                setChangeTime(false)
            } else {
                console.log("error creating zoom links tournament")
            }
        } catch (error) {
            console.log(error)
        }
        setOpen(false)

    }
    // TODO
    function exportToPDF(params) {
        const MyDocument = () => (
            <Document>
              <Page size="A4">
                <View>
                  <Text>Section #1</Text>
                </View>
                <View>
                    <Schedule />
                </View>
              </Page>
            </Document>
        );
        ReactPDF.render(<MyDocument />, `${__dirname}/example.pdf`);
        console.log("rendered to pdf and saved");
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
            onClick={()=>{navigate('/round', {state:{tournament: tournament, round:round}})}}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size:30 }}>
                <BsFillArrowLeftCircleFill/>
                </IconContext.Provider> Back to Competitions
            </div>
            <div className="Tournament">
            <div className="Round-x">
                <div className="Schedule-header">
                    <h3 style={{ textAlign: "center", color:"white", marginTop:50}}>{region + " Regional Competition (Round" + round.id + ")"}
                    <br></br>{date? "":""}</h3>
                </div>
                <div style={{color:"white", marginLeft: 20}}>
                    <div>Competition Date and Time: </div>
                    {!changeTime?
                    <div style={{display: "inline-block", color: "orange"}}>
                        <div>{date.toLocaleString()}
                        <button onClick={()=>(setChangeTime(true))}
                        style={{margin: 20, backgroundColor: "green", color: "white", borderRadius: 5, height:30}}>
                            Change Date{"&"}Time</button></div>
                    </div>
                    :<div>
                        <div style={{backgroundColor: "orange", display: "inline-block", color: "black"}}>
                        <DateTimePicker
                            onChange={(newDate) => {setDate(newDate)}}
                            value={date}
                            yearPlaceholder="yyyy"
                            dayPlaceholder="dd"
                            monthPlaceholder="mm"
                            hourPlaceholder="hh"
                            minutePlaceholder="mm"
                            secondPlaceholder="ss"
                            maxDetail="second"
                            minDate={new Date()} /></div>
                        <button style={{margin:20}} disabled={date <= new Date()}
                        onClick={()=>{setOpen(true)}}>Confirm</button>
                        <button style={{margin:10}} onClick={()=>{setChangeTime(false)}}>Cancel</button>
                    </div>
                    }
                </div>
                <table className="Rtable">
                    <th id="Courtroom">Courtroom</th>
                    <th id="Side">Side</th>
                    <th id="Team">Team</th>
                    <th id="Judge">Presiding Judge</th>
                    <th id="Judge">Scoring Judge</th>
                    <th id="Judge">Scoring Judge</th>
                    <th id="Judge">Scoring Judge</th>
                    <th id="Zoom-Link">Zoom Link</th>
                    <th id="Link">Team Roster</th>
                    {
                        scheduleData.map((item, index) => {
                            return (
                                <tr id="table-line-height" key={index}>
                                    <td>{item.courtroom}</td>
                                    <td>
                                        <tr>
                                            <td id="inner-table">{item.sides.first}</td>
                                        </tr>
                                        <hr class="solid"></hr>
                                        <tr>
                                            <td id="inner-table">{item.sides.second}</td>
                                        </tr>
                                    </td>
                                    <td>
                                        <tr>
                                            <td id="inner-table"
                                            style={{cursor:'pointer', textDecorationLine: "underline"}}
                                            onClick={() => {navigate('/team', {state:{tournament: tournament, team: item.teams.first, round: location.state.round, region: location.state.region}})}}>{item.teams.first}</td>
                                        </tr>
                                        <hr class="solid"></hr>
                                        <tr>
                                            <td id="inner-table"
                                            style={{cursor:'pointer', textDecorationLine: "underline"}}
                                            onClick={() => {navigate('/team', {state:{tournament: tournament, team: item.teams.second, round: location.state.round, region: location.state.region}})}}>{item.teams.second}</td>
                                        </tr>
                                    </td>
                                    <td>{item.presidingJudge}</td>
                                    <td>{item.scoringJudgeFirst}</td>
                                    <td>{item.scoringJudgeSecond}</td>
                                    <td>{item.scoringJudgeThird}</td>
                                    <td id="Zoom-link-text"><a href={item.zoomLink} target="_blank" rel="noreferrer">{item.zoomLink}</a></td>
                                    <td><div
                                        style={{cursor:'pointer', textDecorationLine: "underline"}}
                                        onClick={() => {
                                            navigate('/schedule/teamRoster', {state:{tournament: tournament, courtroom_id: item.courtroom, round: round, region:region}})
                                        }}>TeamRoster</div>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </table>
            </div>
            </div>
            {open? <Popup
                content={
                  <div>
                  <h4>Change the Date and Time to </h4>
                  <h4>{date.toString()}?</h4>
                  <p>This will generate a new Zoom Link for each match</p>
                  {loading? <p style={{color: "red"}}>  Changing Date and Time for the competition... </p>:null}
                  <button onClick={()=>{setOpen(false)}}  style={{float: 'left'}}>Cancel</button>
                  <button onClick={updateTime}  style={{float: 'right'}} disabled={loading}>Confirm</button>
                  </div>
                }
                handleClose={()=>{setOpen(false);}}
            />: null}
            <div style={{margin: 20}}>
                <input type="text" value={editRoom}
                   onChange={e => {setEditRoom(e.target.value)}}/>
                <button style={{width:150, margin:20}} onClick={() => {navigate('/edit_judges',
                    {state:{tournament: tournament, room: editRoom, matches: scheduleData, round:round, region:region}} )}}> 
                    Edit Judges</button>
            </div>
            <h3 style={{color: "red", paddingLeft: "15px"}}>Bye Teams: {byeTeams}</h3>
        </div>
    );
}

const center = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

export default Schedule;