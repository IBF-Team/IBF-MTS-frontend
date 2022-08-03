import React, {useState, useEffect} from "react";
import './Tournaments.css'
import { useLocation, useNavigate } from "react-router-dom";
import { getUser, getToken, saveToken, saveTournament, checkLogin, checkToken } from "../../utils/storageUtils";
import { IconContext } from "react-icons";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import { MdAddCircle, MdDeleteForever } from "react-icons/md";
import config from "../../config";
import Popup from '../Popup/Popup';


function DeletedTournaments() {
    const location = useLocation();
    const navigate = useNavigate();
    const [tournaments, setTournaments] = useState([])
    const [tournament_name, setName] = useState("")
    const [loading, setLoading] = useState(false)
    const [refresh, setRefresh] = useState(false)
    const [isDeletedOpen, setIsDeletedOpen] = useState(false)
    const [isRetrieveOpen, setIsRetrieveOpen] = useState(false)
    const [selected, setSelected] = useState()
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
                }
            })
            // getTournaments()
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
            const response = await fetch(config.API_BASE_URL+'/getDeletedTournaments', requestOptions)
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
            const response = await fetch(config.API_BASE_URL+'/deleteT', requestOptions)
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

    const retrieveTournament = async() => {
        console.log("Retrieving Tournament")
        setLoading(true)
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
            const response = await fetch(config.API_BASE_URL+'/retrieveT', requestOptions)
            const data = await response.json();
            if (data && data.code == 0) {
                console.log(data)
                navigate('/upload', {state: {tournament: data.tournament}})
                // saveToken(data.access_token)
            } else {
                console.log("error fetching tournaments")
            }
            setIsRetrieveOpen(false)
            setLoading(false)
            setRefresh(!refresh)
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
            <h2 style={{color: "orange", paddingLeft: "15px"}}>Deleted Tournaments List</h2>
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
                                    <label >{item.name + " -- YEAR: " + item.year}</label>
                                    <button style={button1}
                                    onClick={()=>{setIsRetrieveOpen(true); setSelected(item)}}>Retrieve</button>
                                    <button style={button2}
                                    onClick={()=>{setIsDeletedOpen(true); setSelected(item)}}>Delete Permanently</button>
                                </li>
                            </div>
                        )
                    })
                }
            </ul>
            {isRetrieveOpen? <Popup
                content={
                  <div>
                  <h2>Retrieve this tournament?</h2>
                  <button onClick={()=>{setIsRetrieveOpen(false)}} style={{float: 'left'}}>Cancel</button>
                  <button disabled={loading} onClick={retrieveTournament} style={{float: 'right'}}>Yes</button>
                  {loading? <p style={{color: "red" }}> Retrieving {selected.name}... </p>:null}
                  </div>
                }
                handleClose={()=>{setIsRetrieveOpen(!isRetrieveOpen);}}
            />: null}
            {isDeletedOpen? <Popup
                content={
                  <div>
                  <h2>Delete this tournament permanently?</h2>
                  <p style={{color:"red"}}>Note there's no way to get it back once it's deleted permanently!</p>
                  <button disabled={loading}  onClick={()=>{setIsDeletedOpen(false)}} style={{float: 'left'}}>Cancel</button>
                  <button disabled={loading}  onClick={deleteTournament} style={{float: 'right'}}>Yes</button>
                  {loading? <p style={{color: "red" }}> Deleting {selected.name}... </p>:null}
                  </div>
                }
                handleClose={()=>{setIsDeletedOpen(!isDeletedOpen);}}
            />: null}

        </div>
    );
}

const button1 = {
    backgroundColor: "green",
    color: "white",
    borderRadius: "10px",
    border: "None",
    height: "25px",
    marginLeft: 15,
    cursor:'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    float: "right"
}

const button2 = {
    backgroundColor: "red",
    color: "black",
    borderRadius: "10px",
    border: "None",
    height: "25px",
    marginLeft: 15,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    float: "right"
}

const cancelButton = {
    
}

export default DeletedTournaments;