
import React, {useState, useEffect} from "react";
import './Tournaments.css'
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, getToken, saveToken, saveTournament, checkLogin, checkToken } from "../../utils/storageUtils";
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { MdAddCircle, MdDeleteForever } from "react-icons/md";
import config from "../../config";
import Popup from '../Popup/Popup';


var data = [
    {
        id: 1,
        name: "Tournament 1",
        year: 2019
    },
    {
        id: 2,
        name: "Tournament 2",
        year: 2020
    },
    {
        id: 3,
        name: "Tournament 3",
        year: 2021
    },
    {
        id: 4,
        name: "Tournament 4",
        year: 2022
    },
]

function Tournaments() {
    const location = useLocation();
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([])
    const [tournament_name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [isDeletedOpen, setIsDeletedOpen] = useState(false)
    const [selected, setSelected] = useState()
    const [completedTournaments, setCompletedTournaments] = useState([])

    useEffect(()=>{
        const login_stat = checkLogin()
        if (login_stat == false) {
            navigate('/require_login')
        } else {
            checkToken().then((expired) => {
                if (expired) {
                    navigate('/expired');
                } else {
                    getTournaments()
                    getCompletedTournaments()
                }
            })
            // getTournaments()
            // getCompletedTournaments()
        }
    }, [refresh]);

    const getTournaments = async() => {
        const data = {uid: getUser().id}
        // const data = {uid: 1}
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
            const response = await fetch(config.API_BASE_URL+'/getTournaments', requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                setTournaments(data.tournaments)
                console.log(data.tournaments)
                // saveToken(data.access_token)
            } else {
                console.log(data)
                console.log("error creating a new tournament")
            }
        } catch (error) {
            console.log(error)
        }
    };

    const getCompletedTournaments = async() => {
        const data = {uid: getUser().id}
        // const data = {uid: 1}
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
            const response = await fetch(config.API_BASE_URL+'/getCompletedTournaments', requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                setCompletedTournaments(data.tournaments)
                //console.log(data.tournaments)
            } else {
                console.log("error getting completed tournaments",  data)
            }
        } catch (error) {
            console.log(error)
        }
    };

    const deleteTournament = async() => {
        setLoading(true)
        console.log("deleting Tournament", selected.id)
        const data = {tournament_id: selected.id}
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json',
                'Accept': 'application/json',
                //   Authorization: 'Bearer ' + getToken()
            },
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch(config.API_BASE_URL+'/removeT', requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                console.log(data)
                setIsDeletedOpen(false)
                setLoading(false)
                setRefresh(!refresh)
                // saveToken(data.access_token)
            } else {
                console.log("error deleting tournaments")
            }
        } catch (error) {
            console.log(error)
        }
    };

    const createTournament = async() => {
        console.log("Creating Tournament")
        setLoading(true)
        const data = {uid: getUser().id, name: tournament_name}
        const requestOptions = {
            method: "POST",
            headers: {'Content-Type': 'application/json',
                'Accept': 'application/json',
                //   Authorization: 'Bearer ' + getToken()
            },
            body: JSON.stringify(data)
        }
        try {
            const response = await fetch(config.API_BASE_URL+'/createT', requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                console.log(data)
                navigate('/upload', {state: {tournament: data.tournament}})
                // saveToken(data.access_token)
            } else {
                console.log("error fetching tournaments")
            }
            setLoading(false)
            setIsOpen(!isOpen);
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
                onClick={()=>{navigate('/dashboard')}}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size:30 }}>
                    <BsFillArrowLeftCircleFill/>
                </IconContext.Provider> Back to Dashboard
            </div>
            <h2 style={{color: "orange", paddingLeft: "15px"}}>Tournaments List</h2>
            <ul class="a" style={{ color: "white", fontSize:"20px"}}>
                {
                    tournaments.map((item, index) => {
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
                                    <label
                                        style={{cursor:'pointer', textDecorationLine: "underline"}}
                                        onClick={() => {
                                            saveTournament(item);
                                            navigate('/tournament', {state:{tournament: item}})
                                        }}>{item.name + " ------ YEAR: " + item.year}
                                    </label>
                                    <span onClick={() => {setIsDeletedOpen(true);setSelected(item)}}>
                                    <IconContext.Provider value={{ color: "white", className: "react-icons", size:30 }}>
                                    <MdDeleteForever/>
                                    </IconContext.Provider>
                                    </span>
                                </li>
                            </div>
                        )
                    })
                }
            </ul>
            <h2 style={{color: "orange", paddingLeft: "15px"}}>Completed Tournaments List</h2>
            <ul class="a" style={{ color: "white", fontSize:"20px"}}>
                {
                    completedTournaments.map((item, index) => {
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
                                    <label
                                        style={{cursor:'pointer', textDecorationLine: "underline"}}
                                        onClick={() => {
                                            saveTournament(item);
                                            navigate('/tournament', {state:{tournament: item}})
                                        }}>{item.name + " ------ YEAR: " + item.year}
                                    </label>
                                    <span onClick={() => {setIsDeletedOpen(true);setSelected(item)}}>
                                    <IconContext.Provider value={{ color: "white", className: "react-icons", size:30 }}>
                                    <MdDeleteForever/>
                                    </IconContext.Provider>
                                    </span>
                                </li>
                            </div>
                        )
                    })
                }
            </ul>
            <div
                style={{color: "white", margin:10, textAlign: "center", display: "inline-block", cursor: "pointer"}}
                onClick={()=>{setIsOpen(!isOpen);}}>
                <IconContext.Provider value={{ color: "white", className: "react-icons", size:35 }}>
                    <MdAddCircle/>
                </IconContext.Provider> Create New Tournament
            </div>
            {isOpen? <Popup
                content={
                    <div>
                        <h3>Please give a name to the new tournament:</h3>
                        <input value={tournament_name} onChange={e => setName(e.target.value)}></input>
                        <p/>
                        <button onClick={()=>{setIsOpen(false)}} style={{float: 'left'}}>Cancel</button>
                        <button disabled={loading} onClick={createTournament} style={{float: 'right'}}>Submit</button>
                        {loading? <p style={{color: "red" }}>  Creating New Tournament... </p>:null}
                    </div>
                }
                handleClose={()=>{setIsOpen(!isOpen);}}
            />: null}

            {isDeletedOpen? <Popup
                content={
                    <div>
                        <h3>Are you sure to delete this tournament?</h3>
                        <p style={{color: "green"}}>You can ask head admin to retrieve the deleted tournaments</p>
                        <button onClick={()=>{setIsDeletedOpen(false)}} style={{float: 'left'}}>Cancel</button>
                        <button disabled={loading} onClick={deleteTournament} style={{float: 'right'}}>Yes</button>
                        {loading? <p style={{color: "red" }}> Deleting {selected.name}... </p>:null}
                    </div>
                }
                handleClose={()=>{setIsDeletedOpen(!isDeletedOpen);}}
            />: null}

        </div>
    );
}

export default Tournaments;