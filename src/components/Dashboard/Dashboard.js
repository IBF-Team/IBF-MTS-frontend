import React, {useState, useEffect}from "react";
import { useNavigate } from 'react-router-dom';
// import userToken from "../../utils/storageUtils";
import { checkLogin, getUser, removeToken, checkToken, getToken, saveToken} from "../../utils/storageUtils.js";
import config from "../../config.js";

function Dashboard() {
    // const {user, token,loggedIn, getToken, saveToken, removeToken, getUser, saveUser, removeUser, checkLogin, saveLogin } = userToken();
    const navigate = useNavigate();
    const [user, setUser] = useState(getUser())
    const [loggedIn, setLoggedIn] = useState(checkLogin())
    const [root, setRoot] = useState(false)

    useEffect(() => {
        const login_stat = checkLogin()
        console.log(login_stat)
        setUser(getUser())
        if (login_stat === false) {
            navigate('/require_login')
        } else {
            checkToken().then((expired) => {
                if (expired) {
                    navigate('/expired');
                } else {
                    setLoggedIn(true);
                    if (user.role === 'root') {
                        setRoot(true);
                    }
                }
            });
            // console.log(checkToken());
            // setLoggedIn(true);
        }
    }, []);
    
    return(
        <div className="home">
            <div>
            <h1 style={center}> Your Dashboard</h1>
            <div style={center}> <button style={button}
             onClick={()=>{navigate("/tournaments")}}>View/Create Tournaments</button></div>
            {root && <div style={center}><button style={button}
                 onClick={()=>{navigate("/deleted_tournaments")}}>Retrieve Tournaments</button></div>}
            {root &&  <div style={center}> <button style={button}
             onClick={()=>{navigate("/manage_accounts")}}>Manage Account</button></div>}
             <div style={center}> <button style={button}
             onClick={()=>{navigate("/edit_account")}}>Edit Account</button> </div>
             </div>
        </div>
    )
}

const center = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}
export const button = {
    width: "20%", 
    height: 30, 
    color: "black", 
    fontWeight: 'bold',
    margin: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
}

export default Dashboard;