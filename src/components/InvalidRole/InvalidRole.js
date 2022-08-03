import React, {useEffect, useState} from 'react';
import {getUser} from "../../utils/storageUtils";
import {useNavigate} from "react-router-dom";


function InvalidRole() {

    const [user, setUser] = useState(getUser())
    const [valid, setValid]= useState(true)
    const navigate = useNavigate()
    useEffect(() => {
        setUser(getUser())
        if (user.role === 'admin') {
            setValid(false)
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000);
        } else {
            setValid(true)
            setTimeout(() => {
                navigate('/dashboard')
            }, 2000);
        }
    }, []);

    return (
        <div>
            {valid ? <h1 style={{color: "#f7a642", textAlign: "center"}}> Oops! You should have access to that page </h1> :
                <h1 style={{color: "#f7a642", textAlign: "center"}}> You do not have access to this page</h1>}
                <h2 style={{color: "#f7a642", textAlign: "center"}}>Redirecting to Dashboard...</h2>
        </div>

    )
}




export default InvalidRole;