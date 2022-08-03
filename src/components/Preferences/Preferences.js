import React, {useEffect, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {checkLogin} from "../../utils/storageUtils";

export default function Preferences() {

  const [user, setUser] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    const login_stat = checkLogin()
    if (login_stat === false) {
      if (login_stat === false) {
        navigate('/require_login')
      }
    }
  }, []);

  return(
    <h2>Preferences</h2>
  );
}