import { useState } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import config from '../config'

export const getToken = () => {
  const userToken = localStorage.getItem('token')
  // only returns a token if it exists hence the use of the && conditional operator.
  return userToken && userToken
}

export const saveToken = (userToken) => {
  localStorage.setItem('token', userToken)
  // setToken(userToken)
}

export const removeToken = () => {
  localStorage.removeItem("token");
  // setToken(null)
}

export const getUser = () => {
  const user = localStorage.getItem('user')
  return JSON.parse(user)
}

export const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user))
  // setUser(user)
}

export const removeUser = () => {
  localStorage.removeItem('user');
  // setUser(null)
}


export const checkToken = async() => {
  const requestOptions = {
      method: "GET",
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
           Authorization: 'Bearer ' + getToken()
      },
  }
  try {
      const response = await fetch(config.API_BASE_URL + '/checkSession', requestOptions)
      const data = await response.json();
      console.log(data)
      if (data.status == 401) {
        console.log("session expired")
        saveLogin(false);
        return true
      }
      else if (data.status == 200) {
        if (data.access_token)
          saveToken(data.access_token);
        saveLogin(true);
        return false
      } else {
        return false
      }
  } catch (error) {
      console.log("session expired")
      console.log(error);
      saveLogin(false);
      return true;
  }
}

export const checkLogin = () => {
  var loggedIn = false
  loggedIn = localStorage.getItem('loggedIn')
  return JSON.parse(loggedIn)
}

export const saveLogin = (status) => {
  localStorage.setItem('loggedIn', status)
  // setLoggedIn(status)
}

export const getTournament = () => {
  const tournament = localStorage.getItem('tournament')
  return JSON.parse(tournament)
}

export const saveTournament = (tournament) => {
  localStorage.setItem('tournament', JSON.stringify(tournament))
}

export const removeTournament = () => {
  localStorage.removeItem('tournament');
}


export const getRound = () => {
  const tournament = localStorage.getItem('round')
  return JSON.parse(tournament)
}

export const saveRound = (round) => {
  localStorage.setItem('round', JSON.stringify(round))
}

export const removeRound = () => {
  localStorage.removeItem('round');
}

export const getTeam = () => {
  const team = localStorage.getItem('team')
  return JSON.parse(team)
}

// export const saveTeam = (teams) = {
//   localStorage.setItem('team', JSON.stringify(teams))
// }

export const removeTeam = () => {
  localStorage.removeItem('team')
}


export const getRegion = () => {
  const tournament = localStorage.getItem('region')
  return JSON.parse(tournament)
}

export const saveRegion = (region) => {
  localStorage.setItem('region', JSON.stringify(region))
}

export const removeRegion = () => {
  localStorage.removeItem('region');
}
